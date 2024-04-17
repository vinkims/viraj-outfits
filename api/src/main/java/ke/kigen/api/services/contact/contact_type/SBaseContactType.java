package ke.kigen.api.services.contact.contact_type;

import java.util.Optional;

import org.springframework.stereotype.Service;

import ke.kigen.api.exceptions.NotFoundException;
import ke.kigen.api.models.contacts.EContactType;
import ke.kigen.api.repositories.contacts.ContactTypeDAO;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class SBaseContactType {
    
    protected final ContactTypeDAO contactTypeDAO;

    public SBaseContactType() {
        this.contactTypeDAO = null;
    }

    protected Optional<EContactType> getById(Integer contactTypeId) {
        return contactTypeDAO.findById(contactTypeId);
    }

    protected EContactType getById(Integer contactTypeId, Boolean handleNotFound) {

        Optional<EContactType> contactType = getById(contactTypeId);
        if (!contactType.isPresent() && handleNotFound) {
            throw new NotFoundException("contact type with specified id not found", "contactTypeId");
        }
        return contactType.get();
    }

    protected void save(EContactType contactType) {
        contactTypeDAO.save(contactType);
    }
}
