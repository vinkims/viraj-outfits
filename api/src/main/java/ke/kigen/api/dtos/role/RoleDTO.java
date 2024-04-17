package ke.kigen.api.dtos.role;

import ke.kigen.api.annotations.IsRoleNameValid;
import ke.kigen.api.models.role.ERole;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class RoleDTO {
    
    private Integer id;

    @IsRoleNameValid
    private String name;

    private String description;

    public RoleDTO(ERole role) {
        setDescription(role.getDescription());
        setId(role.getId());
        setName(role.getName());
    }
}
