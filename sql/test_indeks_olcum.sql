
-- Normal
EXPLAIN ANALYZE SELECT 1 FROM rezervasyon r
WHERE r.oda_id = 5 AND r.durum <> 'iptal'
AND '2026-12-01' < r.cikis_tarihi AND '2026-12-05' > r.giris_tarihi;

EXPLAIN ANALYZE SELECT * FROM rezervasyon WHERE giris_tarihi = '2026-12-01' OR cikis_tarihi = '2026-12-01';

EXPLAIN ANALYZE SELECT * FROM rezervasyon WHERE misafir_id = 10;

-- Tam tarama kapali
SET enable_seqscan = off;

EXPLAIN ANALYZE SELECT 1 FROM rezervasyon r
WHERE r.oda_id = 5 AND r.durum <> 'iptal'
AND '2026-12-01' < r.cikis_tarihi AND '2026-12-05' > r.giris_tarihi;

EXPLAIN ANALYZE SELECT * FROM rezervasyon WHERE giris_tarihi = '2026-12-01' OR cikis_tarihi = '2026-12-01';

EXPLAIN ANALYZE SELECT * FROM rezervasyon WHERE misafir_id = 10;

RESET enable_seqscan;