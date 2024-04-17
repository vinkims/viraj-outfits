package ke.kigen.api.validators;

import org.springframework.stereotype.Component;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import ke.kigen.api.annotations.IsContactTypeNameValid;
import ke.kigen.api.services.contact.IContactType;
import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class VContactTypeNameValid implements ConstraintValidator<IsContactTypeNameValid, String> {
    
    private final IContactType sContactType;

    @Override
    public boolean isValid(String value, ConstraintValidatorContext context) {
        return value == null ? true : !sContactType.checkExistsByName(value);
    }
    
}
