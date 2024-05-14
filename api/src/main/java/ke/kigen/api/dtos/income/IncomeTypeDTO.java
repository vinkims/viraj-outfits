package ke.kigen.api.dtos.income;

import ke.kigen.api.annotations.IsIncomeTypeNameValid;
import ke.kigen.api.models.income.EIncomeType;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class IncomeTypeDTO {
    
    private Integer id;

    @IsIncomeTypeNameValid
    private String name;

    private String description;

    public IncomeTypeDTO(EIncomeType incomeType) {
        setDescription(incomeType.getDescription());
        setId(incomeType.getId());
        setName(incomeType.getName());
    }
}
