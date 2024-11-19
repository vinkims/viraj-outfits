package ke.kigen.api.configs.properties.payment_channel;

import org.springframework.boot.context.properties.ConfigurationProperties;

import lombok.Data;

@ConfigurationProperties(prefix = "payment-channel")
@Data
public class PaymentChannelConfig {
    
    private Integer bankId;

    private Integer cashId;

    private Integer mpesaId;

    private Integer stkPushId;

    public PaymentChannelConfig() {
        setBankId(4);
        setCashId(1);
        setMpesaId(2);
        setStkPushId(3);
    }
}
