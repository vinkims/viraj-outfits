package ke.kigen.api.services.contact._contact;

import org.springframework.stereotype.Service;

import ke.kigen.api.dtos.contacts.ContactDTO;
import ke.kigen.api.models.contacts.EContact;
import ke.kigen.api.models.contacts.EContactType;
import ke.kigen.api.models.user.EUser;
import ke.kigen.api.services.contact.contact_type.SContactType;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class SContactCreate extends SBaseContact implements IContactCreate {

    private final SContactType sContactType;

    @Override
    public EContact create(EUser user, ContactDTO contactDTO) {
        EContact contact = new EContact();
        setContactType(contact, contactDTO.getContactTypeId());
        contact.setUser(user);
        contact.setValue(contactDTO.getValue());

        save(contact);
        return contact;
    }

    private void setContactType(EContact contact, Integer contactTypeId) {
        if (contactTypeId == null) { return; }

        EContactType contactType = sContactType.getById(contactTypeId, true);
        contact.setContactType(contactType);
    }
    
}
