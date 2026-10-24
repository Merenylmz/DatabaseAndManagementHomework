/*
  Warnings:

  - Made the column `konaklama_id` on table `konaklama_hizmeti` required. This step will fail if there are existing NULL values in that column.
  - Made the column `ek_hizmet_id` on table `konaklama_hizmeti` required. This step will fail if there are existing NULL values in that column.
  - Made the column `adet` on table `konaklama_hizmeti` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "konaklama_hizmeti" DROP CONSTRAINT "konaklama_hizmeti_ek_hizmet_id_fkey";

-- DropForeignKey
ALTER TABLE "konaklama_hizmeti" DROP CONSTRAINT "konaklama_hizmeti_konaklama_id_fkey";

-- AlterTable
ALTER TABLE "konaklama_hizmeti" ALTER COLUMN "konaklama_id" SET NOT NULL,
ALTER COLUMN "ek_hizmet_id" SET NOT NULL,
ALTER COLUMN "adet" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "konaklama_hizmeti" ADD CONSTRAINT "konaklama_hizmeti_konaklama_id_fkey" FOREIGN KEY ("konaklama_id") REFERENCES "konaklama"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "konaklama_hizmeti" ADD CONSTRAINT "konaklama_hizmeti_ek_hizmet_id_fkey" FOREIGN KEY ("ek_hizmet_id") REFERENCES "ek_hizmet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
