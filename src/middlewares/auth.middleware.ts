import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface AuthRequest extends Request{
    user?: any
};

const tokenControl = (req: AuthRequest, res: Response, next: NextFunction)=>{
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({error: "Invalid Token!", message: "Geçerli bir Token bilgisi olmadığı için Erişim Reddedildi.", status: false})
    }

    const token = authHeader.split(' ')[1];

    try {
        const secretKey = process.env.JWT_SECRET || '>@!sup3rG1zl1AN4t_ar.';
        const decoded = jwt.verify(token, secretKey);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ error: 'Geçersiz veya süresi dolmuş token.', status: false });
    }

}

const roleControl = (permittedRoles: string[])=>{
    return (req: AuthRequest, res: Response, next: NextFunction)=>{

        if (!req.user || !req.user.rol || !permittedRoles.includes(req.user.rol)) {
            return res.status(403).json({error: 'Forbidden Transaction!', message: "Bu işlemi gerçekleştirmek için gerekli yetkiye sahip değilsiniz.", status: false});
        }
        next();
    }
}


export {AuthRequest, tokenControl, roleControl};