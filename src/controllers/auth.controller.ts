import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import * as _ from 'underscore';
import { prisma } from '../config/prisma';

const JWT_SECRET = process.env.JWT_SECRET || '1f3b4b5b7b8c9d0e1f2a3b4c5d6e7f8g9h0i1j2k3l4m5n6o7p8q9r0s1t2u3v4w5x6y7z8';
const SESSION_EXPIRY = process.env.SESSION_EXPIRY || "30m";

/**
 * @desc   Register a new user
 * @route  POST /auth/register
 */
export const registerUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const { name, email, password, role } = req.body;

        if (!name || !email || !password) {
            res.status(400).json({ message: 'All fields are required' });
            return;
        }

        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            res.status(400).json({ message: 'Email already registered' });
            return;
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role: role === 'ADMIN' ? 'ADMIN' : 'USER',
            },
        });

        const createdUser = await prisma.user.findUnique({
            where: { id: newUser.id },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                createdAt: true,
                updatedAt: true,
            },
        });

        res.status(201).json({ message: 'User registered successfully', user: createdUser });
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

/**
 * @desc   User Login
 * @route  POST /auth/login
 */
export const loginUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            res.status(400).json({ message: 'Email and password are required' });
            return;
        }

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            res.status(401).json({ message: 'Invalid credentials' });
            return;
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            res.status(401).json({ message: 'Invalid credentials' });
            return;
        }
        // Generate JWT token
        const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: SESSION_EXPIRY as jwt.SignOptions['expiresIn'] });

        res.json({ message: 'Login successful', token, user: _.pick(user, ['id', 'name', 'role']) });
    } catch (error) {
        console.error('Error logging in:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
