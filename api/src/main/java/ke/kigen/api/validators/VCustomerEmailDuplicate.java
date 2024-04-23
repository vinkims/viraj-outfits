package ke.kigen.api.validators;

import org.springframework.stereotype.Component;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import ke.kigen.api.annotations.IsCustomerEmailDuplicate;
import ke.kigen.api.services.customer.ICustomer;
import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class VCustomerEmailDuplicate implements ConstraintValidator<IsCustomerEmailDuplicate, String> {
    
    private final ICustomer sCustomer;

    @Override
    public boolean isValid(String value, ConstraintValidatorContext context) {
        return value == null ? true : !sCustomer.checkExistsByEmail(value);
    }
    
}
