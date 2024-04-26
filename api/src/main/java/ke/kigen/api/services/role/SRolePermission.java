package ke.kigen.api.services.role;

import java.util.Optional;

import org.springframework.stereotype.Service;

import ke.kigen.api.exceptions.NotFoundException;
import ke.kigen.api.models.permission.EPermission;
import ke.kigen.api.models.role.ERole;
import ke.kigen.api.models.role.ERolePermission;
import ke.kigen.api.repositories.role.RolePermissionDAO;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class SRolePermission implements IRolePermission {

    private final RolePermissionDAO rolePermissionDAO;

    @Override
    public ERolePermission create(ERole role, EPermission permission) {
        ERolePermission rolePermission = new ERolePermission(role, permission);
        save(rolePermission);
        return rolePermission;
    }

    @Override
    public Optional<ERolePermission> getByRoleAndPermission(Integer roleId, Integer permissionId) {
        return rolePermissionDAO.findByRoleIdAndPermissionId(roleId, permissionId);
    }

    @Override
    public ERolePermission getByRoleAndPermission(Integer roleId, Integer permissionId, Boolean handleNotFound) {

        Optional<ERolePermission> rolePermission = getByRoleAndPermission(roleId, permissionId);
        if (!rolePermission.isPresent() && handleNotFound) {
            throw new NotFoundException("role permission with specified role id and permission id not found", 
                "rolePermission");
        }
        return rolePermission.get();
    }

    @Override
    public void removeRolePermission(Integer roleId, Integer permissionId) {
        
        ERolePermission rolePermission = getByRoleAndPermission(roleId, permissionId, true);
        rolePermissionDAO.delete(rolePermission);
    }

    @Override
    public void save(ERolePermission rolePermission) {
        rolePermissionDAO.save(rolePermission);
    }
    
}
