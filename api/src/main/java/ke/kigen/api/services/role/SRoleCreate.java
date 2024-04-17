package ke.kigen.api.services.role;

import org.springframework.stereotype.Service;

import ke.kigen.api.dtos.role.RoleDTO;
import ke.kigen.api.models.role.ERole;

@Service
public class SRoleCreate extends SBaseRole implements IRoleCreate {

    @Override
    public ERole create(RoleDTO roleDTO) {
        ERole role = new ERole();
        role.setDescription(roleDTO.getDescription());
        role.setName(roleDTO.getName());

        save(role);
        return role;
    }
    
}
