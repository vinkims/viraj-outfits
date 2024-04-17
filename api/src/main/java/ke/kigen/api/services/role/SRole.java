package ke.kigen.api.services.role;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import ke.kigen.api.dtos.general.PageDTO;
import ke.kigen.api.dtos.role.RoleDTO;
import ke.kigen.api.exceptions.NotFoundException;
import ke.kigen.api.models.role.ERole;
import ke.kigen.api.repositories.role.RoleDAO;
import ke.kigen.api.specifications.SpecBuilder;
import ke.kigen.api.specifications.SpecFactory;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class SRole implements IRole {

    private final RoleDAO roleDAO;

    private final SpecFactory specFactory;
    
    @Override
    public Specification<ERole> buildFilterSpec(String searchQuery) {

        SpecBuilder<ERole> specBuilder = new SpecBuilder();

        specBuilder = (SpecBuilder<ERole>) specFactory.generateSpecification(searchQuery, specBuilder, ALLOWED_FIELDS);

        return specBuilder.build();
    }

    @Override
    public Boolean checkExistsByName(String name) {
        return roleDAO.existsByName(name);
    }

    @Override
    public ERole create(RoleDTO roleDTO) {
        ERole role = new ERole();
        role.setDescription(roleDTO.getDescription());
        role.setName(roleDTO.getName());

        save(role);
        return role;
    }

    @Override
    public Optional<ERole> getById(Integer roleId) {
        return roleDAO.findById(roleId);
    }

    @Override
    public ERole getById(Integer roleId, Boolean handleNotFound) {

        Optional<ERole> role = getById(roleId);
        if (!role.isPresent() && handleNotFound) {
            throw new NotFoundException("role with specified id not found", "roleId");
        }
        return role.get();
    }

    @Override
    public List<ERole> getFilteredList(String searchQuery) {
        return roleDAO.findAll(buildFilterSpec(searchQuery));
    }

    @Override
    public Page<ERole> getPaginatedList(PageDTO pageDTO) {

        String search = pageDTO.getSearch();

        PageRequest pageRequest = PageRequest.of(pageDTO.getPageNumber(), pageDTO.getPageSize(), 
            Sort.by(pageDTO.getDirection(), pageDTO.getSortVal()));

        return roleDAO.findAll(buildFilterSpec(search), pageRequest);
    }

    @Override
    public void save(ERole role) {
        roleDAO.save(role);
    }

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
