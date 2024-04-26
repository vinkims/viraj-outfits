package ke.kigen.api.services.order;

import org.springframework.stereotype.Service;

import ke.kigen.api.dtos.order.OrderItemDTO;
import ke.kigen.api.models.item.EItem;
import ke.kigen.api.models.order.EOrder;
import ke.kigen.api.models.order.EOrderItem;
import ke.kigen.api.repositories.order.OrderItemDAO;
import ke.kigen.api.services.item.IItem;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class SOrderItem implements IOrderItem {
    
    private final IItem sItem;

    private final OrderItemDAO orderItemDAO;

    @Override
    public EOrderItem create(EOrder order, OrderItemDTO orderItemDTO) {
        EOrderItem orderItem = new EOrderItem();
        setItem(orderItem, orderItemDTO.getItemId());
        orderItem.setOrder(order);
        orderItem.setQuantity(orderItemDTO.getQuantity());
        orderItem.setSubtotal(orderItemDTO.getSubtotal());
        orderItem.setUnitPrice(orderItemDTO.getUnitPrice());

        save(orderItem);
        return orderItem;
    }

    @Override
    public void save(EOrderItem orderItem) {
        orderItemDAO.save(orderItem);
    }

    private void setItem(EOrderItem orderItem, Integer itemId) {
        if (itemId == null) { return; }

        EItem item = sItem.getById(itemId, true);
        orderItem.setItem(item);
    }
    
}
