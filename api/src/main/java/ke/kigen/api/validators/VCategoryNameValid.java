package ke.kigen.api.validators;

import org.springframework.stereotype.Component;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import ke.kigen.api.annotations.IsCategoryNameValid;
import ke.kigen.api.services.category.SCategory;
import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class VCategoryNameValid implements ConstraintValidator<IsCategoryNameValid, String> {
    
    private final SCategory sCategory;

    @Override
    public boolean isValid(String value, ConstraintValidatorContext context) {
        return value == null ? true : !sCategory.checkExistsByName(value);
    }
    
}
