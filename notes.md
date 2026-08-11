# WebApp

## Install & Run

```bash
cd web
npm install
npm run dev
```

URL: http://localhost:5173

## Command Lain

```bash
# Build produksi
npm run build

# Preview build
npm run preview
```

## Config Backend (Opsional)

Jika mau ubah URL API, copy `.env.example` ke `.env`:
```bash
cp .env.example .env
```
Isi `VITE_SDMS_API_URL=http://localhost:5000/api`
