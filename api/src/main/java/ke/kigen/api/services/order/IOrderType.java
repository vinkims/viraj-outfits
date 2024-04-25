package ke.kigen.api.services.order;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.jpa.domain.Specification;

import ke.kigen.api.dtos.general.PageDTO;
import ke.kigen.api.dtos.order.OrderTypeDTO;
import ke.kigen.api.models.order.EOrderType;

public interface IOrderType {
    
    final List<String> ALLOWED_FIELDS = List.of();

    Specification<EOrderType> buildFilterSpec(String searchQuery);

    Boolean checkExistsByName(String name);

    EOrderType create(OrderTypeDTO orderTypeDTO);

    Optional<EOrderType> getById(Integer orderTypeId);

    EOrderType getById(Integer orderTypeId, Boolean handleNotFound);

    Page<EOrderType> getPaginatedList(PageDTO pageDTO);

    void save(EOrderType orderType);

    EOrderType update(Integer orderTypeId, OrderTypeDTO orderTypeDTO);
}
