-- CreateEnum
CREATE TYPE "oda_durumu" AS ENUM ('bos', 'dolu', 'temizlikte', 'bakimda');

-- CreateEnum
CREATE TYPE "kullanici_rol" AS ENUM ('misafir', 'resepsiyon', 'yonetici');

-- CreateEnum
CREATE TYPE "rezervasyon_durumu" AS ENUM ('beklemede', 'onayli', 'iptal', 'tamamlandi');

-- CreateEnum
CREATE TYPE "odeme_turu" AS ENUM ('nakit', 'kredi_karti', 'havale');

-- CreateTable
CREATE TABLE "oda_tipi" (
    "id" SERIAL NOT NULL,
    "ad" VARCHAR(50) NOT NULL,
    "kapasite" INTEGER NOT NULL,
    "aciklama" TEXT,
    "temel_fiyat" DECIMAL(10,2) NOT NULL,

    CONSTRAINT "oda_tipi_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "oda" (
    "id" SERIAL NOT NULL,
    "oda_numarasi" VARCHAR(10) NOT NULL,
    "kat" INTEGER NOT NULL,
    "durum" "oda_durumu" DEFAULT 'bos',
    "oda_tipi_id" INTEGER NOT NULL,

    CONSTRAINT "oda_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sezon_fiyati" (
    "id" SERIAL NOT NULL,
    "oda_tipi_id" INTEGER NOT NULL,
    "baslangic_tarihi" DATE NOT NULL,
    "bitis_tarihi" DATE NOT NULL,
    "gecelik_fiyat" DECIMAL(10,2) NOT NULL,

    CONSTRAINT "sezon_fiyati_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "misafir" (
    "id" SERIAL NOT NULL,
    "ad" VARCHAR(50) NOT NULL,
    "soyad" VARCHAR(50) NOT NULL,
    "kimlik_no" VARCHAR(20) NOT NULL,
    "telefon" VARCHAR(20),
    "e_posta" VARCHAR(100),
    "dogum_tarihi" DATE,

    CONSTRAINT "misafir_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "personel" (
    "id" SERIAL NOT NULL,
    "ad" VARCHAR(50) NOT NULL,
    "soyad" VARCHAR(50) NOT NULL,
    "gorev" VARCHAR(50) NOT NULL,
    "ise_giris_tarihi" DATE,

    CONSTRAINT "personel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "kullanici" (
    "id" SERIAL NOT NULL,
    "kullanici_adi" VARCHAR(50) NOT NULL,
    "sifre_hash" VARCHAR(255) NOT NULL,
    "rol" "kullanici_rol" NOT NULL,
    "misafir_id" INTEGER,
    "personel_id" INTEGER,

    CONSTRAINT "kullanici_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rezervasyon" (
    "id" SERIAL NOT NULL,
    "misafir_id" INTEGER NOT NULL,
    "oda_id" INTEGER NOT NULL,
    "giris_tarihi" DATE NOT NULL,
    "cikis_tarihi" DATE NOT NULL,
    "kisi_sayisi" INTEGER NOT NULL,
    "durum" "rezervasyon_durumu" NOT NULL DEFAULT 'beklemede',
    "olusturma_tarihi" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "rezervasyon_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "konaklama" (
    "id" SERIAL NOT NULL,
    "rezervasyon_id" INTEGER NOT NULL,
    "personel_id" INTEGER NOT NULL,
    "gerceklesen_giris" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "gerceklesen_cikis" TIMESTAMP(3),

    CONSTRAINT "konaklama_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ek_hizmet" (
    "id" SERIAL NOT NULL,
    "ad" TEXT NOT NULL,
    "fiyat" DECIMAL(10,2) NOT NULL,

    CONSTRAINT "ek_hizmet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "islem_log" (
    "id" SERIAL NOT NULL,
    "tablo_adi" TEXT NOT NULL,
    "islem_turu" TEXT NOT NULL,
    "eski_veri" JSONB,
    "yeni_veri" JSONB,
    "zaman" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "islem_log_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "odeme" (
    "id" SERIAL NOT NULL,
    "konaklama_id" INTEGER NOT NULL,
    "tutar" DECIMAL(10,2) NOT NULL,
    "odeme_turu" "odeme_turu" NOT NULL,
    "tarih" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "odeme_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "konaklama_hizmeti" (
    "id" SERIAL NOT NULL,
    "konaklama_id" INTEGER,
    "ek_hizmet_id" INTEGER,
    "adet" INTEGER,
    "zaman" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "konaklama_hizmeti_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "temizlik_kaydi" (
    "id" SERIAL NOT NULL,
    "oda_id" INTEGER NOT NULL,
    "personel_id" INTEGER NOT NULL,
    "temizlik_tarihi" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "durum" TEXT NOT NULL,

    CONSTRAINT "temizlik_kaydi_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "oda_oda_numarasi_key" ON "oda"("oda_numarasi");

-- CreateIndex
CREATE UNIQUE INDEX "misafir_kimlik_no_key" ON "misafir"("kimlik_no");

-- CreateIndex
CREATE UNIQUE INDEX "kullanici_kullanici_adi_key" ON "kullanici"("kullanici_adi");

-- CreateIndex
CREATE UNIQUE INDEX "kullanici_misafir_id_key" ON "kullanici"("misafir_id");

-- CreateIndex
CREATE UNIQUE INDEX "kullanici_personel_id_key" ON "kullanici"("personel_id");

-- AddForeignKey
ALTER TABLE "oda" ADD CONSTRAINT "oda_oda_tipi_id_fkey" FOREIGN KEY ("oda_tipi_id") REFERENCES "oda_tipi"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sezon_fiyati" ADD CONSTRAINT "sezon_fiyati_oda_tipi_id_fkey" FOREIGN KEY ("oda_tipi_id") REFERENCES "oda_tipi"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "kullanici" ADD CONSTRAINT "kullanici_misafir_id_fkey" FOREIGN KEY ("misafir_id") REFERENCES "misafir"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "kullanici" ADD CONSTRAINT "kullanici_personel_id_fkey" FOREIGN KEY ("personel_id") REFERENCES "personel"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rezervasyon" ADD CONSTRAINT "rezervasyon_misafir_id_fkey" FOREIGN KEY ("misafir_id") REFERENCES "misafir"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rezervasyon" ADD CONSTRAINT "rezervasyon_oda_id_fkey" FOREIGN KEY ("oda_id") REFERENCES "oda"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "konaklama" ADD CONSTRAINT "konaklama_rezervasyon_id_fkey" FOREIGN KEY ("rezervasyon_id") REFERENCES "rezervasyon"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "konaklama" ADD CONSTRAINT "konaklama_personel_id_fkey" FOREIGN KEY ("personel_id") REFERENCES "personel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "odeme" ADD CONSTRAINT "odeme_konaklama_id_fkey" FOREIGN KEY ("konaklama_id") REFERENCES "konaklama"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "konaklama_hizmeti" ADD CONSTRAINT "konaklama_hizmeti_konaklama_id_fkey" FOREIGN KEY ("konaklama_id") REFERENCES "konaklama"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "konaklama_hizmeti" ADD CONSTRAINT "konaklama_hizmeti_ek_hizmet_id_fkey" FOREIGN KEY ("ek_hizmet_id") REFERENCES "ek_hizmet"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "temizlik_kaydi" ADD CONSTRAINT "temizlik_kaydi_oda_id_fkey" FOREIGN KEY ("oda_id") REFERENCES "oda"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "temizlik_kaydi" ADD CONSTRAINT "temizlik_kaydi_personel_id_fkey" FOREIGN KEY ("personel_id") REFERENCES "personel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
