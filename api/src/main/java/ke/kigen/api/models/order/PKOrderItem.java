package ke.kigen.api.models.order;

import java.io.Serializable;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.Data;
import lombok.NoArgsConstructor;

@Embeddable
@Data
@NoArgsConstructor
public class PKOrderItem implements Serializable {
    
    private static final long serialVersionUID = 1L;

    @Column(name = "order_id")
    private Integer orderId;

    @Column(name = "item_id")
    private Integer itemId;

    public PKOrderItem(Integer orderId, Integer itemId) {
        setOrderId(orderId);
        setItemId(itemId);
    }

    @Override
    public int hashCode() {
        int hash = 31 + ((orderId == null) ? 0 : orderId.hashCode());
        hash *= 31 + ((itemId == null) ? 0 : itemId.hashCode());
        return hash;
    }

    @Override
    public boolean equals(Object object) {
        if (this == object) { 
            return true; 
        }
        if (object == null) { 
            return false; 
        }
        if (object.getClass() != getClass()) {
            return false;
        }

        PKOrderItem pkOrderItem = (PKOrderItem) object;

        if (orderId == null && pkOrderItem.getOrderId() != null) {
            return false;
        }
        if (itemId == null && pkOrderItem.getItemId() != null) {
            return false;
        }

        return true;
    }
}
