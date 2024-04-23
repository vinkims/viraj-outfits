package ke.kigen.api.services.customer;

import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import ke.kigen.api.configs.properties.MainConfig;
import ke.kigen.api.dtos.customer.CustomerDTO;
import ke.kigen.api.dtos.general.PageDTO;
import ke.kigen.api.exceptions.NotFoundException;
import ke.kigen.api.models.customer.ECustomer;
import ke.kigen.api.models.status.EStatus;
import ke.kigen.api.repositories.customer.CustomerDAO;
import ke.kigen.api.services.status.IStatus;
import ke.kigen.api.specifications.SpecBuilder;
import ke.kigen.api.specifications.SpecFactory;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class SCustomer implements ICustomer {

    private final CustomerDAO customerDAO;

    private final IStatus sStatus;

    private final MainConfig mainConfig;

    private final SpecFactory specFactory;

    @Override
    @SuppressWarnings("unchecked")
    public Specification<ECustomer> buildFilterSpec(String searchQuery) {
        
        SpecBuilder<ECustomer> specBuilder = new SpecBuilder<>();

        specBuilder = (SpecBuilder<ECustomer>) specFactory.generateSpecification(
            searchQuery, specBuilder, ALLOWED_FIELDS);

        return specBuilder.build();
    }

    @Override
    public Boolean checkExistsByEmail(String email) {
        return customerDAO.existsByEmail(email);
    }

    @Override
    public Boolean checkExistsByMobileNumber(String mobileNumber) {
        return customerDAO.existsByMobileNumber(mobileNumber);
    }

    @Override
    public ECustomer create(CustomerDTO customerDTO) {
        ECustomer customer = new ECustomer();
        customer.setCreatedOn(LocalDateTime.now());
        customer.setEmail(customerDTO.getEmail());
        customer.setFirstName(customerDTO.getFirstName());
        customer.setLastName(customerDTO.getLastName());
        customer.setMobileNumber(customerDTO.getMobileNumber());
        Integer statusId = customerDTO.getStatusId() == null
            ? mainConfig.getStatus().getActiveId()
            : customerDTO.getStatusId();
        setStatus(customer, statusId);

        save(customer);
        return customer;
    }

    @Override
    public Optional<ECustomer> getById(Integer customerId) {
        return customerDAO.findById(customerId);
    }

    @Override
    public ECustomer getById(Integer customerId, Boolean handleNotFound) {
        
        Optional<ECustomer> customer = getById(customerId);
        if (!customer.isPresent() && handleNotFound) {
            throw new NotFoundException("customer with specified id not found", "customerId");
        }
        return customer.get();
    }

    @Override
    public List<ECustomer> getFilteredList(String searchQuery) {
        return customerDAO.findAll(buildFilterSpec(searchQuery));
    }

    @Override
    public Page<ECustomer> getPaginatedList(PageDTO pageDTO) {
        
        String search = pageDTO.getSearch();

        PageRequest pageRequest = PageRequest.of(pageDTO.getPageNumber(), pageDTO.getPageSize(), 
            Sort.by(pageDTO.getDirection(), pageDTO.getSortVal()));

        return customerDAO.findAll(buildFilterSpec(search), pageRequest);
    }

    @Override
    public void save(ECustomer customer) {
        customerDAO.save(customer);
    }

    private void setStatus(ECustomer customer, Integer statusId) {
        if (statusId == null) { return; }

        EStatus status = sStatus.getById(statusId, true);
        customer.setStatus(status);
    }

    @Override
    public ECustomer update(Integer customerId, CustomerDTO customerDTO) throws IllegalAccessException, 
            IllegalArgumentException, InvocationTargetException, NoSuchMethodException, SecurityException {

        ECustomer customer = getById(customerId, true);

        String[] fields = {"Email", "FirstName", "LastName", "MobileNumber"};
        for (String field : fields) {
            Method getField = CustomerDTO.class.getMethod(String.format("get%s", field));
            Object fieldValue = getField.invoke(customerDTO);

            if (fieldValue != null) {
                fieldValue = fieldValue.getClass().equals(String.class) ? ((String) fieldValue).trim() : fieldValue;
                ECustomer.class.getMethod("set" + field, fieldValue.getClass()).invoke(customer, fieldValue);
            }
        }

        setStatus(customer, customerDTO.getStatusId());
        customer.setUpdatedOn(LocalDateTime.now());

        save(customer);
        return customer;
    }
}
