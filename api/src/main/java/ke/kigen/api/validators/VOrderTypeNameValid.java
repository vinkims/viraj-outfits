package ke.kigen.api.validators;

import org.springframework.stereotype.Component;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import ke.kigen.api.annotations.IsOrderTypeNameValid;
import ke.kigen.api.services.order.IOrderType;
import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class VOrderTypeNameValid implements ConstraintValidator<IsOrderTypeNameValid, String> {
    
    private final IOrderType sOrderType;

    @Override
    public boolean isValid(String value, ConstraintValidatorContext context) {
        return value == null ? true : !sOrderType.checkExistsByName(value);
    }
}
