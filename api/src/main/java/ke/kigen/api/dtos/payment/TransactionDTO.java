package ke.kigen.api.dtos.payment;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonInclude.Include;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import ke.kigen.api.annotations.IsTransactionDuplicate;
import ke.kigen.api.dtos.status.StatusDTO;
import ke.kigen.api.dtos.user.UserDTO;
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

    private TransactionSourceDTO transactionSource;

    private Integer transactionSourceId;

    private PaymentChannelDTO paymentChannel;

    private Integer paymentChannelId;

    private String reference;

    private UserDTO user;

    private Integer userId;

    private TransactionExpenseDTO transactionExpense;

    private TransactionIncomeDTO transactionIncome;

    private CustomerTransactionDTO customerTransaction;

    private TransactionItemDTO transactionItem;

    private LocalDateTime updatedOn;

    private StatusDTO status;

    private Integer statusId;

    public TransactionDTO(ETransaction transaction) {
        setAmount(transaction.getAmount());
        setCreatedOn(transaction.getCreatedOn());
        if (transaction.getCustomerTransaction() != null) {
            setCustomerTransaction(new CustomerTransactionDTO(transaction.getCustomerTransaction()));
        }
        setDescription(transaction.getDescription());
        setId(transaction.getId());
        if (transaction.getPaymentChannel() != null) {
            setPaymentChannel(new PaymentChannelDTO(transaction.getPaymentChannel()));
        }
        setReference(transaction.getReference());
        setStatus(new StatusDTO(transaction.getStatus()));
        setTransactionCode(transaction.getTransactionCode());
        if (transaction.getTransactionExpense() != null) {
            setTransactionExpense(new TransactionExpenseDTO(transaction.getTransactionExpense()));
        }
        if (transaction.getTransactionIncome() != null) {
            setTransactionIncome(new TransactionIncomeDTO(transaction.getTransactionIncome()));
        }
        if (transaction.getTransactionItem() != null) {
            setTransactionItem(new TransactionItemDTO(transaction.getTransactionItem()));
        }
        if (transaction.getTransactionSource() != null) {
            setTransactionSource(new TransactionSourceDTO(transaction.getTransactionSource()));
        }
        setTransactionType(new TransactionTypeDTO(transaction.getTransactionType()));
        setUpdatedOn(transaction.getUpdatedOn());
        if (transaction.getUser() != null) {
            setUser(new UserDTO(transaction.getUser()));
        }
    }
}
