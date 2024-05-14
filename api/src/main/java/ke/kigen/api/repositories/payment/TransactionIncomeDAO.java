package ke.kigen.api.repositories.payment;

import org.springframework.data.jpa.repository.JpaRepository;

import ke.kigen.api.models.payment.ETransactionIncome;
import ke.kigen.api.models.payment.PKTransactionIncome;

public interface TransactionIncomeDAO extends JpaRepository<ETransactionIncome, PKTransactionIncome> {
    
}
