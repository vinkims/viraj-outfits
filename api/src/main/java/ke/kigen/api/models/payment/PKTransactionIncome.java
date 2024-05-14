package ke.kigen.api.models.payment;

import java.io.Serializable;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.Data;
import lombok.NoArgsConstructor;

@Embeddable
@Data
@NoArgsConstructor
public class PKTransactionIncome implements Serializable {
    
    private static final long serialVersionUID = 1L;

    @Column(name = "transaction_id")
    private Integer transactionId;

    @Column(name = "income_id")
    private Integer incomeId;

    public PKTransactionIncome(Integer transactionId, Integer incomeId) {
        setIncomeId(incomeId);
        setTransactionId(transactionId);
    }

    @Override
    public int hashCode() {
        int hash = 31 + ((transactionId == null) ? 0 : transactionId.hashCode());
        hash *= 31 + ((incomeId == null) ? 0 : incomeId.hashCode());
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

        PKTransactionIncome pkTransactionIncome = (PKTransactionIncome) object;

        if (transactionId == null && pkTransactionIncome.getTransactionId() != null) {
            return false;
        }
        if (incomeId == null && pkTransactionIncome.getIncomeId() != null) {
            return false;
        }

        return true;
    }
}
