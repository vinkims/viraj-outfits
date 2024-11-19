package ke.kigen.api.services.payment.transaction;

import ke.kigen.api.models.item.EItem;
import ke.kigen.api.models.payment.ETransaction;
import ke.kigen.api.models.payment.ETransactionItem;

public interface ITransactionItem {
    
    ETransactionItem create(ETransaction transaction, EItem item);

    ETransactionItem getByTransactionAndItem(Integer transactionId, Integer itemId);

    void save(ETransactionItem transactionItem);
}
