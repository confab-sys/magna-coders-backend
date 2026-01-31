import express, { Router } from 'express';
import { asyncHandler } from '../middleware/errorHandler';
import { authenticateToken } from '../middleware/auth';
import { register, login, getUserProfile as getProfile, updateUserProfile as updateProfile, logout, refresh, activate } from '../controllers/auth';

const loginUser = login;
const signupUser = register;
const getUserProfile = getProfile;
const updateUserProfile = updateProfile;

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - email
 *         - username
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the user
 *         username:
 *           type: string
 *           description: User's username
 *         email:
 *           type: string
 *           description: User email address
 *         avatar_url:
 *           type: string
 *           nullable: true
 *           description: URL to user's avatar image
 *         location:
 *           type: string
 *           nullable: true
 *         bio:
 *           type: string
 *           nullable: true
 *         website_url:
 *           type: string
 *           nullable: true
 *         github_url:
 *           type: string
 *           nullable: true
 *         linkedin_url:
 *           type: string
 *           nullable: true
 *         twitter_url:
 *           type: string
 *           nullable: true
 *         whatsapp_url:
 *           type: string
 *           nullable: true
 *         availability:
 *           type: string
 *           nullable: true
 *         profile_complete_percentage:
 *           type: integer
 *           nullable: true
 *         created_at:
 *           type: string
 *           format: date-time
 *           nullable: true
 *     LoginRequest:
 *       type: object
 *       required:
 *         - identifier
 *         - password
 *       properties:
 *         identifier:
 *           type: string
 *           description: Email or username
 *         password:
 *           type: string
 *     RegisterRequest:
 *       type: object
 *       required:
 *         - username
 *         - email
 *         - password
 *       properties:
 *         username:
 *           type: string
 *         email:
 *           type: string
 *         password:
 *           type: string
 *         avatar_url:
 *           type: string
 *         location:
 *           type: string
 *         bio:
 *           type: string
 *         website_url:
 *           type: string
 *         github_url:
 *           type: string
 *         linkedin_url:
 *           type: string
 *         twitter_url:
 *           type: string
 *         whatsapp_url:
 *           type: string
 *         availability:
 *           type: string
 *       example:
 *         username: "jdoe"
 *         email: "john.doe@example.com"
 *         password: "S3cur3P@ssw0rd!"
 *         avatar_url: "https://example.com/avatars/jdoe.jpg"
 *         location: "Nairobi, Kenya"
 *         bio: "Full-stack developer, open-source contributor and tech blogger."
 *         website_url: "https://johndoe.dev"
 *         github_url: "https://github.com/johndoe"
 *         linkedin_url: "https://linkedin.com/in/johndoe"
 *         twitter_url: "https://twitter.com/johndoe"
 *         whatsapp_url: "+254712345678"
 *         availability: "open"
 *     UpdateUserRequest:
 *       type: object
 *       properties:
 *         username:
 *           type: string
 *         email:
 *           type: string
 *         password:
 *           type: string
 *         avatar_url:
 *           type: string
 *         bio:
 *           type: string
 *     AuthResponse:
 *       type: object
 *       properties:
 *         token:
 *           type: string
 *           description: JWT authentication token
 *         user:
 *           $ref: '#/components/schemas/User'
 */

const router: Router = express.Router();

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login a user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       401:
 *         description: Invalid credentials
 *       500:
 *         description: Server error
 */
router.post('/login', asyncHandler(loginUser));

/**
 * @swagger
 * /api/auth/refresh:
 *   post:
 *     summary: Refresh access token using a refresh token
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - refreshToken
 *             properties:
 *               refreshToken:
 *                 type: string
 *     responses:
 *       200:
 *         description: New access token issued
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *                 refreshToken:
 *                   type: string
 *       401:
 *         description: Invalid or expired refresh token
 */
router.post('/refresh', asyncHandler(refresh));
router.get('/activate', asyncHandler(activate));

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Logout user and revoke refresh token(s)
 *     tags: [Authentication]
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               refreshToken:
 *                 type: string
 *               userId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Logged out
 */
router.post('/logout', asyncHandler(logout));

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterRequest'
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       400:
 *         description: Invalid input
 *       409:
 *         description: User already exists
 *       500:
 *         description: Server error
 */
router.post('/register', asyncHandler(signupUser));

/**
 * @swagger
 * /api/auth/profile/{id}:
 *   get:
 *     summary: Get user profile
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: User ID
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: User not found
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get('/profile/:id', authenticateToken, asyncHandler(getUserProfile));

/**
 * @swagger
 * /api/auth/profile/{id}:
 *   put:
 *     summary: Update user profile
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: User ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateUserRequest'
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: User not found
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.put('/profile/:id', authenticateToken, asyncHandler(updateUserProfile));

export default router;