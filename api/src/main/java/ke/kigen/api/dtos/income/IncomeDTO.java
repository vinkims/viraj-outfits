package ke.kigen.api.dtos.income;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import ke.kigen.api.dtos.status.StatusDTO;
import ke.kigen.api.dtos.user.UserDTO;
import ke.kigen.api.models.income.EIncome;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class IncomeDTO {
    
    private Integer id;

    private IncomeTypeDTO incomeType;

    private Integer incomeTypeId;

    private BigDecimal amount;

    private LocalDateTime createdOn;

    private String description;

    private UserDTO user;

    private Integer userId;

    private StatusDTO status;

    private Integer statusId;

    private LocalDateTime updatedOn;

    public IncomeDTO(EIncome income) {
        setAmount(income.getAmount());
        setCreatedOn(income.getCreatedOn());
        setDescription(income.getDescription());
        setId(income.getId());
        setIncomeType(new IncomeTypeDTO(income.getIncomeType()));
        setStatus(new StatusDTO(income.getStatus()));
        setUpdatedOn(income.getUpdatedOn());
        if (income.getUser() != null) {
            setUser(new UserDTO(income.getUser()));
        }
    }
}
