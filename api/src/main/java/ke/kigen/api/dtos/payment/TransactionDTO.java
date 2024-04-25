package ke.kigen.api.dtos.payment;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonInclude.Include;

import ke.kigen.api.annotations.IsTransactionDuplicate;
import ke.kigen.api.dtos.status.StatusDTO;
import ke.kigen.api.models.payment.ETransaction;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@JsonInclude(value = Include.NON_NULL)
public class TransactionDTO {
    
    private Integer id;

    @IsTransactionDuplicate
    private String transactionCode;

    private BigDecimal amount;

    private LocalDateTime createdOn;

    private String description;

    private TransactionTypeDTO transactionType;

    private Integer transactionTypeId;

    private String reference;

    private LocalDateTime updatedOn;

    private StatusDTO status;

    private Integer statusId;

    public TransactionDTO(ETransaction transaction) {
        setAmount(transaction.getAmount());
        setCreatedOn(transaction.getCreatedOn());
        setDescription(transaction.getDescription());
        setId(transaction.getId());
        setReference(transaction.getReference());
        setStatus(new StatusDTO(transaction.getStatus()));
        setTransactionCode(transaction.getTransactionCode());
        setTransactionType(new TransactionTypeDTO(transaction.getTransactionType()));
        setUpdatedOn(transaction.getUpdatedOn());
    }
}
