package ke.kigen.api.dtos.expense;

import ke.kigen.api.annotations.IsExpenseTypeNameValid;
import ke.kigen.api.models.expense.EExpenseType;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class ExpenseTypeDTO {
    
    private Integer id;

    @IsExpenseTypeNameValid
    private String name;

    private String description;

    public ExpenseTypeDTO(EExpenseType expenseType) {
        setDescription(expenseType.getDescription());
        setId(expenseType.getId());
        setName(expenseType.getName());
    }
}
