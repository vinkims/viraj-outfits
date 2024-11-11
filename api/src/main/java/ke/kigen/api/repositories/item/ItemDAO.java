package ke.kigen.api.repositories.item;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import ke.kigen.api.models.item.EItem;

public interface ItemDAO extends JpaRepository<EItem, Integer>, JpaSpecificationExecutor<EItem> {
    
    Boolean existsByItemCode(String itemCode);
}
