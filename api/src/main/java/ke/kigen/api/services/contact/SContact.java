package ke.kigen.api.services.contact;

import java.util.Optional;

import org.springframework.stereotype.Service;

import ke.kigen.api.dtos.contacts.ContactDTO;
import ke.kigen.api.exceptions.NotFoundException;
import ke.kigen.api.models.contacts.EContact;
import ke.kigen.api.models.contacts.EContactType;
import ke.kigen.api.models.user.EUser;
import ke.kigen.api.repositories.contacts.ContactDAO;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class SContact implements IContact {

    private final IContactType sContactType;

    private final ContactDAO contactDAO;

    @Override
    public Boolean checkExistsByValue(String value) {
        return contactDAO.existsByValue(value);
    }

    @Override
    public EContact create(EUser user, ContactDTO contactDTO) {
        EContact contact = new EContact();
        setContactType(contact, contactDTO.getContactTypeId());
        contact.setUser(user);
        contact.setValue(contactDTO.getValue());

        save(contact);
        return contact;
    }

    @Override
    public Optional<EContact> getByValue(String value) {
        return contactDAO.findByValue(value);
    }

    @Override
    public EContact getByValue(String value, Boolean handleNotFound) {

        Optional<EContact> contact = getByValue(value);
        if (!contact.isPresent() && handleNotFound) {
            throw new NotFoundException("contact with specified value not found", "contactValue");
        }
        return contact.get();
    }

    @Override
    public void save(EContact contact) {
        contactDAO.save(contact);
    }

    private void setContactType(EContact contact, Integer contactTypeId) {
        if (contactTypeId == null) { return; }

        EContactType contactType = sContactType.getById(contactTypeId, true);
        contact.setContactType(contactType);
    }
    
}
