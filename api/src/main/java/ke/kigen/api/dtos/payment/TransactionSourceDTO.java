package ke.kigen.api.dtos.payment;

import ke.kigen.api.models.payment.ETransactionSource;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class TransactionSourceDTO {
    
    private Integer id;

    private String name;

    private String description;

    public TransactionSourceDTO(ETransactionSource transactionSource) {
        setDescription(transactionSource.getDescription());
        setId(transactionSource.getId());
        setName(transactionSource.getName());
    }
}
