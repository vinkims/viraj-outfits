package ke.kigen.api.repositories.item;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import ke.kigen.api.models.item.EItemType;

public interface ItemTypeDAO extends JpaRepository<EItemType, Integer>, JpaSpecificationExecutor<EItemType> {
    
    Boolean existsByName(String name);
}
