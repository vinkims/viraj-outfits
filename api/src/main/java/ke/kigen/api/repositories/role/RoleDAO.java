package ke.kigen.api.repositories.role;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import ke.kigen.api.models.role.ERole;

public interface RoleDAO extends JpaRepository<ERole, Integer>, JpaSpecificationExecutor<ERole> {
    
    Boolean existsByName(String name);
}
