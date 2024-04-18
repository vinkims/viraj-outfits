package ke.kigen.api.services.contact._contact;

import java.util.Optional;

import org.springframework.stereotype.Service;

import ke.kigen.api.models.contacts.EContact;

@Service
public class SContactListing extends SBaseContact implements IContactListing {

    @Override
    public Boolean checkExistsByValue(String value) {
        return contactDAO.existsByValue(value);
    }

    @Override
    public Optional<EContact> getByValue(String value) {
        return super.getByValue(value);
    }

    @Override
    public EContact getByValue(String value, Boolean handleNotFound) {
        return super.getByValue(value, handleNotFound);
    }
    
}
