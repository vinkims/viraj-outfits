package ke.kigen.api.validators;

import org.springframework.stereotype.Component;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import ke.kigen.api.annotations.IsSaleTypeNameValid;
import ke.kigen.api.services.sales.ISaleType;
import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class VSaleTypeNameValid implements ConstraintValidator<IsSaleTypeNameValid, String> {
    
    private final ISaleType sSaleType;

    @Override
    public boolean isValid(String value, ConstraintValidatorContext context) {
        return value == null ? true : !sSaleType.checkExistsByName(value);
    }
    
}
