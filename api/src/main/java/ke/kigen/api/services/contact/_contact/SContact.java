package ke.kigen.api.services.contact._contact;

import java.util.Optional;

import org.springframework.stereotype.Service;

import ke.kigen.api.dtos.contacts.ContactDTO;
import ke.kigen.api.models.contacts.EContact;
import ke.kigen.api.models.user.EUser;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class SContact implements IContactCreate, IContactListing {
    
    private final IContactCreate sContactCreate;

    private final IContactListing sContactListing;

    @Override
    public Boolean checkExistsByValue(String value) {
        return sContactListing.checkExistsByValue(value);
    }

    @Override
    public EContact create(EUser user, ContactDTO contactDTO) {
        return sContactCreate.create(user, contactDTO);
    }

    @Override
    public Optional<EContact> getByValue(String value) {
        return sContactListing.getByValue(value);
    }

    @Override
    public EContact getByValue(String value, Boolean handleNotFound) {
        return sContactListing.getByValue(value, handleNotFound);
    }
}
