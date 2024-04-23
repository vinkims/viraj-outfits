package ke.kigen.api.services.status;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.jpa.domain.Specification;

import ke.kigen.api.dtos.general.PageDTO;
import ke.kigen.api.dtos.status.StatusDTO;
import ke.kigen.api.models.status.EStatus;

public interface IStatus {
    
    final List<String> ALLOWED_FIELDS = List.of();

    Specification<EStatus> buildFilterSpec(String searchQuery);

    Boolean checkExistsByName(String name);
    
    EStatus create(StatusDTO statusDTO);

    Optional<EStatus> getById(Integer statusId);

    EStatus getById(Integer statusId, Boolean handleNotFound);

    List<EStatus> getFilteredList(String searchQuery);

    Page<EStatus> getPaginatedList(PageDTO pageDTO);

    void save(EStatus status);

    EStatus update(Integer statusId, StatusDTO statusDTO);
}
