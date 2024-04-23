package ke.kigen.api.services.item;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.jpa.domain.Specification;

import ke.kigen.api.dtos.general.PageDTO;
import ke.kigen.api.dtos.item.ItemTypeDTO;
import ke.kigen.api.models.item.EItemType;

public interface IItemType {
    
    final List<String> ALLOWED_FIELDS = List.of(
        "createdOn",
        "name",
        "status.id",
        "status.name",
        "updatedOn"
    );

    Specification<EItemType> buildFilterSpec(String searchQuery);

    Boolean checkExistsByName(String name);

    EItemType create(ItemTypeDTO itemTypeDTO);

    Optional<EItemType> getById(Integer itemTypeId);

    EItemType getById(Integer itemTypeId, Boolean handleNotFound);

    List<EItemType> getFilteredList(String searchQuery);

    Page<EItemType> getPaginatedList(PageDTO pageDTO);

    void save(EItemType itemType);

    EItemType update(Integer itemTypeId, ItemTypeDTO itemTypeDTO);
}
