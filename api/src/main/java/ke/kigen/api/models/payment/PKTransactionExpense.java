package ke.kigen.api.models.payment;

import java.io.Serializable;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.Data;
import lombok.NoArgsConstructor;

@Embeddable
@Data
@NoArgsConstructor
public class PKTransactionExpense implements Serializable {
    
    private static final long serialVersionUID = 1L;

    @Column(name = "transaction_id")
    private Integer transactionId;

    @Column(name = "expense_id")
    private Integer expenseId;

    public PKTransactionExpense(Integer transactionId, Integer expenseId) {
        setExpenseId(expenseId);
        setTransactionId(transactionId);
    }

    @Override
    public int hashCode() {
        int hash = 31 + ((transactionId == null) ? 0 : transactionId.hashCode());
        hash *= 31 + ((expenseId == null) ? 0 : expenseId.hashCode());
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

        PKTransactionExpense pkTransactionExpense = (PKTransactionExpense) object;

        if (transactionId == null && pkTransactionExpense.getTransactionId() != null) {
            return false;
        }
        if (expenseId == null && pkTransactionExpense.getExpenseId() != null) {
            return false;
        }

        return true;
    }
}
