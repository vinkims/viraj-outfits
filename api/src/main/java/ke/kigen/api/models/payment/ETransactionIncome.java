package ke.kigen.api.models.payment;

import java.io.Serializable;
import java.util.Objects;

import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.MapsId;
import ke.kigen.api.models.income.EIncome;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity(name = "transaction_incomes")
@Data
@NoArgsConstructor
public class ETransactionIncome implements Serializable {
    
    private static final long serialVersionUID = 1L;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "income_id", referencedColumnName = "id")
    @MapsId(value = "incomeId")
    private EIncome income;

    @EmbeddedId
    private PKTransactionIncome pkTransactionIncome;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "transaction_id", referencedColumnName = "id")
    @MapsId(value = "transactionId")
    private ETransaction transaction;

    public ETransactionIncome(ETransaction transaction, EIncome income) {
        setIncome(income);
        setTransaction(transaction);
        setPkTransactionIncome(new PKTransactionIncome(transaction.getId(), income.getId()));
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(pkTransactionIncome);
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

        return Objects.equals(pkTransactionIncome, ((ETransactionIncome) object).getPkTransactionIncome());
    }
}
