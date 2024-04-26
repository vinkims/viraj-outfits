package ke.kigen.api.repositories.role;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import ke.kigen.api.models.role.ERolePermission;
import ke.kigen.api.models.role.PKRolePermission;

public interface RolePermissionDAO extends JpaRepository<ERolePermission, PKRolePermission> {
    
    Optional<ERolePermission> findByRoleIdAndPermissionId(Integer roleId, Integer permissionId);
}
