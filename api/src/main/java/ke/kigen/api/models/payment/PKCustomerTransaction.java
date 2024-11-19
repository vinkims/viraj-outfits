package ke.kigen.api.models.payment;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import java.io.Serializable;
import lombok.Data;
import lombok.NoArgsConstructor;

@Embeddable
@Data
@NoArgsConstructor
public class PKCustomerTransaction implements Serializable {
    
    private static final long serialVersionUID = 1L;

    @Column(name = "customer_id")
    private Integer customerId;

    @Column(name = "transaction_id")
    private Integer transactionId;

    public PKCustomerTransaction(Integer customerId, Integer transactionId) {
        setCustomerId(customerId);
        setTransactionId(transactionId);
    }

    @Override
    public int hashCode() {
        int hash = 31 + ((transactionId == null) ? 0 : transactionId.hashCode());
        hash *= 31 + ((customerId == null) ? 0 : customerId.hashCode());
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

        PKCustomerTransaction pkCustomerTransaction = (PKCustomerTransaction) object;

        if (transactionId == null && pkCustomerTransaction.getTransactionId() != null) {
            return false;
        }
        if (customerId == null && pkCustomerTransaction.getCustomerId() != null) {
            return false;
        }

        return true;
    }
}
