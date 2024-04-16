package ke.kigen.api.repositories.status;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import ke.kigen.api.models.status.EStatus;

public interface StatusDAO extends JpaRepository<EStatus, Integer>, JpaSpecificationExecutor<EStatus> {
    
    Boolean existsByName(String name);
}
