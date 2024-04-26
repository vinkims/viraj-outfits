package ke.kigen.api.models.order;

import java.io.Serializable;
import java.math.BigDecimal;
import java.util.Objects;

import jakarta.persistence.Column;
import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.MapsId;
import ke.kigen.api.models.item.EItem;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity(name = "order_items")
@Data
@NoArgsConstructor
public class EOrderItem implements Serializable {
    
    private static final long serialVersionUID = 1L;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "item_id", referencedColumnName = "id")
    @MapsId(value = "itemId")
    private EItem item;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", referencedColumnName = "id")
    @MapsId(value = "orderId")
    private EOrder order;

    @EmbeddedId
    private PKOrderItem pkOrderItem;

    @Column(name = "quantity")
    private Integer quantity;

    @Column(name = "subtotal")
    private BigDecimal subtotal;

    @Column(name = "unit_price")
    private BigDecimal unitPrice;

    public EOrderItem(EOrder order, EItem item) {
        setItem(item);
        setOrder(order);
        setPkOrderItem(new PKOrderItem(order.getId(), item.getId()));
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(pkOrderItem);
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

        return Objects.equals(pkOrderItem, ((EOrderItem) object).getPkOrderItem());
    }
}
