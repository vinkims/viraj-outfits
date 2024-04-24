package ke.kigen.api.validators;

import org.springframework.stereotype.Component;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import ke.kigen.api.annotations.IsPaymentChannelNameValid;
import ke.kigen.api.services.payment.payment_channel.IPaymentChannel;
import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class VPaymentChannelNameValid implements ConstraintValidator<IsPaymentChannelNameValid, String> {
    
    private final IPaymentChannel sPaymentChannel;

    @Override
    public boolean isValid(String value, ConstraintValidatorContext context) {
        return value == null ? true : !sPaymentChannel.checkExistsByName(value);
    }
    
}
