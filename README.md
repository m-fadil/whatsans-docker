1. Ubah `<db-provider>` sesuai dengan db yang digunakan
    ```json
    datasource db {
    provider = "<db-provider>"
    url      = env("DATABASE_URL")
    }
    ```
2. lengkapi .env