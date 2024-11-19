package ke.kigen.api.dtos.payment;

import ke.kigen.api.dtos.item.ItemDTO;
import ke.kigen.api.models.payment.ETransactionItem;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class TransactionItemDTO {
    
    private ItemDTO item;

    private Integer itemId;

    public TransactionItemDTO(ETransactionItem transactionItem) {
        setItem(new ItemDTO(transactionItem.getItem()));
    }
}
