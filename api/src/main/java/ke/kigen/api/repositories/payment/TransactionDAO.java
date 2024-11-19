package ke.kigen.api.repositories.payment;

import java.util.Optional;
import ke.kigen.api.models.payment.ETransaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;

public interface TransactionDAO extends JpaRepository<ETransaction, Integer>, JpaSpecificationExecutor<ETransaction> {
    
    Boolean existsByTransactionCode(String transactionCode);

    @Query(
        value = "SELECT * FROM transactions "
            + "WHERE transaction_code = :transactionCode "
            + "OR id = :transactionId",
        nativeQuery = true
    )
    Optional<ETransaction> findByIdOrTransactionCode(Integer transactionId, String transactionCode);

    Optional<ETransaction> findByTransactionCode(String transactionCode);

    @Query(
        value = "SELECT transaction_code FROM transactions "
            + "ORDER BY id DESC LIMIT 1",
        nativeQuery = true
    )
    String findLastTransactionCode();
}
