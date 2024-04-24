package ke.kigen.api.repositories.payment;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import ke.kigen.api.models.payment.ETransactionType;

public interface TransactionTypeDAO extends JpaRepository<ETransactionType, Integer>, JpaSpecificationExecutor<ETransactionType> {
    
    Boolean existsByName(String name);
}
