package ke.kigen.api.validators;

import org.springframework.stereotype.Component;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import ke.kigen.api.annotations.IsTransactionDuplicate;
import ke.kigen.api.services.payment.transaction.ITransaction;
import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class VTransactionDuplicate implements ConstraintValidator<IsTransactionDuplicate, String> {
    
    private final ITransaction sTransaction;

    @Override
    public boolean isValid(String value, ConstraintValidatorContext context) {
        return value == null ? true : !sTransaction.checkExistsByTransactionCode(value);
    }
}
