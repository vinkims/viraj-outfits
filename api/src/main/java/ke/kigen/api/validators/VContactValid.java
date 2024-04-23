package ke.kigen.api.validators;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.springframework.stereotype.Component;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import ke.kigen.api.annotations.IsContactValid;
import ke.kigen.api.configs.properties.MainConfig;
import ke.kigen.api.configs.properties.contact.ContactConfig;
import ke.kigen.api.dtos.contacts.ContactDTO;
import ke.kigen.api.models.contacts.EContactType;
import ke.kigen.api.services.contact.IContact;
import ke.kigen.api.services.contact.IContactType;
import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class VContactValid implements ConstraintValidator<IsContactValid, ContactDTO> {

    private final IContact sContact;

    private final IContactType sContactType;

    private final MainConfig mainConfig;

    private String defaultMessage;

    @Override
    public void initialize(final IsContactValid isContactValidAnnotation) {
        defaultMessage = isContactValidAnnotation.message();
    }

    @Override
    public boolean isValid(ContactDTO contactDTO, ConstraintValidatorContext context) {

        Boolean isContactValid;
        String message = "";
        Pattern pattern = Pattern.compile("\\w*");

        ContactConfig contactConfig = mainConfig.getContact();

        EContactType contactType = sContactType.getById(contactDTO.getContactTypeId(), true);
        String regexValue = contactType.getRegexValue();

        context.disableDefaultConstraintViolation();

        if (contactDTO.getContactTypeId().equals(contactConfig.getMobileTypeId())) {
            pattern = Pattern.compile(regexValue);
            message = "Invalid mobile number; value must be 12 digits including country code";
        } else if (contactDTO.getContactTypeId().equals(contactConfig.getEmailTypeId())) {
            pattern = Pattern.compile(regexValue);
            message = "Invalid email address; value provided must have standard format";
        }

        Matcher matcher = pattern.matcher(contactDTO.getValue());
        isContactValid = matcher.find();
        message = isContactValid ? defaultMessage : message;

        context.buildConstraintViolationWithTemplate(message).addConstraintViolation();

        return isContactValid && !sContact.checkExistsByValue(contactDTO.getValue().trim());
    }
    
}
