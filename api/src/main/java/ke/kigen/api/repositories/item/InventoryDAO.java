package ke.kigen.api.repositories.item;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import ke.kigen.api.models.item.EInventory;

public interface InventoryDAO extends JpaRepository<EInventory, Integer>, JpaSpecificationExecutor<EInventory> {
    
}
