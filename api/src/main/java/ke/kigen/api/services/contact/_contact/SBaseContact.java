package ke.kigen.api.services.contact._contact;

import java.util.Optional;

import org.springframework.stereotype.Service;

import ke.kigen.api.exceptions.NotFoundException;
import ke.kigen.api.models.contacts.EContact;
import ke.kigen.api.repositories.contacts.ContactDAO;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class SBaseContact {
    
    protected final ContactDAO contactDAO;

    public SBaseContact() {
        this.contactDAO = null;
    }

    protected Optional<EContact> getByValue(String value) {
        return contactDAO.findByValue(value);
    }

    protected EContact getByValue(String value, Boolean handleNotFound) {

        Optional<EContact> contact = getByValue(value);
        if (!contact.isPresent() && handleNotFound) {
            throw new NotFoundException("contact with specified value not found", "contactValue");
        }
        return contact.get();
    }

    protected void save(EContact contact) {
        contactDAO.save(contact);
    }
}
