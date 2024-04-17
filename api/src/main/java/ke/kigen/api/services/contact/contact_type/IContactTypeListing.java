package ke.kigen.api.services.contact.contact_type;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.jpa.domain.Specification;

import ke.kigen.api.dtos.general.PageDTO;
import ke.kigen.api.models.contacts.EContactType;

public interface IContactTypeListing {
    
    final List<String> ALLOWED_FIELDS = List.of(
        "name"
    );

    Specification<EContactType> buildFilterSpec(String searchQuery);

    Boolean checkExistsByName(String name);

    Optional<EContactType> getById(Integer contactTypeId);

    EContactType getById(Integer contactTypeId, Boolean handleNotFound);

    List<EContactType> getFilteredList(String searchQuery);

    Page<EContactType> getPaginatedList(PageDTO pageDTO);
}
