package ke.kigen.api.models.payment;

import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.MapsId;
import java.io.Serializable;
import java.util.Objects;
import ke.kigen.api.models.customer.ECustomer;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity(name = "customer_transactions")
@Data
@NoArgsConstructor
public class ECustomerTransaction implements Serializable {
    
    private static final long serialVersionUID = 1L;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_id", referencedColumnName = "id")
    @MapsId(value = "customerId")
    private ECustomer customer;

    @EmbeddedId
    private PKCustomerTransaction pkCustomerTransaction;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "transaction_id", referencedColumnName = "id")
    @MapsId(value = "transactionId")
    private ETransaction transaction;

    public ECustomerTransaction(ECustomer customer, ETransaction transaction) {
        setCustomer(customer);
        setPkCustomerTransaction(new PKCustomerTransaction(customer.getId(), transaction.getId()));
        setTransaction(transaction);
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(pkCustomerTransaction);
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

        return Objects.equals(pkCustomerTransaction, ((ECustomerTransaction) object).getPkCustomerTransaction());
    }
}
