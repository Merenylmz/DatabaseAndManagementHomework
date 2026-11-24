import { Request, Response } from 'express';
import { girisYapService, misafirKayitOlService } from '../services/auth.service';

const kayitOl = async (req: Request, res: Response) => {
  try {
    const sonuc = await misafirKayitOlService(req.body);
    res.status(201).json({
      success: true,
      message: 'Kayıt işlemi başarıyla tamamlandı.',
      data: sonuc
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || 'Kayıt sırasında bir hata oluştu.'
    });
  }
};

const girisYap = async (req: Request, res: Response) => {
  try {
    const email = req.body.email || req.body.kullanici_adi;
    const { sifre } = req.body;

    if (!email || !sifre) {
      return res.status(400).json({
        success: false,
        message: 'E-posta (kullanıcı adı) ve şifre alanları zorunludur.'
      });
    }

    const sonuc = await girisYapService(email, sifre);
    res.status(200).json({
      success: true,
      ...sonuc
    });
  } catch (error: any) {
    res.status(401).json({
      success: false,
      message: error.message || 'Giriş başarısız.'
    });
  }
};

export {girisYap, kayitOl};