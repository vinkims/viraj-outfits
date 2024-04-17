package ke.kigen.api.services.role;

import java.util.Optional;

import org.springframework.stereotype.Service;

import ke.kigen.api.exceptions.NotFoundException;
import ke.kigen.api.models.role.ERole;
import ke.kigen.api.repositories.role.RoleDAO;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class SBaseRole {
    
    protected final RoleDAO roleDAO;

    public SBaseRole() {
        this.roleDAO = null;
    }

    protected Optional<ERole> getById(Integer roleId) {
        return roleDAO.findById(roleId);
    }

    protected ERole getById(Integer roleId, Boolean handleNotFound) {

        Optional<ERole> role = getById(roleId);
        if (!role.isPresent() && handleNotFound) {
            throw new NotFoundException("role with specified id not found", "roleId");
        }
        return role.get();
    }

    protected void save(ERole role) {
        roleDAO.save(role);
    }
}
