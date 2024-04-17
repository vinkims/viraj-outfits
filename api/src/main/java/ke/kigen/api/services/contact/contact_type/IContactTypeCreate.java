package ke.kigen.api.services.contact.contact_type;

import ke.kigen.api.dtos.contacts.ContactTypeDTO;
import ke.kigen.api.models.contacts.EContactType;

public interface IContactTypeCreate {
    
    EContactType create(ContactTypeDTO contactTypeDTO);
}
