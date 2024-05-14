package ke.kigen.api.services.payment.transaction;

import ke.kigen.api.models.income.EIncome;
import ke.kigen.api.models.payment.ETransaction;
import ke.kigen.api.models.payment.ETransactionIncome;

public interface ITransactionIncome {
    
    ETransactionIncome create(ETransaction transaction, EIncome income);

    void save(ETransactionIncome transactionIncome);
}
