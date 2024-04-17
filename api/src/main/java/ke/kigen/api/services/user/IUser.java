package ke.kigen.api.services.user;

import java.lang.reflect.InvocationTargetException;
import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.jpa.domain.Specification;

import ke.kigen.api.dtos.general.PageDTO;
import ke.kigen.api.dtos.user.UserDTO;
import ke.kigen.api.models.user.EUser;

public interface IUser {
    
    final List<String> ALLOWED_FIELDS = List.of(
        "createdOn",
        "firstName",
        "lastActiveOn",
        "lastName",
        "middleName",
        "role.id",
        "role.name",
        "status.id",
        "status.name",
        "updatedOn"
    );

    Specification<EUser> buildFilterSpec(String searchQuery);

    EUser create(UserDTO userDTO);

    Optional<EUser> getById(Integer userId);

    EUser getById(Integer userId, Boolean handleNotFound);

    List<EUser> getFilteredList(String searchQuery);

    Page<EUser> getPaginatedList(PageDTO pageDTO);

    void save(EUser user);

    EUser update(Integer userId, UserDTO userDTO) throws IllegalAccessException, 
        IllegalArgumentException, InvocationTargetException, NoSuchMethodException, SecurityException;
}
