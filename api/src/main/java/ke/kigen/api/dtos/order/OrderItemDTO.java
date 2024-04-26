package ke.kigen.api.dtos.order;

import java.math.BigDecimal;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonInclude.Include;

import ke.kigen.api.dtos.item.ItemDTO;
import ke.kigen.api.models.order.EOrderItem;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@JsonInclude(value = Include.NON_NULL)
public class OrderItemDTO {
    
    private ItemDTO item;

    private Integer itemId;

    private Integer quantity;

    private BigDecimal unitPrice;

    private BigDecimal subtotal;

    public OrderItemDTO(EOrderItem orderItem) {
        setItem(new ItemDTO(orderItem.getItem()));
        setQuantity(orderItem.getQuantity());
        setSubtotal(orderItem.getSubtotal());
        setUnitPrice(orderItem.getUnitPrice());
    }
}
