import { Request, Response, NextFunction } from "express";

// Mock middleware for ISS-17. Real implementation comes in ISS-20.
export const authenticate = (req: Request, res: Response, next: NextFunction) => {
    // Inject mock user for testing endpoint permissions
    (req as any).auth = { id: 1, username: "admin" };
    next();
};
export const authorize = (req: Request, res: Response, next: NextFunction) => next();
