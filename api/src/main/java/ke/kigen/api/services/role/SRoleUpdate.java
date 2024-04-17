package ke.kigen.api.services.role;

import org.springframework.stereotype.Service;

import ke.kigen.api.dtos.role.RoleDTO;
import ke.kigen.api.models.role.ERole;

@Service
public class SRoleUpdate extends SBaseRole implements IRoleUpdate {

    @Override
    public ERole update(Integer roleId, RoleDTO roleDTO) {
        ERole role = getById(roleId, true);
        if (roleDTO.getDescription() != null) {
            role.setDescription(roleDTO.getDescription());
        }
        if (roleDTO.getName() != null) {
            role.setName(roleDTO.getName());
        }

        save(role);
        return role;
    }
    
}
