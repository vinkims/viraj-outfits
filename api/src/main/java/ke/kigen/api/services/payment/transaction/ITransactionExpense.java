package ke.kigen.api.services.payment.transaction;

import ke.kigen.api.models.expense.EExpense;
import ke.kigen.api.models.payment.ETransaction;
import ke.kigen.api.models.payment.ETransactionExpense;

public interface ITransactionExpense {
    
    ETransactionExpense create(ETransaction transaction, EExpense expense);

    void save(ETransactionExpense transactionExpense);
}
