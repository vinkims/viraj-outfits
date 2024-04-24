package ke.kigen.api.services.item;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.jpa.domain.Specification;

import ke.kigen.api.dtos.general.PageDTO;
import ke.kigen.api.dtos.item.InventoryDTO;
import ke.kigen.api.models.item.EInventory;

public interface IInventory {
    
    final List<String> ALLOWED_FIELDS = List.of(
        "createdOn",
        "item.id",
        "item.name",
        "quantity",
        "updatedOn"
    );

    Specification<EInventory> buildFilterSpec(String searchQuery);

    EInventory create(InventoryDTO inventoryDTO);

    Optional<EInventory> getById(Integer inventoryId);

    EInventory getById(Integer inventoryId, Boolean handleNotFound);

    List<EInventory> getFilteredList(String searchQuery);

    Page<EInventory> getPaginatedList(PageDTO pageDTO);

    void save(EInventory inventory);

    EInventory update(Integer inventoryId, InventoryDTO inventoryDTO);
}
