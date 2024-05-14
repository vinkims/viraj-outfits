package ke.kigen.api.repositories.payment;

import org.springframework.data.jpa.repository.JpaRepository;

import ke.kigen.api.models.payment.ETransactionExpense;
import ke.kigen.api.models.payment.PKTransactionExpense;

public interface TransactionExpenseDAO extends JpaRepository<ETransactionExpense, PKTransactionExpense> {
    
}
