UPDATE contact_types set regex_value = '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$' where id = 2;

ALTER TABLE users ADD COLUMN password_reset BOOLEAN DEFAULT FALSE;