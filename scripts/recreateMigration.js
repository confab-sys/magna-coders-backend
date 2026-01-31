#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

const migrationsDir = path.resolve(__dirname, '..', 'prisma', 'migrations');
const defaultMigration = '20260127083202';

function usage() {
  console.log('Usage: node scripts/recreateMigration.js [migration-folder-name] [--yes]');
  console.log('Example: node scripts/recreateMigration.js 20260127083202 --yes');
}

async function prompt(question) {
  return new Promise((resolve) => {
    process.stdout.write(question + ' ');
    process.stdin.resume();
    process.stdin.setEncoding('utf8');
    process.stdin.once('data', function (data) {
      process.stdin.pause();
      resolve(data.toString().trim());
    });
  });
}

(async () => {
  const args = process.argv.slice(2);
  if (args.includes('-h') || args.includes('--help')) {
    usage();
    process.exit(0);
  }

  const generateOnly = args.includes('--generate-only') || args.includes('-g');
  const yesFlag = args.includes('--yes') || args.includes('-y');
  const migrationNameArg = args[0] && !args[0].startsWith('--') ? args[0] : defaultMigration;

  if (generateOnly) {
    console.log('Generate-only mode: will not delete any existing migration folder.');
    // Run the diff and write migration file
    const ts = new Date().toISOString().replace(/[:.]/g, '-');
    const folder = path.join(migrationsDir, `${new Date().toISOString().replace(/[:.]/g,'').replace(/T/,'_').slice(0,15)}_recreate`);
    try {
      fs.mkdirSync(folder, { recursive: true });
    } catch (err) {
      console.error('Failed to create migration folder:', err);
      process.exit(1);
    }

    console.log(`Writing SQL diff to ${folder}/migration.sql`);
    const diff = spawn('npx', ['prisma', 'migrate', 'diff', '--from-empty', '--to-schema-datamodel', 'prisma/schema.prisma', '--script'], { stdio: ['ignore', 'pipe', 'pipe'] });
    let sql = '';
    let err = '';
    diff.stdout.on('data', (d) => { sql += d.toString(); });
    diff.stderr.on('data', (d) => { err += d.toString(); });
    diff.on('exit', (dcode) => {
      if (dcode === 0 && sql.trim()) {
        fs.writeFileSync(path.join(folder, 'migration.sql'), sql);
        console.log(`Created ${folder}/migration.sql (generate-only).`);
        console.log('Review and apply with `npx prisma migrate deploy` when ready.');
        process.exit(0);
      } else {
        console.error('Diff command failed:', err || sql);
        process.exit(dcode || 1);
      }
    });
    return;
  }

  // Resolve folder: exact match or prefix match
  let migrationDirName = null;
  const exactPath = path.join(migrationsDir, migrationNameArg);
  if (fs.existsSync(exactPath)) {
    migrationDirName = migrationNameArg;
  } else {
    const entries = fs.readdirSync(migrationsDir).filter((e) => e.startsWith(migrationNameArg));
    if (entries.length === 1) {
      migrationDirName = entries[0];
      console.log(`Found migration folder by prefix: ${migrationDirName}`);
    } else if (entries.length > 1) {
      console.error('Multiple migration folders match the prefix. Be more specific:');
      entries.forEach((e) => console.error('  -', e));
      process.exit(1);
    }
  }

  if (!migrationDirName) {
    console.error(`Migration folder not found for: ${migrationNameArg}`);
    process.exit(1);
  }

  const targetDir = path.join(migrationsDir, migrationDirName);

  console.log('About to remove migration folder:', targetDir);
  console.log('WARNING: Deleting migration files can cause schema drift if the migration has already been applied to a database.');

  if (!yesFlag) {
    const answer = await prompt("Type 'yes' to confirm deletion:");
    if (answer.toLowerCase() !== 'yes') {
      console.log('Aborting. No changes made.');
      process.exit(0);
    }
  }

  // Delete the migration folder
  try {
    fs.rmSync(targetDir, { recursive: true, force: true });
    console.log('Deleted migration folder:', targetDir);
  } catch (err) {
    console.error('Failed to delete migration folder:', err);
    process.exit(1);
  }

  // Run prisma migrate dev to create a new migration (and try to apply it)
  console.log('\nAttempting: npx prisma migrate dev');
  let migrate = spawn('npx', ['prisma', 'migrate', 'dev'], { stdio: 'inherit' });

  migrate.on('exit', async (code) => {
    if (code === 0) {
      console.log('\nMigration command completed successfully.');
      console.log('Review `prisma/migrations` for the new migration and run tests or start the app.');
      process.exit(0);
    }

    console.error(`\nPrisma migrate dev failed with exit code ${code}. Attempting to generate migration files only (no DB apply).`);

    const ts = new Date().toISOString().replace(/[:.]/g, '-');
const name = `recreate-${migrationDirName || 'migration'}-${ts}`;

    console.log(`\nRunning: npx prisma migrate dev --create-only --name ${name}`);
    const createOnly = spawn('npx', ['prisma', 'migrate', 'dev', '--create-only', '--name', name], { stdio: 'inherit' });

    createOnly.on('exit', (c) => {
      if (c === 0) {
        console.log('\nCreated migration files successfully (create-only).');
        console.log('Review and edit the new migration in `prisma/migrations` if needed, then apply with `npx prisma migrate deploy` or `npx prisma migrate dev`.');
        process.exit(0);
      }

      console.error(`\nFailed to create migration files. Exit code ${c}. Trying an SQL diff fallback.`);

      // Fallback: generate SQL diff from empty DB to the current datamodel and write a migration.sql file
      const diff = spawn('npx', ['prisma', 'migrate', 'diff', '--from-empty', '--to-schema-datamodel', 'prisma/schema.prisma', '--script'], { stdio: ['ignore', 'pipe', 'pipe'] });

      let sql = '';
      diff.stdout.on('data', (d) => { sql += d.toString(); });
      let err = '';
      diff.stderr.on('data', (d) => { err += d.toString(); });

      diff.on('exit', (dcode) => {
        if (dcode === 0 && sql.trim()) {
          const name = `recreate-${migrationName || 'migration'}-${new Date().toISOString().replace(/[:.]/g, '-')}`;
          const folder = path.join(migrationsDir, `${new Date().toISOString().replace(/[:.]/g,'').replace(/T/,'_').slice(0,15)}_${name}`);
          try {
            fs.mkdirSync(folder, { recursive: true });
            fs.writeFileSync(path.join(folder, 'migration.sql'), sql);
            console.log(`\nWrote SQL diff to ${folder}/migration.sql`);
            console.log('Review the SQL and apply with `npx prisma migrate deploy` when ready.');
            process.exit(0);
          } catch (writeErr) {
            console.error('Failed to write migration file:', writeErr);
            console.error('Diff SQL (truncated):\n', sql.slice(0, 1000));
            process.exit(1);
          }
        } else {
          console.error('Diff command failed:', err || sql);
          process.exit(dcode || 1);
        }
      });
    });
  });
})();
