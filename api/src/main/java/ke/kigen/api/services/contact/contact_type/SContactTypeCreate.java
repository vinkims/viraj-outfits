package ke.kigen.api.services.contact.contact_type;

import org.springframework.stereotype.Service;

import ke.kigen.api.dtos.contacts.ContactTypeDTO;
import ke.kigen.api.models.contacts.EContactType;

@Service
public class SContactTypeCreate extends SBaseContactType implements IContactTypeCreate {

    @Override
    public EContactType create(ContactTypeDTO contactTypeDTO) {
        EContactType contactType = new EContactType();
        contactType.setDescription(contactTypeDTO.getDescription());
        contactType.setName(contactTypeDTO.getName());
        contactType.setRegexValue(contactTypeDTO.getRegexValue());

        save(contactType);
        return contactType;
    }
    
}
