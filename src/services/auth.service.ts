import { KullaniciRol, PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();


const misafirKayitOl = async(veri: any) =>{
    const hashedPassword = await bcrypt.hash(veri.sifre, 10);

    const newAccount = await prisma.$transaction(async(tx)=>{
        const user = await tx.kullanici.create({
            data:{
                kullanici_adi: veri.e_posta || veri.kullanici_adi,
                sifre_hash: hashedPassword,
                rol: "misafir"
            }
        });

        const guest = await tx.misafir.create({
            data:{
                ad: veri.ad,
                soyad: veri.soyad,
                kimlik_no: veri.kimlik_no,
                dogum_tarihi: veri.dogum_tarihi,
                e_posta: veri.e_posta,
                telefon: veri.telefon,
                kullanici: {
                    connect: {id: user.id}
                }
            }
        });
        return {user, guest};
    });

    return newAccount;
};

const girisYap = async(email: string, sifre: string) =>{
    const user = await prisma.kullanici.findFirst({
        where:{
            kullanici_adi: email,
        }   
    });
    if (!user) {
        throw new Error("Bu E-Posta Adresiyle uyumlu bir hesap bulunamadı.");
    }

    const isItPasswordCorrect = await bcrypt.compare(sifre, user.sifre_hash);
    if (isItPasswordCorrect) {
        throw new Error('Hatalı Şifre Girdiniz.');
    }

    const token = jwt.sign({id: user.id, role: user.rol, email: user.kullanici_adi}, 
        process.env.JWT_SECRET || '>@!sup3rG1zl1AN4t_ar.', {expiresIn: '12h'});
    

    return {
        message: "Giriş işlemi Başarılı",
        token: token,
        user_info: {
            id: user.id,
            rol: user.rol,
            email: user.kullanici_adi
        }
    };
};


export {misafirKayitOl, girisYap};
