-- statuses
CREATE TABLE IF NOT EXISTS statuses (
    "id" SMALLSERIAL PRIMARY KEY,
    "name" VARCHAR(50) NOT NULL UNIQUE,
    "description" VARCHAR(150)
);

-- roles
CREATE TABLE IF NOT EXISTS roles (
    "id" SMALLSERIAL PRIMARY KEY,
    "name" VARCHAR(50) NOT NULL UNIQUE,
    "description" VARCHAR(150)
);

-- users
CREATE TABLE IF NOT EXISTS users (
    "id" SERIAL PRIMARY KEY,
    "created_on" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    "updated_on" TIMESTAMPTZ,
    "last_active_on" TIMESTAMPTZ,
    "first_name" VARCHAR(50),
    "middle_name" VARCHAR(50),
    "last_name" VARCHAR(50),
    "password" VARCHAR,
    "role_id" SMALLINT REFERENCES roles("id") ON DELETE SET NULL,
    "status_id" SMALLINT REFERENCES statuses("id") ON DELETE SET NULL
);

-- contact_types
CREATE TABLE IF NOT EXISTS contact_types (
    "id" SMALLSERIAL PRIMARY KEY,
    "name" VARCHAR(50) NOT NULL UNIQUE,
    "description" VARCHAR(150),
    "regex_value" VARCHAR(150)
);

-- contacts
CREATE TABLE IF NOT EXISTS contacts (
    "user_id" INTEGER REFERENCES users("id") ON DELETE CASCADE,
    "contact_type_id" SMALLINT REFERENCES contact_types("id") ON DELETE SET NULL,
    "value" VARCHAR(100) PRIMARY KEY NOT NULL UNIQUE
);

-- customers
CREATE TABLE IF NOT EXISTS customers (
    "id" SERIAL PRIMARY KEY,
    "created_on" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    "updated_on" TIMESTAMPTZ,
    "first_name" VARCHAR(50),
    "last_name" VARCHAR(50),
    "email" VARCHAR(150),
    "mobile_number" VARCHAR(50),
    "status_id" SMALLINT REFERENCES statuses("id") ON DELETE SET NULL
);

-- blacklist_tokens
CREATE TABLE IF NOT EXISTS blacklist_tokens (
    "id" SERIAL PRIMARY KEY,
    "user_id" INTEGER REFERENCES users("id") ON DELETE SET NULL,
    "token_hash" BIGINT NOT NULL UNIQUE,
    "created_on" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- categories
CREATE TABLE IF NOT EXISTS categories (
    "id" SMALLSERIAL PRIMARY KEY,
    "name" VARCHAR(50) NOT NULL UNIQUE,
    "description" VARCHAR(150)
);

-- item_types
CREATE TABLE IF NOT EXISTS item_types (
    "id" SMALLSERIAL PRIMARY KEY,
    "created_on" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    "updated_on" TIMESTAMPTZ,
    "name" VARCHAR(50) NOT NULL UNIQUE,
    "description" VARCHAR(150),
    "status_id" SMALLINT REFERENCES statuses("id") ON DELETE SET NULL
);

-- images
CREATE TABLE IF NOT EXISTS images(
    "id" SERIAL PRIMARY KEY,
    "created_on" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    "updated_on" TIMESTAMPTZ,
    "image_data" BYTEA
);

-- items
CREATE TABLE IF NOT EXISTS items (
    "id" SERIAL PRIMARY KEY,
    "created_on" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    "updated_on" TIMESTAMPTZ,
    "name" VARCHAR(50),
    "item_type_id" SMALLINT REFERENCES item_types("id") ON DELETE SET NULL,
    "category_id" SMALLINT REFERENCES categories("id") ON DELETE SET NULL,
    "color" VARCHAR(50),
    "size" VARCHAR(50),
    "price" NUMERIC(11, 4) DEFAULT 0,
    "image_id" INTEGER REFERENCES images("id") ON DELETE SET NULL,
    "status_id" SMALLINT REFERENCES statuses("id") ON DELETE SET NULL
);

-- inventories
CREATE TABLE IF NOT EXISTS inventories (
    "id" SERIAL PRIMARY KEY,
    "item_id" INTEGER REFERENCES items("id") ON DELETE SET NULL,
    "quantity" SMALLINT,
    "created_on" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    "updated_on" TIMESTAMPTZ
);

-- expense_types
CREATE TABLE IF NOT EXISTS expense_types (
    "id" SMALLSERIAL PRIMARY KEY,
    "name" VARCHAR(50) NOT NULL UNIQUE,
    "description" VARCHAR(150)
);

-- expenses
CREATE TABLE IF NOT EXISTS expenses (
    "id" SERIAL PRIMARY KEY,
    "expense_type_id" SMALLINT REFERENCES expense_types("id") ON DELETE SET NULL,
    "created_on" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    "updated_on" TIMESTAMPTZ,
    "description" VARCHAR(200),
    "amount" NUMERIC(11, 4) DEFAULT 0,
    "user_id" INTEGER REFERENCES users("id") ON DELETE SET NULL,
    "status_id" SMALLINT REFERENCES statuses("id") ON DELETE SET NULL
);

-- income_types
CREATE TABLE IF NOT EXISTS income_types (
    "id" SMALLSERIAL PRIMARY KEY,
    "name" VARCHAR(50) NOT NULL UNIQUE,
    "description" VARCHAR(150)
);

-- incomes
CREATE TABLE IF NOT EXISTS incomes (
    "id" SERIAL PRIMARY KEY,
    "income_type_id" SMALLINT REFERENCES income_types("id") ON DELETE SET NULL,
    "created_on" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    "updated_on" TIMESTAMPTZ,
    "description" VARCHAR(200),
    "amount" NUMERIC(11, 4) DEFAULT 0,
    "user_id" INTEGER REFERENCES users("id") ON DELETE SET NULL,
    "status_id" SMALLINT REFERENCES statuses("id") ON DELETE SET NULL
);

-- payment_channels
CREATE TABLE IF NOT EXISTS payment_channels (
    "id" SMALLSERIAL PRIMARY KEY,
    "name" VARCHAR(50) NOT NULL UNIQUE,
    "description" VARCHAR(150)
);

-- transaction_types
CREATE TABLE IF NOT EXISTS transaction_types (
    "id" SMALLSERIAL PRIMARY KEY,
    "name" VARCHAR(50) NOT NULL UNIQUE,
    "description" VARCHAR(150)
);

-- transactions
CREATE TABLE IF NOT EXISTS transactions (
    "id" SERIAL PRIMARY KEY,
    "created_on" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    "updated_on"TIMESTAMPTZ,
    "transaction_code" VARCHAR UNIQUE,
    "description" VARCHAR(200),
    "amount" NUMERIC(11, 4) DEFAULT 0,
    "transaction_type_id" SMALLINT REFERENCES transaction_types("id") ON DELETE SET NULL,
    "reference" VARCHAR(150),
    "status_id" SMALLINT REFERENCES statuses("id") ON DELETE SET NULL
);

-- transaction_expenses
CREATE TABLE IF NOT EXISTS transaction_expenses (
    "transaction_id" INTEGER REFERENCES transactions("id") ON DELETE CASCADE,
    "expense_id" INTEGER REFERENCES expenses("id") ON DELETE CASCADE,
    PRIMARY KEY("transaction_id", "expense_id")
);

-- transaction_incomes
CREATE TABLE IF NOT EXISTS transaction_incomes (
    "transaction_id" INTEGER REFERENCES transactions("id") ON DELETE CASCADE,
    "income_id" INTEGER REFERENCES incomes("id") ON DELETE CASCADE,
    PRIMARY KEY("transaction_id", "income_id")
);

-- order_types
CREATE TABLE IF NOT EXISTS order_types (
    "id" SMALLSERIAL PRIMARY KEY,
    "name" VARCHAR(50) NOT NULL UNIQUE,
    "description" VARCHAR(150)
);

-- orders
CREATE TABLE IF NOT EXISTS orders (
    "id" SERIAL PRIMARY KEY,
    "created_on" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    "updated_on" TIMESTAMPTZ,
    "order_type_id" SMALLINT REFERENCES order_types("id") ON DELETE SET NULL,
    "total_amount" NUMERIC(11, 4) DEFAULT 0,
    "customer_id" INTEGER REFERENCES customers("id") ON DELETE SET NULL,
    "user_id" INTEGER REFERENCES users("id") ON DELETE SET NULL,
    "status_id" SMALLINT REFERENCES statuses("id") ON DELETE SET NULL
);

-- payments
CREATE TABLE IF NOT EXISTS payments (
    "id" SERIAL PRIMARY KEY,
    "created_on" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    "updated_on" TIMESTAMPTZ,
    "external_id" VARCHAR UNIQUE,
    "amount" NUMERIC(11, 4) DEFAULT 0,
    "description" VARCHAR(200),
    "reference" VARCHAR(150),
    "payment_channel_id" SMALLINT REFERENCES payment_channels("id") ON DELETE SET NULL,
    "transaction_id" INTEGER REFERENCES transactions("id") ON DELETE SET NULL,
    "order_id" INTEGER REFERENCES orders("id") ON DELETE SET NULL,
    "status_id" SMALLINT REFERENCES statuses("id") ON DELETE SET NULL
);

-- order_items
CREATE TABLE IF NOT EXISTS order_items (
    "order_id" INTEGER REFERENCES orders("id") ON DELETE CASCADE,
    "item_id" INTEGER REFERENCES items("id") ON DELETE CASCADE,
    "quantity" SMALLINT,
    "unit_price" NUMERIC(11, 4) DEFAULT 0,
    "subtotal" NUMERIC(11, 4) DEFAULT 0,
    PRIMARY KEY("order_id", "item_id")
);

-- permissions
CREATE TABLE IF NOT EXISTS permissions (
    "id" SMALLSERIAL PRIMARY KEY,
    "created_on" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    "updated_on" TIMESTAMPTZ,
    "name" VARCHAR(50),
    "method" VARCHAR(10),
    "resource" VARCHAR(100)
);

-- role_permissions
CREATE TABLE IF NOT EXISTS role_permissions (
    "role_id" SMALLINT REFERENCES roles("id") ON DELETE CASCADE,
    "permission_id" SMALLINT REFERENCES permissions("id") ON DELETE CASCADE,
    PRIMARY KEY("role_id", "permission_id")
);
