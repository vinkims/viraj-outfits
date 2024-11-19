package ke.kigen.api.repositories.payment;

import ke.kigen.api.models.payment.ETransactionItem;
import ke.kigen.api.models.payment.PKTransactionIncome;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface TransactionItemDAO extends JpaRepository<ETransactionItem, PKTransactionIncome> {
    
    @Query(
        value = "SELECT * FROM transaction_items "
            + "WHERE transaction_id = :transactionId "
            + "AND item_id = :itemId",
        nativeQuery = true
    )
    ETransactionItem findByTransactionAndItem(Integer transactionId, Integer itemId);
}
