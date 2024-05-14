package ke.kigen.api.models.payment;

import java.io.Serializable;
import java.util.Objects;

import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.MapsId;
import ke.kigen.api.models.expense.EExpense;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity(name = "transaction_expenses")
@Data
@NoArgsConstructor
public class ETransactionExpense implements Serializable {
    
    private static final long serialVersionUID = 1L;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "expense_id", referencedColumnName = "id")
    @MapsId(value = "expenseId")
    private EExpense expense;

    @EmbeddedId
    private PKTransactionExpense pkTransactionExpense;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "transaction_id", referencedColumnName = "id")
    @MapsId(value = "transactionId")
    private ETransaction transaction;

    public ETransactionExpense(ETransaction transaction, EExpense expense) {
        setExpense(expense);
        setTransaction(transaction);
        setPkTransactionExpense(new PKTransactionExpense(transaction.getId(), expense.getId()));
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(pkTransactionExpense);
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

        return Objects.equals(pkTransactionExpense, ((ETransactionExpense) object).getPkTransactionExpense());
    }
}
