import type { Request, Response, NextFunction } from "express";
import Jwt from "jsonwebtoken";
import type { JwtPayload } from "jsonwebtoken";
import dotenv from 'dotenv';
import refreshTokens from './refreshToken';
import { tokenValid } from '../index';

dotenv.config();

export default function protectionEndpoint(req: Request, res: Response, next: NextFunction) {
    const token = req.headers.authorization?.split(" ")[1];
    let IstokenValid = false;

    if (!token) {
        return res.status(401).json({ message: "No tienes permiso." });
    }

    if (tokenValid.includes(token)) { IstokenValid = true; }

    try {
        const decoded = Jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;
        console.log(decoded);

        next();
    } catch {
        if (IstokenValid == true) {
            refreshTokens();

            next();
        } else {
            res.status(403).json({ error: "Token inválido" });
        }
    }
}