package ke.kigen.api.services.role;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import ke.kigen.api.dtos.general.PageDTO;
import ke.kigen.api.dtos.role.RoleDTO;
import ke.kigen.api.models.role.ERole;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class SRole implements IRoleCreate, IRoleListing, IRoleUpdate {

    private final IRoleCreate sRoleCreate;

    private final IRoleListing sRoleListing;

    private final IRoleUpdate sRoleUpdate;
    
    @Override
    public Specification<ERole> buildFilterSpec(String searchQuery) {
        return sRoleListing.buildFilterSpec(searchQuery);
    }

    @Override
    public Boolean checkExistsByName(String name) {
        return sRoleListing.checkExistsByName(name);
    }

    @Override
    public ERole create(RoleDTO roleDTO) {
        return sRoleCreate.create(roleDTO);
    }

    @Override
    public Optional<ERole> getById(Integer roleId) {
        return sRoleListing.getById(roleId);
    }

    @Override
    public ERole getById(Integer roleId, Boolean handleNotFound) {
        return sRoleListing.getById(roleId, handleNotFound);
    }

    @Override
    public List<ERole> getFilteredList(String searchQuery) {
        return sRoleListing.getFilteredList(searchQuery);
    }

    @Override
    public Page<ERole> getPaginatedList(PageDTO pageDTO) {
        return sRoleListing.getPaginatedList(pageDTO);
    }

    @Override
    public ERole update(Integer roleId, RoleDTO roleDTO) {
        return sRoleUpdate.update(roleId, roleDTO);
    }
    
}
