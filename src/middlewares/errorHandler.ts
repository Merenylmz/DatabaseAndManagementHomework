import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod/v3";
import { ApiResponse } from "../utils/ApiResponse";

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction)=>{
    console.error("Hata Yakalandı: ", err);

    if (err instanceof ZodError) {
        const formattedErrors = err.errors.map((e)=>({
            field: e.path.join('.'),
            message: e.message
        }));

        res.status(400).send(ApiResponse.error("Validation error", formattedErrors));
        return;
    }

    const statusCode = err.statusCode || 400;
    const message = err.message || "Bad Server error";
    res.status(statusCode).send(ApiResponse.error(message));    
}