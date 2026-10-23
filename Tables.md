# Veritabanı Tabloları

**NOT:** Bu dosyadaki tablo açıklamalarında yapay zekadan yardım alınmıştır.Tabloları ve alanları biz tasarladık;yapay zeka bu tasarımı tablo biçiminde yazdı.İçerik kontrolü yapılmıştır.


Otel rezervasyon sistemi 13 tablodan oluşur. Tablolar en az 3NF'dir: her bilgi tek bir yerde tutulur, tekrar eden veri yoktur.

## Enum'lar

| Enum | Değerler |
|---|---|
| oda_durumu | bos, dolu, temizlikte, bakimda |
| kullanici_rol | misafir, resepsiyon, yonetici |
| rezervasyon_durumu | beklemede, onayli, iptal, tamamlandi |
| odeme_turu | nakit, kredi_karti, havale |

## Oda tabloları

### oda_tipi
| Alan | Tip | Not |
|---|---|---|
| id | Int | PK |
| ad | VarChar(50) | |
| kapasite | Int | |
| aciklama | Text | boş olabilir |
| temel_fiyat | Decimal(10,2) | |

### oda
| Alan | Tip | Not |
|---|---|---|
| id | Int | PK |
| oda_numarasi | VarChar(10) | benzersiz |
| kat | Int | |
| durum | oda_durumu | varsayılan: bos |
| oda_tipi_id | Int | FK → oda_tipi |

### sezon_fiyati
| Alan | Tip | Not |
|---|---|---|
| id | Int | PK |
| oda_tipi_id | Int | FK → oda_tipi |
| baslangic_tarihi | Date | |
| bitis_tarihi | Date | |
| gecelik_fiyat | Decimal(10,2) | |

## Kişi tabloları

### misafir
| Alan | Tip | Not |
|---|---|---|
| id | Int | PK |
| ad | VarChar(50) | |
| soyad | VarChar(50) | |
| kimlik_no | VarChar(20) | benzersiz |
| telefon | VarChar(20) | boş olabilir |
| e_posta | VarChar(100) | boş olabilir |
| dogum_tarihi | Date | boş olabilir |

### personel
| Alan | Tip | Not |
|---|---|---|
| id | Int | PK |
| ad | VarChar(50) | |
| soyad | VarChar(50) | |
| gorev | VarChar(50) | |
| ise_giris_tarihi | Date | boş olabilir |

### kullanici
Sisteme giriş yapan hesap. Ya bir misafire ya da bir personele bağlıdır.

| Alan | Tip | Not |
|---|---|---|
| id | Int | PK |
| kullanici_adi | VarChar(50) | benzersiz |
| sifre_hash | VarChar(255) | bcrypt ile şifrelenmiş |
| rol | kullanici_rol | |
| misafir_id | Int | FK → misafir, benzersiz, boş olabilir |
| personel_id | Int | FK → personel, benzersiz, boş olabilir |

## Rezervasyon ve konaklama tabloları

### rezervasyon
| Alan | Tip | Not |
|---|---|---|
| id | Int | PK |
| misafir_id | Int | FK → misafir |
| oda_id | Int | FK → oda |
| giris_tarihi | Date | |
| cikis_tarihi | Date | |
| kisi_sayisi | Int | |
| durum | rezervasyon_durumu | varsayılan: beklemede |
| olusturma_tarihi | Timestamp | varsayılan: şimdi |

### konaklama
Misafir otele gelince (check-in) rezervasyondan oluşur.

| Alan | Tip | Not |
|---|---|---|
| id | Int | PK |
| rezervasyon_id | Int | FK → rezervasyon |
| personel_id | Int | FK → personel (check-in yapan) |
| gerceklesen_giris | Timestamp | varsayılan: şimdi |
| gerceklesen_cikis | Timestamp | boş olabilir |

### ek_hizmet
| Alan | Tip | Not |
|---|---|---|
| id | Int | PK |
| ad | Text | |
| fiyat | Decimal(10,2) | |

### konaklama_hizmeti
Bir konaklamada alınan ek hizmetler (çoka çok ilişki tablosu).

| Alan | Tip | Not |
|---|---|---|
| id | Int | PK |
| konaklama_id | Int | FK → konaklama |
| ek_hizmet_id | Int | FK → ek_hizmet |
| adet | Int | |
| zaman | Timestamp | varsayılan: şimdi |

### odeme
| Alan | Tip | Not |
|---|---|---|
| id | Int | PK |
| konaklama_id | Int | FK → konaklama |
| tutar | Decimal(10,2) | |
| odeme_turu | odeme_turu | |
| tarih | Timestamp | varsayılan: şimdi |

## Diğer tablolar

### temizlik_kaydi
| Alan | Tip | Not |
|---|---|---|
| id | Int | PK |
| oda_id | Int | FK → oda |
| personel_id | Int | FK → personel (temizleyen) |
| temizlik_tarihi | Timestamp | varsayılan: şimdi |
| durum | Text | |

### islem_log
Rezervasyon ve ödeme değişiklikleri trigger ile buraya otomatik yazılır.

| Alan | Tip | Not |
|---|---|---|
| id | Int | PK |
| tablo_adi | Text | |
| islem_turu | Text | INSERT, UPDATE, DELETE |
| eski_veri | Json | boş olabilir |
| yeni_veri | Json | boş olabilir |
| zaman | Timestamp | varsayılan: şimdi |

(PK: tablonun anahtar alanı. FK: başka bir tabloya bağlanan alan.)
