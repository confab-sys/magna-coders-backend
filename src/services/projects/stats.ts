export async function getProjectStats(projectModel: any) {
  const [openCount, inProgressCount, completedCount] = await Promise.all([
    projectModel.findMany({ status: 'OPEN', limit: 1 }).then((r: any) => r.totalCount),
    projectModel.findMany({ status: 'IN_PROGRESS', limit: 1 }).then((r: any) => r.totalCount),
    projectModel.findMany({ status: 'COMPLETED', limit: 1 }).then((r: any) => r.totalCount),
  ]);
  return {
    open: openCount,
    inProgress: inProgressCount,
    completed: completedCount,
    total: openCount + inProgressCount + completedCount,
  };
}