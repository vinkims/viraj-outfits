INSERT INTO statuses("id", "name", "description")
VALUES
    (1, 'active', 'resource enabled for all corresponding functionality'),
    (2, 'inactive', 'resource locked for some/all functionality'),
    (3, 'pending', 'resource awaiting further action, temporarily blocked from some operations'),
    (4, 'complete', 'resource action successfully completed'),
    (5, 'failed', 'transaction unsuccessful'),
    (6, 'rejected', 'transaction rejected'),
    (7, 'canceled', 'transaction canceled by user'),
    (8, 'partial', 'resource has not been actioned fully'),
    (9, 'sold', 'item has been sold'),
    (10, 'in-stock', 'item is in stock');

alter sequence IF EXISTS statuses_id_seq restart with 10;

INSERT INTO roles("id", "name", "description")
VALUES
    (1, 'system-admin','System administrator'),
    (2, 'admin', 'store administrator'),
    (3, 'attendant', 'store attendant'),
    (4, 'api-client', 'api client');

alter sequence IF EXISTS roles_id_seq restart with 4;

INSERT INTO contact_types("id", "name", "description", "regex_value")
VALUES
    (1, 'mobile_number', 'Mobile number', '^[0-9]{12}$'),
    (2, 'email', 'Email address', '^(?<a>\\w*)(?<b>[\\.-]\\w*){0,3}@(?<c>\\w+)(?<d>\\.\\w{2,}){1,3}$');

alter sequence IF EXISTS contact_types_id_seq restart with 3;

INSERT INTO categories("id", "name", "description")
VALUES
    (1, 'gents', 'Male category'),
    (2, 'ladies', 'Female category'),
    (3, 'kids', 'Kids category');

alter sequence IF EXISTS categories_id_seq restart with 4;

INSERT INTO payment_channels("id", "name", "description")
VALUES
    (1, 'cash', 'Cash payments'),
    (2, 'mpesa', 'Mpesa direct deposit'),
    (3, 'lnmo', 'Lipa na Mpesa Online(STK push)'),
    (4, 'bank', 'Bank payments');

alter sequence IF EXISTS payment_channels_id_seq restart with 4;

INSERT INTO transaction_types("id", "name", "description")
VALUES
    (1, 'purchase', 'Store items are purchased from supplier(s)'),
    (2, 'sale', 'A customer buys an item from the store'),
    (3, 'return', 'A customer returns an item previously purchased'),
    (4, 'exchange', 'A customer exchanges an item for a different one'),
    (5, 'refund', 'A customer is refunded for a returned item or canceled order'),
    (6, 'order', 'A customer places an order for an item'),
    (7, 'payment', 'A customer makes a payment for an order'),
    (8, 'cancellation', 'An order is canceled by the customer'),
    (9, 'discount', 'A discount or promotional offer is applied to an order'),
    (10, 'income', 'Transactions relating to incomes'),
    (11, 'expenses', 'Transactions relating to expenses');

alter sequence IF EXISTS transaction_types_id_seq restart with 12;

INSERT INTO order_types("id", "name", "description")
VALUES
    (1, 'sales', 'Sale of items from the store'),
    (2, 'purchases', 'Purchase of items from suppliers');

alter sequence IF EXISTS order_types_id_seq restart with 3;

INSERT INTO expense_types("id", "name", "description")
VALUES
    (1, 'items_cost', 'Expenses relating to purchasing inventory'),
    (2, 'rent_payment', 'Monthly rental or lease payments'),
    (3, 'salary', 'Salaries or wages paid to store employees'),
    (4, 'utilities', 'Utility expenses for the store'),
    (5, 'marketing', 'Expenses for advertising campaigns, social media marketing and promotional materials'),
    (6, 'supplies', 'Expenses for store fixures, hangers, bags, packaging materials and cleaning supplies'),
    (7, 'tailoring', 'Costs for sewing machines, threads, needles and other tailoring services'),
    (8, 'insurance', 'Premiums for business insurance policies'),
    (9, 'inventory_management', 'Costs associated with inventory management systems, software or services'),
    (10, 'maintenance', 'Costs for maintaining and repairing store equipment, fixtures and facilities');

alter sequence IF EXISTS expense_types_id_seq restart with 11;

INSERT INTO income_types("id", "name", "description")
VALUES
    (1, 'sales_revenue', 'Income generated from selling clothe items'),
    (2, 'tailoring_services', 'Income from providing tailoring or alteration services for clothing items'),
    (3, 'gift_card_sales', 'Revenue from selling gift cards that can be redeemed for clothing purchases');

alter sequence IF EXISTS income_types_id_seq restart with 4;