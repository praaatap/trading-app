import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { validationResult } from 'express-validator';

const prisma = new PrismaClient();

export const registerUser = async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;

    try {
        let user = await prisma.user.findUnique({ where: { email } });
        if (user) {
            return res.status(400).json({ msg: 'User already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        user = await prisma.user.create({
            data: { name, email, password: hashedPassword },
        });

        const payload = { user: { id: user.id } };
        const token = jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: '5h' });

        res.status(201).json({ token });
    } catch (err) {
        console.error((err as Error).message);
        res.status(500).send('Server error');
    }
};

export const loginUser = async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        const payload = { user: { id: user.id } };
        const token = jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: '5h' });

        res.json({ token });
    } catch (err) {
        console.error((err as Error).message);
        res.status(500).send('Server error');
    }
};

export const getCurrentUser = async (req: Request, res: Response) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: (req as any).user.id },
            select: { id: true, name: true, email: true, createdAt: true },
        });
        res.json(user);
    } catch (err) {
        console.error((err as Error).message);
        res.status(500).send('Server error');
    }
};