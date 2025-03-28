import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { prisma } from "../config/prisma";

const JWT_SECRET = process.env.JWT_SECRET || "your_secret_key";


export const authMiddleware = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        const token = req.header("Authorization")?.replace("Bearer ", "");
        if (!token) {
            return res.status(401).json({ message: "Access denied. No token provided." });
        }

        let decoded;
        try {
            decoded = jwt.verify(token, JWT_SECRET) as jwt.JwtPayload;
        } catch (error) {
            if (error instanceof jwt.TokenExpiredError) {
                return res.status(401).json({ message: "Session expired. Please log in again." });
            } else if (error instanceof jwt.JsonWebTokenError) {
                return res.status(401).json({ message: "Invalid token. Please log in again." });
            }
            return res.status(401).json({ message: "Authentication failed." });
        }
        const user = await prisma.user.findUnique({
            where: { id: decoded.id },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
            },
        });

        if (!user) {
            return res.status(401).json({ message: "User not found. Please log in again." });
        }

        req.user = user;
        next();
    } catch (error) {
        console.error("Authentication error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};