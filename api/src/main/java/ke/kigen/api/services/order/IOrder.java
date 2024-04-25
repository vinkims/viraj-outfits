package ke.kigen.api.services.order;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.jpa.domain.Specification;

import ke.kigen.api.dtos.general.PageDTO;
import ke.kigen.api.dtos.order.OrderDTO;
import ke.kigen.api.models.order.EOrder;

public interface IOrder {
    
    final List<String> ALLOWED_FIELDS = List.of(
        "createdOn",
        "customer.id",
        "orderType.id",
        "orderType.name",
        "status.id",
        "status.name",
        "totalAmount",
        "updatedOn",
        "user.id"
    );

    Specification<EOrder> buildFilterSpec(String searchQuery);

    EOrder create(OrderDTO orderDTO);

    Optional<EOrder> getById(Integer orderId);

    EOrder getById(Integer orderId, Boolean handleNotFound);

    List<EOrder> getFilteredList(String searchQuery);

    Page<EOrder> getPaginatedList(PageDTO pageDTO);

    void save(EOrder order);

    EOrder update(Integer orderId, OrderDTO orderDTO);
}
