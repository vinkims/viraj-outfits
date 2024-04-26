package ke.kigen.api.validators;

import org.springframework.stereotype.Component;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import ke.kigen.api.annotations.IsPaymentDuplicate;
import ke.kigen.api.services.payment.IPayment;
import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class VPaymentDuplicate implements ConstraintValidator<IsPaymentDuplicate, String> {
    
    private final IPayment sPayment;

    @Override
    public boolean isValid(String value, ConstraintValidatorContext context) {
        return value == null ? true : !sPayment.checkExistsByExternalId(value);
    }
}
