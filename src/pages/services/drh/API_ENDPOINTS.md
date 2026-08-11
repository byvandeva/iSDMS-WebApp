# Dokumentasi Endpoint SDMS — Modul Service / DRH (Daily Service Retention)

Dokumen ini mencatat seluruh endpoint API SDMS yang dipanggil oleh modul DRH (Daily Service Retention).

---

## 1. Get Retention List

- **Path**: `/api/v1/drh/retention-list`
- **Method**: `GET`
- **Auth Required**: Ya (Bearer Token via `httpClient.js`)
- **Query Parameters**:
  - `year` (string) — Tahun periode (misal: "2026")
  - `month` (string) — Bulan periode (misal: "08")
  - `transOption` (string) — Tipe transmisi (0 = Semua, AT, MT)
  - `groupJobType` (string) — Filter kategori KM
  - `searchPlate` (string) — Pencarian plat nomor / nama customer

---

## 2. Export Excel Report

- **Path**: `/api/v1/drh/export`
- **Method**: `GET`
- **Auth Required**: Ya (Bearer Token via `httpClient.js`)
- **Query Parameters**:
  - `year` (string)
  - `month` (string)
