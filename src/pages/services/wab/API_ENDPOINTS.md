# API Endpoints & Data Model Document — Modul WAB (Services)

Dokumentasi endpoint API SDMS dan skema data tabel `Booking` SDMS yang dikonsumsi oleh modul WAB (Workorder Advisor & Bengkel).

---

## 1. Daftar Endpoint API SDMS

| Endpoint Path | Method | Deskripsi | Status Kontrak |
|---|---|---|---|
| `/bookings` | GET | Mengambil daftar booking dari SDMS | API SDMS Existing |
| `/tickets` | GET | Mengambil seluruh tiket aktif di bengkel | API SDMS Existing |
| `/checkin` | POST | Mendaftarkan kendaraan check-in (Walk-in / Booking) | API SDMS Existing |
| `/security/checkout` | POST | Merilis kendaraan keluar gerbang | API SDMS Existing |
| `/tickets/purpose` | PUT | Mengubah tujuan kedatangan tiket | API SDMS Existing |
| `/tickets/wab` | POST | Submit Form WAB 5-Step (Inspeksi & TTD) | API SDMS Existing |
| `/tickets/foreman-tracking` | PUT | Update status pengerjaan stall & teknisi | API SDMS Existing |
| `/workshop/status` | POST | Update status pengerjaan servis / tiket | API SDMS Existing |

---

## 2. Skema Data Tabel Booking SDMS

Tabel/response SDMS mengembalikan record booking dengan struktur kolom berikut:

```sql
CompanyCode	BranchCode	BookingNo	ReservasiDate	ReservasiTime	StallCode	BookingSource	CustomerName	TelponNo	PoliceRegNo	GroupCode	Odometer	JobType	JobTime	AdditionalTime	FinishJobTime	FinishTime	ServiceRequest	Remark	ServiceAdvisor	ForemanID	MechanicID	CreatedBy	CreatedDate	UpdatedBy	UpdatedDate
```

### Pemetaan Kolom SDMS ke Property Modul WAB

| Kolom SDMS Raw | Tipe Data | Property Domain Client | Contoh Nilai |
|---|---|---|---|
| `CompanyCode` | `string` | `companyCode` | `"6006406"` |
| `BranchCode` | `string` | `branchCode` | `"6006401"` |
| `BookingNo` | `string` | `sdmsBookingId` / `bookingNo` | `"BO401/25/002479"` |
| `ReservasiDate` | `datetime` | `reservasiDate` | `"2026-02-26 00:00:00.000"` |
| `ReservasiTime` | `string` | `reservasiTime` / `bookingTime` | `"09:30"` |
| `StallCode` | `string` | `stallCode` | `"STALL-01"` |
| `BookingSource` | `string` | `bookingSource` | `"NEW"` |
| `CustomerName` | `string` | `customerName` | `"ANANTYA NALA PRABATA"` |
| `TelponNo` | `string` | `telponNo` / `customerPhone` | `"08118207657"` |
| `PoliceRegNo` | `string` | `policeRegNo` / `licensePlate` | `"B1697TYK"` |
| `GroupCode` | `string` | `groupCode` / `vehicleModel` | `"SWIFT (CBU)"` |
| `Odometer` | `number` / `string` | `odometer` | `2222222` |
| `JobType` | `string` | `jobType` / `serviceType` | `"PAKET 10.000 KM"` |
| `JobTime` | `string` / `null` | `jobTime` | `null` |
| `AdditionalTime` | `number` | `additionalTime` | `0` |
| `FinishJobTime` | `string` / `null` | `finishJobTime` | `null` |
| `FinishTime` | `string` / `null` | `finishTime` | `null` |
| `ServiceRequest` | `string` | `serviceRequest` | `"1"` |
| `Remark` | `string` / `null` | `remark` | `null` |
| `ServiceAdvisor` | `string` | `serviceAdvisor` | `"58970"` |
| `ForemanID` | `string` / `null` | `foremanId` | `null` |
| `MechanicID` | `string` / `null` | `mechanicId` | `null` |
| `CreatedBy` | `string` | `createdBy` | `"ga"` |
| `CreatedDate` | `datetime` | `createdDate` | `"2026-02-24 13:28:48.860"` |
| `UpdatedBy` | `string` | `updatedBy` | `"ga"` |
| `UpdatedDate` | `datetime` | `updatedDate` | `"2026-02-24 13:28:48.860"` |
