INSERT INTO transaction_types("id", "name", "description")
VALUES
    (18, 'capital_injection', 'funds contributed by the owner'),
    (19, 'loan_injection', 'funds borrowed from external sources'),
    (20, 'loan_payment', 'funds for repayment of loans');

alter sequence IF EXISTS transaction_types_id_seq restart with 21;