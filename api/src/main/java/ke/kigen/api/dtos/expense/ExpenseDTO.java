package ke.kigen.api.dtos.expense;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import ke.kigen.api.dtos.status.StatusDTO;
import ke.kigen.api.dtos.user.UserDTO;
import ke.kigen.api.models.expense.EExpense;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class ExpenseDTO {
    
    private Integer id;

    private ExpenseTypeDTO expenseType;

    private Integer expenseTypeId;

    private BigDecimal amount;

    private LocalDateTime createdOn;

    private LocalDateTime updatedOn;

    private String description;

    private UserDTO user;

    private Integer userId;

    private StatusDTO status;

    private Integer statusId;

    public ExpenseDTO(EExpense expense) {
        setAmount(expense.getAmount());
        setCreatedOn(expense.getCreatedOn());
        setDescription(expense.getDescription());
        setExpenseType(new ExpenseTypeDTO(expense.getExpenseType()));
        setId(expense.getId());
        setStatus(new StatusDTO(expense.getStatus()));
        setUpdatedOn(expense.getUpdatedOn());
        if (expense.getUser() != null) {
            setUser(new UserDTO(expense.getUser()));
        }
    }
}
