import express, { Response, Request } from "express";
import cors from "cors";
import dotenv from "dotenv";
import prisma from "./config/dbPrisma";
import startServer from "./utils/startServer";

dotenv.config();
const app = express();


app.use(cors());
app.use(express.json());

app.get("/api/health", async(req: Request, res: Response)=>{
    try {
        const result = await prisma.$queryRaw`SELECT NOW() as server_time`;
        res.status(200).send({
            status: "OK",
            message: "Proje Sorunsuz Çalışıyor",
            detail: result
        });

    } catch (error) {
        res.status(500).send({
            status: "BAD SERVER",
            message: "Backendde Sorun var",
            detail: error
        });
    }
})


startServer();
export default app;