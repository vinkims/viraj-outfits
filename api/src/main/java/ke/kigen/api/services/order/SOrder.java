package ke.kigen.api.services.order;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import ke.kigen.api.configs.properties.MainConfig;
import ke.kigen.api.dtos.general.PageDTO;
import ke.kigen.api.dtos.order.OrderDTO;
import ke.kigen.api.dtos.order.OrderItemDTO;
import ke.kigen.api.exceptions.NotFoundException;
import ke.kigen.api.models.customer.ECustomer;
import ke.kigen.api.models.order.EOrder;
import ke.kigen.api.models.order.EOrderItem;
import ke.kigen.api.models.order.EOrderType;
import ke.kigen.api.models.status.EStatus;
import ke.kigen.api.models.user.EUser;
import ke.kigen.api.repositories.order.OrderDAO;
import ke.kigen.api.services.auth.IUserDetails;
import ke.kigen.api.services.customer.ICustomer;
import ke.kigen.api.services.status.IStatus;
import ke.kigen.api.services.user.IUser;
import ke.kigen.api.specifications.SpecBuilder;
import ke.kigen.api.specifications.SpecFactory;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class SOrder implements IOrder {

    private final ICustomer sCustomer;

    private final IOrderItem sOrderItem;

    private final IOrderType sOrderType;

    private final IStatus sStatus;

    private final IUser sUser;

    private final IUserDetails sUserDetails;

    private final MainConfig mainConfig;

    private final OrderDAO orderDAO;

    private final SpecFactory specFactory;
    
    @Override
    @SuppressWarnings("unchecked")
    public Specification<EOrder> buildFilterSpec(String searchQuery) {

        SpecBuilder<EOrder> specBuilder = new SpecBuilder<>();

        specBuilder = (SpecBuilder<EOrder>) specFactory.generateSpecification(
            searchQuery, specBuilder, ALLOWED_FIELDS);

        return specBuilder.build();
    }

    @Override
    public EOrder create(OrderDTO orderDTO) {
        EOrder order = new EOrder();
        order.setCreatedOn(LocalDateTime.now());
        setCustomer(order, orderDTO.getCustomerId());
        setOrderType(order, orderDTO.getOrderTypeId());
        Integer statusId = orderDTO.getStatusId() == null
            ? mainConfig.getStatus().getCompleteId()
            : orderDTO.getStatusId();
        setStatus(order, statusId);
        order.setTotalAmount(orderDTO.getTotalAmount());
        EUser user = sUserDetails.getActiveUserByContact();
        Integer userId = orderDTO.getUserId() == null 
            ? user.getId() : orderDTO.getUserId();
        setUser(order, userId);

        save(order);
        setOrderItems(order, orderDTO.getOrderItems());
        return order;
    }

    @Override
    public Optional<EOrder> getById(Integer orderId) {
        return orderDAO.findById(orderId);
    }

    @Override
    public EOrder getById(Integer orderId, Boolean handleNotFound) {

        Optional<EOrder> order = getById(orderId);
        if (!order.isPresent() && handleNotFound) {
            throw new NotFoundException("order with specified id not found", "orderId");
        }
        return order.get();
    }

    @Override
    public List<EOrder> getFilteredList(String searchQuery) {
        return orderDAO.findAll(buildFilterSpec(searchQuery));
    }

    @Override
    public Page<EOrder> getPaginatedList(PageDTO pageDTO) {

        String search = pageDTO.getSearch();

        PageRequest pageRequest = PageRequest.of(pageDTO.getPageNumber(), pageDTO.getPageSize(), 
            Sort.by(pageDTO.getDirection(), pageDTO.getSortVal()));

        return orderDAO.findAll(buildFilterSpec(search), pageRequest);
    }

    @Override
    public void save(EOrder order) {
        orderDAO.save(order);
    }

    private void setCustomer(EOrder order, Integer customerId) {
        if (customerId == null) { return; }

        ECustomer customer = sCustomer.getById(customerId, true);
        order.setCustomer(customer);
    }

    private void setOrderItems(EOrder order,  List<OrderItemDTO> orderItems) {
        if (orderItems == null || orderItems.isEmpty()) { return; }

        List<EOrderItem> orderItemsList = new ArrayList<>();
        for (OrderItemDTO orderItemDTO : orderItems) {
            EOrderItem orderItem = sOrderItem.create(order, orderItemDTO);
            orderItemsList.add(orderItem);
        }
        order.setOrderItems(orderItemsList);
    }

    private void setOrderType(EOrder order, Integer orderTypeId) {
        if (orderTypeId == null) { return; }

        EOrderType orderType = sOrderType.getById(orderTypeId, true);
        order.setOrderType(orderType);
    }

    private void setStatus(EOrder order, Integer statusId) {
        if (statusId == null) { return; }

        EStatus status = sStatus.getById(statusId, true);
        order.setStatus(status);
    }

    private void setUser(EOrder order, Integer userId) {
        if (userId == null) { return; }

        EUser user = sUser.getById(userId, true);
        order.setUser(user);
    }

    @Override
    public EOrder update(Integer orderId, OrderDTO orderDTO) {
        EOrder order = getById(orderId, true);
        setCustomer(order, orderDTO.getCustomerId());
        setOrderItems(order, orderDTO.getOrderItems());
        setOrderType(order, orderDTO.getOrderTypeId());
        setStatus(order, orderDTO.getStatusId());
        if (orderDTO.getTotalAmount() != null) {
            order.setTotalAmount(orderDTO.getTotalAmount());
        }
        order.setUpdatedOn(LocalDateTime.now());
        setUser(order, orderDTO.getUserId());

        save(order);
        return order;
    }
    
}
