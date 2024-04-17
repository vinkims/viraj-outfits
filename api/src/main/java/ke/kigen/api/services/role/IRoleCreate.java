package ke.kigen.api.services.role;

import ke.kigen.api.dtos.role.RoleDTO;
import ke.kigen.api.models.role.ERole;

public interface IRoleCreate {
    
    ERole create(RoleDTO roleDTO);
}
