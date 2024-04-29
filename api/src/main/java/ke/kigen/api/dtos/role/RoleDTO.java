package ke.kigen.api.dtos.role;

import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonInclude.Include;

import ke.kigen.api.annotations.IsRoleNameValid;
import ke.kigen.api.models.role.ERole;
import ke.kigen.api.models.role.ERolePermission;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@JsonInclude(value = Include.NON_NULL)
public class RoleDTO {
    
    private Integer id;

    @IsRoleNameValid
    private String name;

    private String description;

    private List<RolePermissionDTO> rolePermissions;

    public RoleDTO(ERole role) {
        setDescription(role.getDescription());
        setId(role.getId());
        setName(role.getName());
        setRolePermissionData(role.getRolePermissions());
    }

    private void setRolePermissionData(List<ERolePermission> rolePermissionsList) {
        if (rolePermissionsList == null || rolePermissionsList.isEmpty()) { return; }

        rolePermissions = new ArrayList<>();
        for (ERolePermission rolePermission : rolePermissionsList) {
            rolePermissions.add(new RolePermissionDTO(rolePermission));
        }
    }
}
