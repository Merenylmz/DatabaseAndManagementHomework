# Otel Rezervasyon Sistemi Arayüzü

React + Vite + TypeScript ile yazıldı.

## Çalıştırma

Önce ana klasörde backend çalışıyor olmalı (`npm run dev`, port 3002).

```
cd frontend
npm install
npm run dev
```

Tarayıcıda http://localhost:5173 adresini açın.

## Klasörler

- `src/api/istemci.ts`: backend'e istek atan ortak axios nesnesi. `/api` ile başlayan istekler `vite.config.ts` içindeki proxy ile backend'e gider.
- `src/pages/`: her sayfa kendi klasöründe.
- `src/components/`: menü gibi ortak parçalar.
- `src/App.tsx`: sayfa adresleri. Yeni sayfa eklerken buraya tek satır eklenir.
