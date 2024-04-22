package ke.kigen.api.validators;

import org.springframework.stereotype.Component;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import ke.kigen.api.annotations.IsCustomerMobileDuplicate;
import ke.kigen.api.services.customer.SCustomer;
import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class VCustomerMobileDuplicate implements ConstraintValidator<IsCustomerMobileDuplicate, String> {
    
    private final SCustomer sCustomer;
    @Override
    public boolean isValid(String value, ConstraintValidatorContext context) {
        return value == null ? true : !sCustomer.checkExistsByMobileNumber(value);
    }
    
}
