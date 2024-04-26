package ke.kigen.api.validators;

import org.springframework.stereotype.Component;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import ke.kigen.api.annotations.IsPermissionNameValid;
import ke.kigen.api.services.permission.IPermission;
import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class VPermissionNameValid implements ConstraintValidator<IsPermissionNameValid, String> {
    
    private final IPermission sPermission;

    @Override
    public boolean isValid(String value, ConstraintValidatorContext context) {
        return value == null ? true : !sPermission.checkExistsByName(value);
    }
}
