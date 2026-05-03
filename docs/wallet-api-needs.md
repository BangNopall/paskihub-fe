# Kebutuhan API Wallet untuk Organizer

Berikut adalah field dan endpoint yang dibutuhkan oleh Frontend namun belum ditemukan/terdefinisi secara jelas di Swagger atau perlu penyesuaian:

## 1. Public/Global Settings

Organizer membutuhkan akses baca ke konfigurasi platform untuk menampilkan instruksi transfer yang benar.

- **Endpoint:** `GET /api/v1/settings/public` (Atau bisa disisipkan di dalam response Wallet Info)
- **Kebutuhan Field:**
  ```json
  {
    "coin_rate": 1000,
    "bank_info": {
      "bank_name": "BCA",
      "account_number": "1234567890",
      "account_name": "PaskiHub Indonesia"
    }
  }
  ```

## 2. Wallet Info Enhancement

- **Endpoint:** `GET /api/v1/wallets/{eventId}`
- **Tambahan Field Disarankan:**
  - `successful_topup_count`: number (Jumlah top up yang sudah Approved)
  - `pending_topup_count`: number (Jumlah top up yang masih Pending)

## 3. Wallet Logs (Riwayat Transaksi)

- **Endpoint:** `GET /api/v1/wallets/{eventId}/logs`
- **Pastikan struktur data log memiliki:**
  - `id`: string
  - `type`: string ("Top Up", "Pengurangan", dll)
  - `amount`: number
  - `status`: string ("Pending", "Approved", "Rejected", "Success")
  - `created_at`: string (ISO Date)
