package ke.kigen.api.services.customer;

import java.lang.reflect.InvocationTargetException;
import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import ke.kigen.api.dtos.customer.CustomerDTO;
import ke.kigen.api.dtos.general.PageDTO;
import ke.kigen.api.models.customer.ECustomer;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class SCustomer implements ICustomerCreate, ICustomerListing, ICustomerUpdate {
    
    private final ICustomerCreate sCustomerCreate;

    private final ICustomerListing sCustomerListing;

    private final ICustomerUpdate sCustomerUpdate;

    @Override
    public Specification<ECustomer> buildFilterSpec(String searchQuery) {
        return sCustomerListing.buildFilterSpec(searchQuery);
    }

    @Override
    public Boolean checkExistsByEmail(String email) {
        return sCustomerListing.checkExistsByEmail(email);
    }

    @Override
    public Boolean checkExistsByMobileNumber(String mobileNumber) {
        return sCustomerListing.checkExistsByMobileNumber(mobileNumber);
    }

    @Override
    public ECustomer create(CustomerDTO customerDTO) {
        return sCustomerCreate.create(customerDTO);
    }

    @Override
    public Optional<ECustomer> getById(Integer customerId) {
        return sCustomerListing.getById(customerId);
    }

    @Override
    public ECustomer getById(Integer customerId, Boolean handleNotFound) {
        return sCustomerListing.getById(customerId, handleNotFound);
    }

    @Override
    public List<ECustomer> getFilteredList(String searchQuery) {
        return sCustomerListing.getFilteredList(searchQuery);
    }

    @Override
    public Page<ECustomer> getPaginatedList(PageDTO pageDTO) {
        return sCustomerListing.getPaginatedList(pageDTO);
    }

    @Override
    public ECustomer update(Integer customerId, CustomerDTO customerDTO) throws IllegalAccessException, 
            IllegalArgumentException, InvocationTargetException, NoSuchMethodException, SecurityException {
        return sCustomerUpdate.update(customerId, customerDTO);
    }
}
