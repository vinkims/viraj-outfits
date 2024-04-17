package ke.kigen.api.validators;

import org.springframework.stereotype.Component;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import ke.kigen.api.annotations.IsStatusNameValid;
import ke.kigen.api.services.status.IStatus;
import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class VStatusNameValid implements ConstraintValidator<IsStatusNameValid, String> {
    
    private final IStatus sStatus;

    @Override
    public boolean isValid(String value, ConstraintValidatorContext arg1) {
        return value == null ? true : !sStatus.checkExistsByName(value);
    }
}
