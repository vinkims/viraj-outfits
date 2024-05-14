package ke.kigen.api.services.payment.transaction;

import org.springframework.stereotype.Service;

import ke.kigen.api.models.income.EIncome;
import ke.kigen.api.models.payment.ETransaction;
import ke.kigen.api.models.payment.ETransactionIncome;
import ke.kigen.api.repositories.payment.TransactionIncomeDAO;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class STransactionIncome implements ITransactionIncome {
    
    private final TransactionIncomeDAO transactionIncomeDAO;

    @Override
    public ETransactionIncome create(ETransaction transaction, EIncome income) {
        ETransactionIncome transactionIncome = new ETransactionIncome(transaction, income);
        save(transactionIncome);
        return transactionIncome;
    }

    @Override
    public void save(ETransactionIncome transactionIncome) {
        transactionIncomeDAO.save(transactionIncome);
    }
}
