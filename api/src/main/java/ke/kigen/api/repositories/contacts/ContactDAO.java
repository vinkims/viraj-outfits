package ke.kigen.api.repositories.contacts;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import ke.kigen.api.models.contacts.EContact;

public interface ContactDAO extends JpaRepository<EContact, String> {
    
    Boolean existsByValue(String value);

    Optional<EContact> findByValue(String value);
}
