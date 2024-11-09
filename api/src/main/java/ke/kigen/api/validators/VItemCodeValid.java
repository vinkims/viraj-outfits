package ke.kigen.api.validators;

import org.springframework.stereotype.Component;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import ke.kigen.api.annotations.IsItemCodeValid;
import ke.kigen.api.services.item.IItem;
import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class VItemCodeValid implements ConstraintValidator<IsItemCodeValid, String> {

    private final IItem sItem;

    @Override
    public boolean isValid(String value, ConstraintValidatorContext context) {
        return value == null ? true : !sItem.checkExistsByItemCode(value);
    }
    
}
