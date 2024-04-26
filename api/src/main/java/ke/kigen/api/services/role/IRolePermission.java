package ke.kigen.api.services.role;

import java.util.Optional;

import ke.kigen.api.models.permission.EPermission;
import ke.kigen.api.models.role.ERole;
import ke.kigen.api.models.role.ERolePermission;

public interface IRolePermission {
    
    ERolePermission create(ERole role, EPermission permission);

    Optional<ERolePermission> getByRoleAndPermission(Integer roleId, Integer permissionId);

    ERolePermission getByRoleAndPermission(Integer roleId, Integer permissionId, Boolean handleNotFound);

    void removeRolePermission(Integer roleId, Integer permissionId);

    void save(ERolePermission rolePermission);
}
