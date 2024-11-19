package ke.kigen.api.models.payment;

import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.MapsId;
import java.io.Serializable;
import java.util.Objects;
import ke.kigen.api.models.item.EItem;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity(name = "transaction_items")
@Data
@NoArgsConstructor
public class ETransactionItem implements Serializable {
    
    private static final long serialVersionUID = 1L;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "item_id", referencedColumnName = "id")
    @MapsId(value = "itemId")
    private EItem item;

    @EmbeddedId
    private PKTransactionItem pkTransactionItem;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "transaction_id", referencedColumnName = "id")
    @MapsId(value = "transactionId")
    private ETransaction transaction;

    public ETransactionItem(ETransaction transaction, EItem item) {
        setItem(item);
        setTransaction(transaction);
        setPkTransactionItem(new PKTransactionItem(transaction.getId(), item.getId()));
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(pkTransactionItem);
    }

    @Override
    public boolean equals(Object object) {
        if (this == object) {
            return true;
        }
        if (object == null) {
            return false;
        }
        if (object.getClass() != getClass()) {
            return false;
        }

        return Objects.equals(pkTransactionItem, ((ETransactionItem) object).getPkTransactionItem());
    }
}
