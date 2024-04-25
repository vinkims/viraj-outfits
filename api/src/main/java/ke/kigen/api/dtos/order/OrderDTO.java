package ke.kigen.api.dtos.order;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import ke.kigen.api.dtos.customer.CustomerDTO;
import ke.kigen.api.dtos.status.StatusDTO;
import ke.kigen.api.dtos.user.UserDTO;
import ke.kigen.api.models.order.EOrder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class OrderDTO {
    
    private Integer id;

    private OrderTypeDTO orderType;

    private Integer orderTypeId;

    private BigDecimal totalAmount;

    private LocalDateTime createdOn;

    private LocalDateTime updatedOn;

    private UserDTO user;

    private Integer userId;

    private CustomerDTO customer;

    private Integer customerId;

    private StatusDTO status;

    private Integer statusId;

    public OrderDTO(EOrder order) {
        setCreatedOn(order.getCreatedOn());
        if (order.getCustomer() != null) {
            setCustomer(new CustomerDTO(order.getCustomer()));
        }
        setId(order.getId());
        setOrderType(new OrderTypeDTO(order.getOrderType()));
        setStatus(new StatusDTO(order.getStatus()));
        setTotalAmount(order.getTotalAmount());
        setUpdatedOn(order.getUpdatedOn());
        setUser(new UserDTO(order.getUser()));
    }
}
