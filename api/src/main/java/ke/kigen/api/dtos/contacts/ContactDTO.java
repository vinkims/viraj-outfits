package ke.kigen.api.dtos.contacts;

import ke.kigen.api.models.contacts.EContact;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class ContactDTO {
    
    private ContactTypeDTO contactType;

    private Integer contactTypeId;

    private String value;

    public ContactDTO(EContact contact) {
        setContactType(new ContactTypeDTO(contact.getContactType()));
        setValue(contact.getValue());
    }
}
