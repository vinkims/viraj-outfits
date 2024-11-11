-- Add item_code to items table
ALTER TABLE items ADD COLUMN "item_code" VARCHAR(20);
ALTER TABLE items ADD COLUMN "selling_price" NUMERIC(11, 4) DEFAULT 0;