package ke.kigen.api.services.contact;

import java.util.Optional;

import ke.kigen.api.dtos.contacts.ContactDTO;
import ke.kigen.api.models.contacts.EContact;
import ke.kigen.api.models.user.EUser;

public interface IContact {

    Boolean checkExistsByValue(String value);
    
    EContact create(EUser user, ContactDTO contactDTO);

    Optional<EContact> getByValue(String value);

    EContact getByValue(String value, Boolean handleNotFound);

    void save(EContact contact);
}
