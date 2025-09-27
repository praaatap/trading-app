import { Router } from "express";
import { signUp, signIn, getMyProfile } from './auth.controller'; // Remove .ts
import { authMiddleware } from '../../middleware/auth.middleware'; // Remove .ts

const router = Router();

// @route   POST /api/auth/signup
// @desc    Register a new user
// @access  Public
router.post("/signup", signUp);

// @route   POST /api/auth/signin
// @desc    Authenticate user and get token
// @access  Public
router.post("/signin", signIn);

// @route   GET /api/auth/me
// @desc    Get current user's profile
// @access  Private (requires token)
router.get("/me", authMiddleware, getMyProfile);

export default router;