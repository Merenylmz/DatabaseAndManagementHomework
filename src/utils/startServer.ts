import app from "..";
import prisma from "../config/dbPrisma"

const PORT = process.env.PORT || 3002;
const startServer = async() =>{
    try {
        await prisma.$connect();
        await prisma.$queryRaw`SELECT 1`;
        console.log("Database Connected");

        app.listen(PORT, ()=>{
            console.log("Listening a PORT "+PORT);
        });
        
    } catch (error) {
        console.error('Veritabanı bağlantı hatası:', error);
        process.exit(1);
    }
}

export default startServer;