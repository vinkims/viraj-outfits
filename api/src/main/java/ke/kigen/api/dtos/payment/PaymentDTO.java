package ke.kigen.api.dtos.payment;

import java.time.LocalDateTime;

import ke.kigen.api.dtos.order.OrderDTO;
import ke.kigen.api.dtos.status.StatusDTO;
import ke.kigen.api.models.payment.EPayment;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class PaymentDTO {
    
    private Integer id;

    private String externalId;

    private String amount;

    private LocalDateTime createdOn;

    private String description;

    private String reference;

    private PaymentChannelDTO paymentChannel;

    private Integer paymentChannelId;

    private TransactionDTO transaction;

    private Integer transactionId;

    private OrderDTO order;

    private Integer orderId;

    private LocalDateTime updatedOn;

    private StatusDTO status;

    private Integer statusId;

    public PaymentDTO(EPayment payment){
        setAmount(payment.getAmount());
        setCreatedOn(payment.getCreatedOn());
        setDescription(payment.getDescription());
        setExternalId(payment.getExternalId());
        setId(payment.getId());
        if (payment.getOrder() != null) {
            setOrder(new OrderDTO(payment.getOrder()));
        }
        setPaymentChannel(new PaymentChannelDTO(payment.getPaymentChannel()));
        setReference(payment.getReference());
        setStatus(new StatusDTO(payment.getStatus()));
        setTransaction(new TransactionDTO(payment.getTransaction()));
        setUpdatedOn(payment.getUpdatedOn());
    }
}
