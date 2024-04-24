package ke.kigen.api.dtos.contacts;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonInclude.Include;

import ke.kigen.api.annotations.IsContactValid;
import ke.kigen.api.models.contacts.EContact;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@IsContactValid
@JsonInclude(value = Include.NON_NULL)
public class ContactDTO {
    
    @JsonIgnoreProperties(value = {"description", "regexValue"})
    private ContactTypeDTO contactType;

    private Integer contactTypeId;

    private String value;

    public ContactDTO(EContact contact) {
        setContactType(new ContactTypeDTO(contact.getContactType()));
        setValue(contact.getValue());
    }
}
