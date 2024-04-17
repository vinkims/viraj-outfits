package ke.kigen.api.services.role;

import ke.kigen.api.dtos.role.RoleDTO;
import ke.kigen.api.models.role.ERole;

public interface IRoleUpdate {
    
    ERole update(Integer roleId, RoleDTO roleDTO);
}
