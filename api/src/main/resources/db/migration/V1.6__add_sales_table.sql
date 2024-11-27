CREATE TABLE IF NOT EXISTS sales_types (
    "id" SMALLSERIAL PRIMARY KEY,
    "name" VARCHAR(50) NOT NULL UNIQUE,
    "description" VARCHAR(150)
);

CREATE TABLE IF NOT EXISTS sales (
    "id" SERIAL PRIMARY KEY,
    "created_on" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    "updated_on" TIMESTAMPTZ,
    "sales_number" VARCHAR(50) UNIQUE,
    "transaction_id" INTEGER REFERENCES transactions("id") ON DELETE SET NULL,
    "item_id" INTEGER REFERENCES items("id") ON DELETE SET NULL,
    "customer_id" INTEGER REFERENCES customers("id") ON DELETE SET NULL,
    "sales_type_id" SMALLINT REFERENCES sales_types("id") ON DELETE SET NULL,
    "amount" NUMERIC(11, 4) DEFAULT 0,
    "discount" NUMERIC(11, 4) DEFAULT 0,
    "net_amount" NUMERIC(11, 4) DEFAULT 0,
    "user_id" INTEGER REFERENCES users("id") ON DELETE SET NULL,
    "status_id" SMALLINT REFERENCES statuses("id") ON DELETE SET NULL
);