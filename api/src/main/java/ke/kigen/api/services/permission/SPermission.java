package ke.kigen.api.services.permission;

import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import ke.kigen.api.dtos.general.PageDTO;
import ke.kigen.api.dtos.permission.PermissionDTO;
import ke.kigen.api.exceptions.NotFoundException;
import ke.kigen.api.models.permission.EPermission;
import ke.kigen.api.repositories.permission.PermissionDAO;
import ke.kigen.api.specifications.SpecBuilder;
import ke.kigen.api.specifications.SpecFactory;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class SPermission implements IPermission {
    
    private final PermissionDAO permissionDAO;

    private final SpecFactory specFactory;

    @Override
    @SuppressWarnings("unchecked")
    public Specification<EPermission> buildFilterSpec(String searchQuery) {

        SpecBuilder<EPermission> specBuilder = new SpecBuilder<>();

        specBuilder = (SpecBuilder<EPermission>) specFactory.generateSpecification(
            searchQuery, specBuilder, ALLOWED_FIELDS);

        return specBuilder.build();
    }

    @Override
    public Boolean checkExistsByName(String name) {
        return permissionDAO.existsByName(name);
    }

    @Override
    public EPermission create(PermissionDTO permissionDTO) {
        EPermission permission = new EPermission();
        permission.setCreatedOn(LocalDateTime.now());
        permission.setMethod(permissionDTO.getMethod());
        permission.setName(permission.getName());
        permission.setResource(permissionDTO.getResource());

        save(permission);
        return permission;
    }

    @Override
    public Optional<EPermission> getById(Integer permissionId) {
        return permissionDAO.findById(permissionId);
    }

    @Override
    public EPermission getById(Integer permissionId, Boolean handleNotFound) {

        Optional<EPermission> permission = getById(permissionId);
        if (!permission.isPresent() && handleNotFound) {
            throw new NotFoundException("permission with specified id not found", "permissionId");
        }
        return permission.get();
    }

    @Override
    public List<EPermission> getFilteredList(String searchQuery) {
        return permissionDAO.findAll(buildFilterSpec(searchQuery));
    }

    @Override
    public Page<EPermission> getPaginatedList(PageDTO pageDTO) {

        String search = pageDTO.getSearch();

        PageRequest pageRequest = PageRequest.of(pageDTO.getPageNumber(), pageDTO.getPageSize(), 
            Sort.by(pageDTO.getDirection(), pageDTO.getSortVal()));

        return permissionDAO.findAll(buildFilterSpec(search), pageRequest);
    }

    @Override
    public void save(EPermission permission) {
        permissionDAO.save(permission);
    }

    @Override
    public EPermission update(Integer permissionId, PermissionDTO permissionDTO) throws IllegalAccessException, 
            IllegalArgumentException, InvocationTargetException, NoSuchMethodException, SecurityException {
        
        EPermission permission = getById(permissionId, true);

        String[] fields = {"Name", "Method", "Resource"};
        for (String field : fields) {
            Method getField = PermissionDTO.class.getMethod(String.format("get%s", field));
            Object fieldValue = getField.invoke(permissionDTO);

            if (fieldValue != null) {
                fieldValue = fieldValue.getClass().equals(String.class) ? ((String) fieldValue).trim() : fieldValue;
                EPermission.class.getMethod("set" + field, fieldValue.getClass()).invoke(permission, fieldValue);
            }
        }
        permission.setUpdatedOn(LocalDateTime.now());

        save(permission);
        return permission;
    }
    
}
