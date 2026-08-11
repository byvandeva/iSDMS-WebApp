# API Endpoints Document — Modul WAB (Services)

Dokumentasi endpoint API SDMS yang digunakan oleh modul WAB (Workorder Advisor & Bengkel).

| Endpoint Path | Method | Deskripsi | Status Kontrak |
|---|---|---|---|
| `/bookings` | GET | Mengambil daftar booking SDMS | Temporary / Existing Path |
| `/tickets` | GET | Mengambil seluruh tiket aktif | Temporary / Existing Path |
| `/checkin` | POST | Mendaftarkan kendaraan check-in (Walk-in / Booking) | Temporary / Existing Path |
| `/security/checkout` | POST | Merilis kendaraan keluar gerbang | Temporary / Existing Path |
| `/tickets/purpose` | PUT | Mengubah tujuan kedatangan tiket | Temporary / Existing Path |
| `/tickets/wab` | POST | Submit Form WAB 5-Step (Inspeksi & TTD) | Temporary / Existing Path |
| `/tickets/foreman-tracking` | PUT | Update status pengerjaan stall & teknisi | Temporary / Existing Path |
| `/workshop/status` | POST | Update status bengkel / tiket | Temporary / Existing Path |

> *Catatan: Endpoint di atas saat ini masih menggunakan path sementara. Dokumentasi ini akan diperbarui setelah spesifikasi API SDMS final dikonfirmasi.*
