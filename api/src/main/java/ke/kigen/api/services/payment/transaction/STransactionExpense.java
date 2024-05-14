package ke.kigen.api.services.payment.transaction;

import org.springframework.stereotype.Service;

import ke.kigen.api.models.expense.EExpense;
import ke.kigen.api.models.payment.ETransaction;
import ke.kigen.api.models.payment.ETransactionExpense;
import ke.kigen.api.repositories.payment.TransactionExpenseDAO;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class STransactionExpense implements ITransactionExpense {
    
    private final TransactionExpenseDAO transactionExpenseDAO;

    @Override
    public ETransactionExpense create(ETransaction transaction, EExpense expense) {
        ETransactionExpense transactionExpense = new ETransactionExpense(transaction, expense);
        save(transactionExpense);
        return transactionExpense;
    }

    @Override
    public void save(ETransactionExpense transactionExpense) {
        transactionExpenseDAO.save(transactionExpense);
    }
    
}
