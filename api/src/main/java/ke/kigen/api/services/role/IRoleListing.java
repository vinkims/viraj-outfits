package ke.kigen.api.services.role;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.jpa.domain.Specification;

import ke.kigen.api.dtos.general.PageDTO;
import ke.kigen.api.models.role.ERole;

public interface IRoleListing {
    
    final List<String> ALLOWED_FIELDS = List.of();

    Specification<ERole> buildFilterSpec(String searchQuery);

    Boolean checkExistsByName(String name);

    Optional<ERole> getById(Integer roleId);

    ERole getById(Integer roleId, Boolean handleNotFound);

    List<ERole> getFilteredList(String searchQuery);

    Page<ERole> getPaginatedList(PageDTO pageDTO);
}
