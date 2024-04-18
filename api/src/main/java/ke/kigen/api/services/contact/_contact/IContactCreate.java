package ke.kigen.api.services.contact._contact;

import ke.kigen.api.dtos.contacts.ContactDTO;
import ke.kigen.api.models.contacts.EContact;
import ke.kigen.api.models.user.EUser;

public interface IContactCreate {
    
    EContact create(EUser user, ContactDTO contactDTO);
}
