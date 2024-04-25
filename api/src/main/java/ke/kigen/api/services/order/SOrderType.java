package ke.kigen.api.services.order;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import ke.kigen.api.dtos.general.PageDTO;
import ke.kigen.api.dtos.order.OrderTypeDTO;
import ke.kigen.api.exceptions.NotFoundException;
import ke.kigen.api.models.order.EOrderType;
import ke.kigen.api.repositories.order.OrderTypeDAO;
import ke.kigen.api.specifications.SpecBuilder;
import ke.kigen.api.specifications.SpecFactory;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class SOrderType implements IOrderType {
    
    private final OrderTypeDAO orderTypeDAO;

    private final SpecFactory specFactory;

    @Override
    @SuppressWarnings("unchecked")
    public Specification<EOrderType> buildFilterSpec(String searchQuery) {

        SpecBuilder<EOrderType> specBuilder = new SpecBuilder<>();

        specBuilder = (SpecBuilder<EOrderType>) specFactory.generateSpecification(
            searchQuery, specBuilder, ALLOWED_FIELDS);

        return specBuilder.build();
    }

    @Override
    public Boolean checkExistsByName(String name) {
        return orderTypeDAO.existsByName(name);
    }

    @Override
    public EOrderType create(OrderTypeDTO orderTypeDTO) {
        EOrderType orderType = new EOrderType();
        orderType.setDescription(orderTypeDTO.getDescription());
        orderType.setName(orderTypeDTO.getName());

        save(orderType);
        return orderType;
    }

    @Override
    public Optional<EOrderType> getById(Integer orderTypeId) {
        return orderTypeDAO.findById(orderTypeId);
    }

    @Override
    public EOrderType getById(Integer orderTypeId, Boolean handleNotFound) {

        Optional<EOrderType> orderType = getById(orderTypeId);
        if (!orderType.isPresent() && handleNotFound) {
            throw new NotFoundException("order type with specified id not found", "orderTypeId");
        }
        return orderType.get();
    }

    @Override
    public Page<EOrderType> getPaginatedList(PageDTO pageDTO) {
        
        String search = pageDTO.getSearch();

        PageRequest pageRequest = PageRequest.of(pageDTO.getPageNumber(), pageDTO.getPageSize(), 
            Sort.by(pageDTO.getDirection(), pageDTO.getSortVal()));

        return orderTypeDAO.findAll(buildFilterSpec(search), pageRequest);
    }

    @Override
    public void save(EOrderType orderType) {
        orderTypeDAO.save(orderType);
    }

    @Override
    public EOrderType update(Integer orderTypeId, OrderTypeDTO orderTypeDTO) {
        EOrderType orderType = getById(orderTypeId, true);
        if (orderTypeDTO.getDescription() != null) {
            orderType.setDescription(orderTypeDTO.getDescription());
        }
        if (orderTypeDTO.getName() != null) {
            orderType.setName(orderTypeDTO.getName());
        }

        save(orderType);
        return orderType;
    }
}
