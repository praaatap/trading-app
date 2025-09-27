import { Request, Response } from 'express';
// In a real app, you'd use bcrypt, jwt, and your User model
// import bcrypt from 'bcryptjs';
// import jwt from 'jsonwebtoken';

export const signUp = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Please provide all required fields.' });
  }
  
  // --- DATABASE LOGIC HERE ---
  // 1. Check if user already exists
  // 2. Hash the password using bcrypt
  // 3. Create a new user in the database
  // ---------------------------

  console.log('Signing up user:', { name, email });
  // Respond with a success message and a token
  res.status(201).json({ 
    message: 'User registered successfully!',
    token: 'mock-jwt-token-for-new-user' 
  });
};

export const signIn = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Please provide email and password.' });
  }

  console.log('Signing in user:', { email });
  res.status(200).json({
    message: 'Login successful!',
    token: 'mock-jwt-token-for-signed-in-user',
    user: { id: 'user123', name: 'Pratap Singh', email: email }
  });
};

export const getMyProfile = async (req: Request, res: Response) => {
    // The user's info is attached to the request by the authMiddleware
    // In a real app, this would be `(req as any).user` or a custom Request type
    const user = { id: 'user123', name: 'Pratap Singh', email: 'pratap@example.com' };

    res.status(200).json(user);
};