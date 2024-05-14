package ke.kigen.api.dtos.payment;

import ke.kigen.api.dtos.expense.ExpenseDTO;
import ke.kigen.api.models.payment.ETransactionExpense;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class TransactionExpenseDTO {
    
    private ExpenseDTO expense;

    private Integer expenseId;

    public TransactionExpenseDTO(ETransactionExpense transactionExpense) {
        setExpense(new ExpenseDTO(transactionExpense.getExpense()));
    }
}
