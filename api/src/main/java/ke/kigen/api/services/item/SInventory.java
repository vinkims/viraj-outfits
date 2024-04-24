package ke.kigen.api.services.item;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import ke.kigen.api.dtos.general.PageDTO;
import ke.kigen.api.dtos.item.InventoryDTO;
import ke.kigen.api.exceptions.NotFoundException;
import ke.kigen.api.models.item.EInventory;
import ke.kigen.api.models.item.EItem;
import ke.kigen.api.repositories.item.InventoryDAO;
import ke.kigen.api.specifications.SpecBuilder;
import ke.kigen.api.specifications.SpecFactory;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class SInventory implements IInventory {

    private final IItem sItem;

    private final InventoryDAO inventoryDAO;

    private final SpecFactory specFactory;
    
    @Override
    @SuppressWarnings("unchecked")
    public Specification<EInventory> buildFilterSpec(String searchQuery) {

        SpecBuilder<EInventory> specBuilder = new SpecBuilder<>();

        specBuilder = (SpecBuilder<EInventory>) specFactory.generateSpecification(
            searchQuery, specBuilder, ALLOWED_FIELDS);

        return specBuilder.build();
    }

    @Override
    public EInventory create(InventoryDTO inventoryDTO) {
        EInventory inventory = new EInventory();
        inventory.setCreatedOn(LocalDateTime.now());
        setItem(inventory, inventoryDTO.getItemId());
        inventory.setQuantity(inventoryDTO.getQuantity());
        
        save(inventory);
        return inventory;
    }

    @Override
    public Optional<EInventory> getById(Integer inventoryId) {
        return inventoryDAO.findById(inventoryId);
    }

    @Override
    public EInventory getById(Integer inventoryId, Boolean handleNotFound) {

        Optional<EInventory> inventory = getById(inventoryId);
        if (inventory.isPresent() && handleNotFound) {
            throw new NotFoundException("inventory with specified id not found", "inventoryId");
        }
        return inventory.get();
    }

    @Override
    public List<EInventory> getFilteredList(String searchQuery) {
        return inventoryDAO.findAll(buildFilterSpec(searchQuery));
    }

    @Override
    public Page<EInventory> getPaginatedList(PageDTO pageDTO) {

        String search = pageDTO.getSearch();

        PageRequest pageRequest = PageRequest.of(pageDTO.getPageNumber(), pageDTO.getPageSize(), 
            Sort.by(pageDTO.getDirection(), pageDTO.getSortVal()));

        return inventoryDAO.findAll(buildFilterSpec(search), pageRequest);
    }

    @Override
    public void save(EInventory inventory) {
        inventoryDAO.save(inventory);
    }

    private void setItem(EInventory inventory, Integer itemId) {
        if (itemId == null) { return; }

        EItem item = sItem.getById(itemId, true);
        inventory.setItem(item);
    }

    @Override
    public EInventory update(Integer inventoryId, InventoryDTO inventoryDTO) {
        EInventory inventory = getById(inventoryId, true);
        setItem(inventory, inventoryDTO.getItemId());
        if (inventoryDTO.getQuantity() != null) {
            inventory.setQuantity(inventoryDTO.getQuantity());
        }
        inventory.setUpdatedOn(LocalDateTime.now());

        save(inventory);
        return inventory;
    }
    
}
