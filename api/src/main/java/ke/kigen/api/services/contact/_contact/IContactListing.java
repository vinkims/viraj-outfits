package ke.kigen.api.services.contact._contact;

import java.util.Optional;

import ke.kigen.api.models.contacts.EContact;

public interface IContactListing {
    
    Boolean checkExistsByValue(String value);

    Optional<EContact> getByValue(String value);

    EContact getByValue(String value, Boolean handleNotFound);
}
