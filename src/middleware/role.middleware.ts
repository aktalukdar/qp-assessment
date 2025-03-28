import { Request, Response, NextFunction } from "express";

export const checkAdmin = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    if (!req.user || req.user.role !== "ADMIN") {
        return res.status(403).json({ message: "Access denied. Admins only." });
    }
    next();
};
