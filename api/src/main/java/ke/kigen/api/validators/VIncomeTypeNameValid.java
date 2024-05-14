package ke.kigen.api.validators;

import org.springframework.stereotype.Component;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import ke.kigen.api.annotations.IsIncomeTypeNameValid;
import ke.kigen.api.services.income.IIncomeType;
import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class VIncomeTypeNameValid implements ConstraintValidator<IsIncomeTypeNameValid, String> {
    
    private final IIncomeType sIncomeType;

    @Override
    public boolean isValid(String value, ConstraintValidatorContext context) {
        return value == null ? true : !sIncomeType.checkExistsByName(value);
    }
}
