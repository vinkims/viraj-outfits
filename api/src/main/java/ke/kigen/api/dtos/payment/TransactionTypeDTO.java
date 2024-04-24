package ke.kigen.api.dtos.payment;

import ke.kigen.api.models.payment.ETransactionType;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class TransactionTypeDTO {
    
    private Integer id;

    private String name;

    private String description;

    public TransactionTypeDTO(ETransactionType transactionType) {
        setDescription(transactionType.getDescription());
        setId(transactionType.getId());
        setName(transactionType.getName());
    }
}
