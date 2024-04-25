package ke.kigen.api.repositories.order;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import ke.kigen.api.models.order.EOrder;

public interface OrderDAO extends JpaRepository<EOrder, Integer>, JpaSpecificationExecutor<EOrder> {
    
}
