package ke.kigen.api.services.sales;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.jpa.domain.Specification;

import ke.kigen.api.dtos.general.PageDTO;
import ke.kigen.api.dtos.sales.SaleTypeDTO;
import ke.kigen.api.models.sales.ESaleType;

public interface ISaleType {
    
    final List<String> ALLOWED_FIELDS = List.of();

    Specification<ESaleType> buildFilterSpec(String searchQuery);

    Boolean checkExistsByName(String name);

    ESaleType create(SaleTypeDTO saleTypeDTO);

    Optional<ESaleType> getById(Integer saleTypeId);

    ESaleType getById(Integer saleTypeId, Boolean handleNotFound);

    List<ESaleType> getFilteredList(String searchQuery);

    Page<ESaleType> getPaginatedList(PageDTO pageDTO);

    void save(ESaleType saleType);

    ESaleType update(Integer saleTypeId, SaleTypeDTO saleTypeDTO);
}
