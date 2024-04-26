package ke.kigen.api.services.order;

import ke.kigen.api.dtos.order.OrderItemDTO;
import ke.kigen.api.models.order.EOrder;
import ke.kigen.api.models.order.EOrderItem;

public interface IOrderItem {
    
    EOrderItem create(EOrder order, OrderItemDTO orderItemDTO);

    void save(EOrderItem orderItem);
}
