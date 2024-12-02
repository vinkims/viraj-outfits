ALTER TABLE sales ADD COLUMN reference VARCHAR(50);
ALTER TABLE sales ADD COLUMN payment_channel_id SMALLINT REFERENCES payment_channels("id") ON DELETE SET NULL;