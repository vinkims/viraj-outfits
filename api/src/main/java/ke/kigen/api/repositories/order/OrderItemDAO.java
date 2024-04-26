package ke.kigen.api.repositories.order;

import org.springframework.data.jpa.repository.JpaRepository;

import ke.kigen.api.models.order.EOrderItem;
import ke.kigen.api.models.order.PKOrderItem;

public interface OrderItemDAO extends JpaRepository<EOrderItem, PKOrderItem> {
    
}
