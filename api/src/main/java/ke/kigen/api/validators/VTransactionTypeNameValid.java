package ke.kigen.api.validators;

import org.springframework.stereotype.Component;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import ke.kigen.api.annotations.IsTransactionTypeNameValid;
import ke.kigen.api.services.payment.transaction_type.ITransactionType;
import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class VTransactionTypeNameValid implements ConstraintValidator<IsTransactionTypeNameValid, String> {
    
    private final ITransactionType sTransactionType;

    @Override
    public boolean isValid(String value, ConstraintValidatorContext context) {
        return value == null ? true : !sTransactionType.checkExistsByName(value);
    }
}
