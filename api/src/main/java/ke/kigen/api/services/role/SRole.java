package ke.kigen.api.services.role;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import ke.kigen.api.dtos.general.PageDTO;
import ke.kigen.api.dtos.role.RoleDTO;
import ke.kigen.api.dtos.role.RolePermissionDTO;
import ke.kigen.api.exceptions.NotFoundException;
import ke.kigen.api.models.permission.EPermission;
import ke.kigen.api.models.role.ERole;
import ke.kigen.api.models.role.ERolePermission;
import ke.kigen.api.repositories.role.RoleDAO;
import ke.kigen.api.services.permission.IPermission;
import ke.kigen.api.specifications.SpecBuilder;
import ke.kigen.api.specifications.SpecFactory;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class SRole implements IRole {

    Logger logger = LoggerFactory.getLogger(SRole.class);

    private final IPermission sPermission;

    private final IRolePermission sRolePermission;

    private final RoleDAO roleDAO;

    private final SpecFactory specFactory;

    @Override
    public void addRolePermissions(Integer roleId, List<RolePermissionDTO> rolePermissions) {
        if (rolePermissions == null || rolePermissions.isEmpty()) { return; }

        ERole role = getById(roleId, true);

        for (RolePermissionDTO rolePermissionDTO : rolePermissions) {
            try {
                EPermission permission = sPermission.getById(rolePermissionDTO.getPermissionId(), true);
                sRolePermission.create(role, permission);
            } catch (Exception e) {
                logger.error("\n[LOCATION] - SRole.addRolePermissions\n[CLASS] {}\n[MSG] {}", 
                    e.getClass(), e.getMessage());
                continue;
            }
        }
    }
    
    @Override
    @SuppressWarnings("unchecked")
    public Specification<ERole> buildFilterSpec(String searchQuery) {
        
        SpecBuilder<ERole> specBuilder = new SpecBuilder<>();

        specBuilder = (SpecBuilder<ERole>) specFactory.generateSpecification(
            searchQuery, specBuilder, ALLOWED_FIELDS);

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
        setRolePermissions(role, roleDTO.getRolePermissions());
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
    public void removeRolePermission(Integer roleId, List<RolePermissionDTO> rolePermissions) {

        for (RolePermissionDTO rolePermissionDTO : rolePermissions) {
            try {
                sRolePermission.removeRolePermission(roleId, rolePermissionDTO.getPermissionId());
            } catch (Exception e) {
                logger.error("\n[LOCATION] - SRole.removeRolePermission\n[CLASS] {}\n[MSG] {}", 
                    e.getClass(), e.getMessage());
                continue;
            }
        }
    }

    @Override
    public void save(ERole role) {
        roleDAO.save(role);
    }

    private void setRolePermissions(ERole role, List<RolePermissionDTO> rolePermissions) {
        if (rolePermissions == null || rolePermissions.isEmpty()) { return; }

        List<ERolePermission> rolePermissionsList = new ArrayList<>();
        for (RolePermissionDTO rolePermissionDTO : rolePermissions) {
            EPermission permission = sPermission.getById(rolePermissionDTO.getPermissionId(), true);
            ERolePermission rolePermission = sRolePermission.create(role, permission);
            rolePermissionsList.add(rolePermission);
        }
        role.setRolePermissions(rolePermissionsList);
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
        setRolePermissions(role, roleDTO.getRolePermissions());

        save(role);
        return role;
    }
    
}
