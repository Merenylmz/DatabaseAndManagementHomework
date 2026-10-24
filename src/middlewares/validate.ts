import { NextFunction, Request, Response } from "express";
import { AnyZodObject, ZodError } from "zod/v3";

export const validate = (schema: AnyZodObject)=>{
    return (req: Request, res: Response, next:NextFunction)=>{
        try {
            req.body = schema.parse(req.body);
            next();
        } catch (error) {
            if (error instanceof ZodError) {
                next(error);
            } else {
                next(error);
            }
        }
    }
}