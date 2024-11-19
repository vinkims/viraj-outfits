package ke.kigen.api.models.payment;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import java.io.Serializable;
import lombok.Data;
import lombok.NoArgsConstructor;

@Embeddable
@Data
@NoArgsConstructor
public class PKTransactionItem implements Serializable {
    
    private static final long serialVersionUID = 1L;

    @Column(name = "transaction_id")
    private Integer transactionId;

    @Column(name = "item_id")
    private Integer itemId;

    public PKTransactionItem(Integer transactionId, Integer itemId) {
        setItemId(itemId);
        setTransactionId(transactionId);
    }

    @Override
    public int hashCode() {
        int hash = 31 + ((transactionId == null) ? 0 : transactionId.hashCode());
        hash *= 31 + ((itemId == null) ? 0 : itemId.hashCode());
        return hash;
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

        PKTransactionItem pkTransactionItem = (PKTransactionItem) object;

        if (transactionId == null && pkTransactionItem.getTransactionId() != null) {
            return false;
        }
        if (itemId == null && pkTransactionItem.getItemId() != null) {
            return false;
        }

        return true;
    }
}
