package ke.kigen.api.repositories.payment;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import ke.kigen.api.models.payment.ETransactionSource;

public interface TransactionSourceDAO extends JpaRepository<ETransactionSource, Integer>, JpaSpecificationExecutor<ETransactionSource> {
    
    Boolean existsByName(String name);
}
