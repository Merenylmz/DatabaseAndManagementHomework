import express, { Response, Request, NextFunction } from "express";
import cors from "cors";
import dotenv from "dotenv";
import prisma from "./config/dbPrisma";
import startServer from "./utils/startServer";
import { errorHandler } from "./middlewares/errorHandler";
import { ApiResponse } from "./utils/ApiResponse";

import ekhizmetRoutes from "./routes/ekHizmet.routes";
import personelRoutes from "./routes/personel.routes";
import misafirRoutes from "./routes/misafir.routes";

dotenv.config();
const app = express();


app.use(cors());
app.use(express.json());

app.get("/api/health", async(req: Request, res: Response, next: NextFunction)=>{
    try {
        const result = await prisma.$queryRaw`SELECT NOW() as server_time`;
        res.status(200).send(ApiResponse.success("Database Cconnected", result));
    } catch (error) {
        next(error);
    }
})

app.use("/api/ekhizmet", ekhizmetRoutes);
app.use("/api/personel", personelRoutes);
app.use("/api/misafir", misafirRoutes);


startServer();
app.use(errorHandler);
export default app;