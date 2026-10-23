import fs from "fs";
import path from "path";
import { execSync } from "child_process";

// sql/ klasöründeki tüm .sql dosyalarını alfabetik sırayla veritabanında çalıştırır.
// test_ ile başlayan dosyalar ve otel_tam.sql atlanır.
const sqlKlasoru = __dirname;
const semaDosyasi = path.join(__dirname, "..", "prisma", "schema.prisma");

const dosyalar = fs
  .readdirSync(sqlKlasoru)
  .filter((dosya) => dosya.endsWith(".sql"))
  .filter((dosya) => !dosya.startsWith("test_") && dosya !== "otel_tam.sql")
  .sort();

if (dosyalar.length === 0) {
  console.log("Çalıştırılacak SQL dosyası yok.");
  process.exit(0);
}

for (const dosya of dosyalar) {
  console.log("Çalıştırılıyor: " + dosya);
  try {
    execSync(
      `npx prisma db execute --file "${path.join(sqlKlasoru, dosya)}" --schema "${semaDosyasi}"`,
      { stdio: "inherit" }
    );
  } catch (error) {
    console.error("Hata: " + dosya + " çalıştırılamadı.");
    process.exit(1);
  }
}

console.log(dosyalar.length + " SQL dosyası çalıştırıldı.");
