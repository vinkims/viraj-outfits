CREATE TABLE IF NOT EXISTS transaction_sources (
    "id" SMALLSERIAL PRIMARY KEY,
    "name" VARCHAR(50) NOT NULL UNIQUE,
    "description" VARCHAR(150)
);

ALTER TABLE transactions ADD COLUMN transaction_source_id SMALLINT REFERENCES transaction_sources("id") ON DELETE SET NULL;
ALTER TABLE transactions ADD COLUMN payment_channel_id SMALLINT REFERENCES payment_channels("id") ON DELETE SET NULL;
ALTER TABLE transactions ADD COLUMN user_id INTEGER REFERENCES users("id") ON DELETE SET NULL;

CREATE TABLE IF NOT EXISTS customer_transactions (
    "customer_id" INTEGER REFERENCES customers("id") ON DELETE CASCADE,
    "transaction_id" INTEGER REFERENCES transactions("id") ON DELETE CASCADE,
    PRIMARY KEY("customer_id", "transaction_id")
);

CREATE TABLE IF NOT EXISTS transaction_items (
    "transaction_id" INTEGER REFERENCES transactions("id") ON DELETE CASCADE,
    "item_id" INTEGER REFERENCES items("id") ON DELETE CASCADE,
    PRIMARY KEY("transaction_id", "item_id")
);

INSERT INTO transaction_sources ("id", "name", "description")
VALUES 
    (1, 'walk-in', 'In-person purchases at the physical store'),
    (2, 'online', 'Transactions made from an online platform'),
    (3, 'manual', 'Manually recorded transactions by staff'),
    (4, 'adjustment', 'Manually entered transactions for adjustments');

alter sequence IF EXISTS transaction_sources_id_seq restart with 5;

INSERT INTO transaction_types("id", "name", "description")
VALUES
    (12, 'stock_adjustment', 'Adjustment due to damage, theft, or manual correction'),
    (13, 'restock', 'Items returned to inventory after customer return'),
    (14, 'delivery_fee', 'Delivery charges applied to customer orders'),
    (15, 'service_fee', 'Service charges applied to customer orders'),
    (16, 'cashback', 'A reward provided to the customer for a qualifying purchase'),
    (17, 'tax_payment', 'Tax payment by the business');

alter sequence IF EXISTS transaction_types_id_seq restart with 18;