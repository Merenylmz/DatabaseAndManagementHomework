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
import rezervasyonRoutes from "./routes/resepsiyon.routes";
import authRoutes from "./routes/auth.routes";
import odaTipiRoutes from "./routes/odaTipi.routes";
import odaRoutes from "./routes/oda.routes";
import sezonFiyatiRoutes from "./routes/sezonFiyati.routes";
import rezervasyonApiRoutes from "./routes/rezervasyon.routes";
import raporRoutes from "./routes/rapor.routes";

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

app.use("/api/auth", authRoutes)
app.use("/api/ekhizmet", ekhizmetRoutes);
app.use("/api/personel", personelRoutes);
app.use("/api/misafir", misafirRoutes);
app.use("/api/resepsiyon", rezervasyonRoutes);
app.use("/api/oda-tipi", odaTipiRoutes);
app.use("/api/oda", odaRoutes);
app.use("/api/sezon-fiyati", sezonFiyatiRoutes);
app.use("/api/rezervasyon", rezervasyonApiRoutes);
app.use("/api/rapor", raporRoutes);


startServer();
app.use(errorHandler);
export default app;