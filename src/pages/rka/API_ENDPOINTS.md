# Dokumentasi Endpoint API SDMS — Modul RKA (Rencana Kerja & Anggaran - Monitoring Rasio Unit)

Dokumen ini mencatat kontrak endpoint SDMS yang dikonsumsi oleh modul RKA (Customer Care Manager / CCM).

---

## 1. GET /api/rka/performance
- **Deskripsi**: Mengambil data performa 12 bulan (Target RKA, Actual Otomatis, dan Rasio % Pencapaian) per Dealer & Tahun.
- **Method**: `GET`
- **Path Placeholder**: `/api/rka/performance`
- **Query Parameters**:
  - `dealerCode` (string): Kode dealer Suzuki (contoh: `SDMS-6006401`)
  - `year` (number): Tahun monitoring RKA (contoh: `2026`)
- **Contoh Response**:
  ```json
  [
    {
      "dealerCode": "SDMS-6006401",
      "year": 2026,
      "month": 1,
      "monthName": "Januari",
      "bookingSroTarget": 120,
      "bookingSroActual": 125,
      "bookingSroRatio": 104,
      "unitIntakeTarget": 150,
      "unitIntakeActual": 155,
      "unitIntakeRatio": 103,
      "bookingShowUpTarget": 100,
      "bookingShowUpActual": 105,
      "bookingShowUpRatio": 105
    }
  ]
  ```

---

## 2. POST /api/rka/target
- **Deskripsi**: Menyimpan atau mengubah (*upsert*) nilai Target RKA bulanan yang diinputkan secara manual oleh CCM per Dealer & Tahun.
- **Method**: `POST`
- **Path Placeholder**: `/api/rka/target`
- **Request Body**:
  ```json
  {
    "dealerCode": "SDMS-6006401",
    "year": 2026,
    "targets": [
      {
        "month": 1,
        "bookingSroTarget": 120,
        "unitIntakeTarget": 150,
        "bookingShowUpTarget": 100
      },
      {
        "month": 2,
        "bookingSroTarget": 130,
        "unitIntakeTarget": 160,
        "bookingShowUpTarget": 110
      }
    ]
  }
  ```
- **Contoh Response**:
  ```json
  {
    "success": true,
    "message": "Target RKA berhasil disimpan"
  }
  ```
