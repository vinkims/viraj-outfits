package ke.kigen.api.repositories.Status;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import ke.kigen.api.models.Status.EStatus;

public interface StatusDAO extends JpaRepository<EStatus, Integer>, JpaSpecificationExecutor<EStatus> {
    
    Boolean existsByName(String name);
}
