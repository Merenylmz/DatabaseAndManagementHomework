# Veritabanı Normalizasyon Analizi (3. Normal Form - 3NF)

Bu belgede, Otel Rezervasyon ve Yönetim Sistemi veritabanı şemasının neden **3. Normal Form (3NF)** kurallarına uygun olarak tasarlandığı, veri tekrarının (redundancy) nasıl önlendiği ve güncelleme/silme/ekleme anomalilerinin nasıl engellendiği proje tabloları üzerinden örneklerle açıklanmaktadır.

---

## 1. Birinci Normal Form (1NF) Uygunluğu
Bir tablonun 1NF olması için her sütunun yalnızca **atomik (bölünemez)** tek bir değer tutması, tekrarlayan sütun gruplarının bulunmaması ve her satırın benzersiz bir birincil anahtara (Primary Key) sahip olması gerekir.

* **Projedeki Uygulama:**
  * Tüm tablolarımızda benzersiz `id` birincil anahtarı bulunmaktadır.
  * Bir konaklama sırasında misafirin aldığı birden fazla ek hizmet (`Kahvaltı`, `SPA`, `Oda Servisi` vb.), `konaklama` tablosunda tek bir sütuna virgülle yazılarak (`"Kahvaltı, SPA"`) veya `hizmet1`, `hizmet2` şeklinde tekrarlayan sütunlar açılarak tutulmamıştır. Bunun yerine **`konaklama_hizmeti`** ara tablosu oluşturularak her hizmet satır bazında atomik olarak kaydedilmiştir.
  * Benzer şekilde `misafir` ve `personel` tablolarında `ad` ve `soyad` alanları ayrı sütunlarda atomik olarak tutulmaktadır.

---

## 2. İkinci Normal Form (2NF) Uygunluğu
Bir tablonun 2NF olması için 1NF kurallarını sağlaması ve anahtar olmayan tüm sütunların birincil anahtarın **tamamına** bağımlı olması (kısmi bağımlılık olmaması) gerekir.

* **Projedeki Uygulama:**
  * Tablolarımızda tek sütunlu yapay birincil anahtar (`id`) kullanıldığı için kısmi bağımlılık oluşmamaktadır.
  * Çoktan-çoğa (N:M) ilişkiyi çözen **`konaklama_hizmeti`** tablosunda yalnızca o eşleşmeye özgü veriler (`konaklama_id`, `ek_hizmet_id`, `adet`, `zaman`) yer alır. Hizmetin adı veya birim fiyatı (`ad`, `fiyat`) bu tabloda tekrarlanmaz; yalnızca `ek_hizmet` tablosunda tutulur.

---

## 3. Üçüncü Normal Form (3NF) Uygunluğu
Bir tablonun 3NF olması için 2NF'yi sağlaması ve anahtar olmayan hiçbir sütunun, anahtar olmayan başka bir sütuna bağımlı olmaması (**geçişli bağımlılık / transitive dependency** bulunmaması) gerekir. Kısacası her bilgi veritabanında **yalnızca tek bir yerde** tutulur.

Projemizdeki temel 3NF ayrıştırmaları ve örnekleri şunlardır:

### Örnek 1: `oda` ve `oda_tipi` Ayrımı
* **Normalleştirilmemiş Hali (Hatalı):** Eğer `oda` tablosunda `oda_numarasi`, `kat`, `durum` alanlarının yanında `oda_tipi_adi`, `kapasite`, `aciklama` ve `temel_fiyat` bilgileri de tutulsaydı; oteldeki 30 adet "Standart Oda" için aynı kapasite, açıklama ve temel fiyat 30 kez tekrar edecekti. Fiyat değiştiğinde 30 satırın birden güncellenmesi gerekecekti (**güncelleme anomalisi**).
* **3NF Çözümümüz:** Oda tipine ait özellikler (`ad`, `kapasite`, `aciklama`, `temel_fiyat`) ayrı bir **`oda_tipi`** tablosuna taşınmıştır. **`oda`** tablosu yalnızca `oda_tipi_id` yabancı anahtarını (Foreign Key) tutar. Fiyat veya açıklama değiştiğinde tek bir satırın güncellenmesi yeterlidir.

### Örnek 2: `rezervasyon` ve `misafir` Ayrımı
* **Normalleştirilmemiş Hali (Hatalı):** Misafirin `ad`, `soyad`, `kimlik_no`, `telefon` ve `e_posta` bilgileri doğrudan `rezervasyon` tablosunda tutulsaydı, otele 5 kez gelen bir misafirin tüm kimlik ve iletişim bilgileri 5 kez tekrar edecekti.
* **3NF Çözümümüz:** Kişisel bilgiler yalnızca **`misafir`** tablosunda tek bir kayıt olarak tutulur. **`rezervasyon`** tablosu sadece `misafir_id` referansını barındırır.

### Örnek 3: `sezon_fiyati` Tablosunun Ayrılması
* **Normalleştirilmemiş Hali (Hatalı):** Tarihe göre değişen gecelik fiyatlar `oda` veya `oda_tipi` tablosuna eklenmeye çalışılsaydı veri tekrarı ve çoklu değer sorunu doğacaktı.
* **3NF Çözümümüz:** Dönemsel fiyatlar **`sezon_fiyati`** tablosunda `oda_tipi_id`, `baslangic_tarihi`, `bitis_tarihi` ve `gecelik_fiyat` şeklinde ayrıştırılmıştır.

### Örnek 4: `kullanici` Tablosunun `misafir` ve `personel` ile Ayrıştırılması
* **Normalleştirilmemiş Hali (Hatalı):** Kimlik doğrulama bilgileri (`kullanici_adi`, `sifre_hash`, `rol`) hem `misafir` hem `personel` tablolarına ayrı ayrı eklenseydi giriş (login) ve yetkilendirme süreçleri bölünecek, rol bağımlı boş (NULL) sütunlar oluşacaktı.
* **3NF Çözümümüz:** Sisteme giriş yetkisi olan tüm hesaplar merkezi **`kullanici`** tablosunda toplanmış; ilgili kişi bilgilerine `misafir_id` veya `personel_id` ile bire-bir (1:1) ilişki üzerinden bağlanmıştır.

### Örnek 5: Hesaplanan Verinin Saklanmaması (`toplam_tutar`)
* `konaklama` tablosunda toplam borç (`toplam_tutar`) alanı fiziksel sütun olarak tutulmamıştır. Çünkü bu değer, `sezon_fiyati` (veya `temel_fiyat`) ile `konaklama_hizmeti` üzerinden alınan ek hizmetlerin toplamından türetilebilen (hesaplanabilir) bir veridir. Bunun yerine veritabanı düzeyinde **`fn_konaklama_toplam_tutar` (Prosedür 2)** ile dinamik olarak hesaplanıp yalnızca kesinleşmiş tahsilat anında **`odeme`** tablosuna kaydedilir.

---

## Özet
Tasarlanan şemada her varlık (`OdaTipi`, `Oda`, `SezonFiyati`, `Misafir`, `Personel`, `Kullanici`, `Rezervasyon`, `Konaklama`, `Ek_Hizmet`, `Konaklama_Hizmeti`, `Odeme`, `Temizlik_Kaydi`) yalnızca kendi birincil anahtarına doğrudan bağımlı öznitelikleri taşır. Veri tekrarı sıfırlanmış, veri bütünlüğü Foreign Key kısıtları ve 3NF kurallarıyla garanti altına alınmıştır.