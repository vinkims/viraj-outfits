package ke.kigen.api.dtos.role;

import ke.kigen.api.dtos.permission.PermissionDTO;
import ke.kigen.api.models.role.ERolePermission;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class RolePermissionDTO {
    
    private PermissionDTO permission;

    private Integer permissionId;

    public RolePermissionDTO(ERolePermission rolePermission) {
        setPermission(new PermissionDTO(rolePermission.getPermission()));
    }
}
