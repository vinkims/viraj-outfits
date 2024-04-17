package ke.kigen.api.repositories.contacts;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import ke.kigen.api.models.contacts.EContactType;

public interface ContactTypeDAO extends JpaRepository<EContactType, Integer>, JpaSpecificationExecutor<EContactType> {
    
    Boolean existsByName(String name);
}
