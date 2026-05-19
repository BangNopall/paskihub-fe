# Backend Requirements for Admin Transaction Management

To fully integrate the Admin Transaction page in the frontend, the following updates are required in the `paskihub-be` project:

## 1. New Endpoint: Get All Transactions

Currently, there is no endpoint for admins to list all top-up requests from all Event Organizers.

- **Endpoint:** `GET /api/v1/admin/transactions`
- **Access:** Admin only
- **Query Params (Optional):** `status` (PENDING, APPROVE, REJECTED), `page`, `limit`.
- **Response Fields:**
  - `id`: UUID
  - `eo_name`: String (Joined from `Wallet` -> `Event.Name`)
  - `amount`: Decimal
  - `status`: String
  - `proof_path`: String
  - `rejection_reason`: String (New field)
  - `created_at`: DateTime

## 2. Update Entity: `WalletTransaction`

The `WalletTransaction` entity in `domain/entity/wallet.go` needs a `rejection_reason` field to store why a top-up was denied.

```go
type WalletTransaction struct {
    // ... existing fields
    RejectionReason string `json:"rejection_reason" gorm:"type:varchar(255);default:null;"`
}
```

## 3. Update Rejection Logic

The `RejectTopUp` endpoint should accept a JSON body with the rejection reason.

- **Endpoint:** `PUT /api/v1/wallets/admin/transactions/:transactionId/reject`
- **Request Body:**

```json
{
  "rejection_reason": "Bukti transfer tidak valid"
}
```

## 4. Swagger Update

Please run `swag init` after making these changes to update the `swagger.json` documentation.
