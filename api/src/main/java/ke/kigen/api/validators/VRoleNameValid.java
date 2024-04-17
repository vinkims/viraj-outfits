package ke.kigen.api.validators;

import org.springframework.stereotype.Component;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import ke.kigen.api.annotations.IsRoleNameValid;
import ke.kigen.api.services.role.IRole;
import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class VRoleNameValid implements ConstraintValidator<IsRoleNameValid, String> {
    
    private final IRole sRole;

    @Override
    public boolean isValid(String value, ConstraintValidatorContext arg1) {
        return value == null ? true : !sRole.checkExistsByName(value);
    }
}
