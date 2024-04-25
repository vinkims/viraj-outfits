package ke.kigen.api.repositories.order;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import ke.kigen.api.models.order.EOrderType;

public interface OrderTypeDAO extends JpaRepository<EOrderType, Integer>, JpaSpecificationExecutor<EOrderType> {
    
    Boolean existsByName(String name);
}
