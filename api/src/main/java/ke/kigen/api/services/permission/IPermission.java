package ke.kigen.api.services.permission;

import java.lang.reflect.InvocationTargetException;
import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.jpa.domain.Specification;

import ke.kigen.api.dtos.general.PageDTO;
import ke.kigen.api.dtos.permission.PermissionDTO;
import ke.kigen.api.models.permission.EPermission;

public interface IPermission {
    
    final List<String> ALLOWED_FIELDS = List.of(
        "createdOn",
        "name",
        "method",
        "updatedOn"
    );

    Specification<EPermission> buildFilterSpec(String searchQuery);

    Boolean checkExistsByName(String name);

    EPermission create(PermissionDTO permissionDTO);

    Optional<EPermission> getById(Integer permissionId);

    EPermission getById(Integer permissionId, Boolean handleNotFound);

    List<EPermission> getFilteredList(String searchQuery);

    Page<EPermission> getPaginatedList(PageDTO pageDTO);

    void save(EPermission permission);

    EPermission update(Integer permissionId, PermissionDTO permissionDTO) throws IllegalAccessException, 
        IllegalArgumentException, InvocationTargetException, NoSuchMethodException, SecurityException;
}
