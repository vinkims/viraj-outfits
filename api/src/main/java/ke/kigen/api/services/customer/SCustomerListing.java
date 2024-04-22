package ke.kigen.api.services.customer;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import ke.kigen.api.dtos.general.PageDTO;
import ke.kigen.api.models.customer.ECustomer;
import ke.kigen.api.specifications.SpecBuilder;
import ke.kigen.api.specifications.SpecFactory;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class SCustomerListing extends SBaseCustomer implements ICustomerListing {
    
    private final SpecFactory specFactory;

    @Override
    public Specification<ECustomer> buildFilterSpec(String searchQuery) {

        SpecBuilder<ECustomer> specBuilder = new SpecBuilder();

        specBuilder = (SpecBuilder<ECustomer>) specFactory.generateSpecification(searchQuery, 
            specBuilder, ALLOWED_FIELDS);

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
    public Optional<ECustomer> getById(Integer customerId) {
        return super.getById(customerId);
    }

    @Override
    public ECustomer getById(Integer customerId, Boolean handleNotFound) {
        return super.getById(customerId, handleNotFound);
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
    
}
