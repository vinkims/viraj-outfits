package ke.kigen.api.validators;

import org.springframework.stereotype.Component;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import ke.kigen.api.annotations.IsItemTypeNameValid;
import ke.kigen.api.services.item.IItemType;
import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class VItemTypeNameValid implements ConstraintValidator<IsItemTypeNameValid, String> {

    private final IItemType sItemType;

    @Override
    public boolean isValid(String value, ConstraintValidatorContext context) {
        return value == null ? true : !sItemType.checkExistsByName(value);
    }
    
}
