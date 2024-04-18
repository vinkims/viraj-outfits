package ke.kigen.api.services.user;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.jpa.domain.Specification;

import ke.kigen.api.dtos.general.PageDTO;
import ke.kigen.api.models.user.EUser;

public interface IUserListing {
    
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

    Optional<EUser> getByContactValue(String contactValue);

    Optional<EUser> getById(Integer userId);

    EUser getById(Integer userId, Boolean handleNotFound);

    Optional<EUser> getByIdOrContactValue(String userValue);

    EUser getByIdOrContactValue(String userValue, Boolean handleNotFound);

    List<EUser> getFilteredList(String searchQuery);

    Page<EUser> getPaginatedList(PageDTO pageDTO);
}
