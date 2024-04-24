package ke.kigen.api.dtos.payment;

import ke.kigen.api.annotations.IsPaymentChannelNameValid;
import ke.kigen.api.models.payment.EPaymentChannel;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class PaymentChannelDTO {
    
    private Integer id;

    @IsPaymentChannelNameValid
    private String name;

    private String description;

    public PaymentChannelDTO(EPaymentChannel paymentChannel) {
        setDescription(paymentChannel.getDescription());
        setId(paymentChannel.getId());
        setName(paymentChannel.getName());
    }
}
