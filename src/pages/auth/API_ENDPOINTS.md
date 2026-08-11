# Dokumentasi Endpoint SDMS — Modul Auth

Dokumen ini mencatat endpoint autentikasi SDMS.

---

## 1. Login Kredensial SDMS

- **Path**: `/api/v1/auth/login`
- **Method**: `POST`
- **Auth Required**: Tidak
- **Request Body**:
  ```json
  {
    "email": "sa@suzuki.co.id",
    "password": "••••••••",
    "role": "ServiceAdvisor"
  }
  ```
- **Response**:
  ```json
  {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "name": "Service Advisor",
      "role": "ServiceAdvisor"
    }
  }
  ```
