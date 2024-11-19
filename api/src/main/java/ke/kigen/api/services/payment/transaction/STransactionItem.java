package ke.kigen.api.services.payment.transaction;

import ke.kigen.api.models.item.EItem;
import ke.kigen.api.models.payment.ETransaction;
import ke.kigen.api.models.payment.ETransactionItem;
import ke.kigen.api.repositories.payment.TransactionItemDAO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class STransactionItem implements ITransactionItem {
    
    private final TransactionItemDAO transactionItemDAO;

    @Override
    public ETransactionItem create(ETransaction transaction, EItem item) {
        ETransactionItem transactionItem = new ETransactionItem(transaction, item);
        save(transactionItem);
        return transactionItem;
    }

    @Override
    public ETransactionItem getByTransactionAndItem(Integer transactionId, Integer itemId) {
        return transactionItemDAO.findByTransactionAndItem(transactionId, itemId);
    }

    @Override
    public void save(ETransactionItem transactionItem) {
        transactionItemDAO.save(transactionItem);
    }
    
}
