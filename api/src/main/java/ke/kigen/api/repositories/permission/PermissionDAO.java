package ke.kigen.api.repositories.permission;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import ke.kigen.api.models.permission.EPermission;

public interface PermissionDAO extends JpaRepository<EPermission, Integer>, JpaSpecificationExecutor<EPermission> {
    
    Boolean existsByName(String name);
}
