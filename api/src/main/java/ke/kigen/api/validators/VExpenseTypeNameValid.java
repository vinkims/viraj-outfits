package ke.kigen.api.validators;

import org.springframework.stereotype.Component;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import ke.kigen.api.annotations.IsExpenseTypeNameValid;
import ke.kigen.api.services.expense.IExpenseType;
import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class VExpenseTypeNameValid implements ConstraintValidator<IsExpenseTypeNameValid, String> {
    
    private final IExpenseType sExpenseType;

    @Override
    public boolean isValid(String value, ConstraintValidatorContext context) {
        return value == null ? true : !sExpenseType.checkExistsByName(value);
    }

    
}
