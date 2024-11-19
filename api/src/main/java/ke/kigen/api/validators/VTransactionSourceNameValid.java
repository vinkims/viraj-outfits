package ke.kigen.api.validators;

import org.springframework.stereotype.Component;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import ke.kigen.api.annotations.IsTransactionSourceNameValid;
import ke.kigen.api.services.payment.transaction_source.ITransactionSource;
import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class VTransactionSourceNameValid implements ConstraintValidator<IsTransactionSourceNameValid, String> {
    
    private final ITransactionSource sTransactionSource;

    @Override
    public boolean isValid(String value, ConstraintValidatorContext context) {
        return value == null ? true : !sTransactionSource.checkExistsByName(value);
    }
}
