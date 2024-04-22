package ke.kigen.api.services.customer;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.jpa.domain.Specification;

import ke.kigen.api.dtos.general.PageDTO;
import ke.kigen.api.models.customer.ECustomer;

public interface ICustomerListing {
    
    final List<String> ALLOWED_FIELDS = List.of(
        "createdOn",
        "email",
        "firstName",
        "lastName",
        "mobileNumber",
        "status.id",
        "status.name",
        "updatedOn"
    );

    Specification<ECustomer> buildFilterSpec(String searchQuery);

    Boolean checkExistsByEmail(String email);

    Boolean checkExistsByMobileNumber(String mobileNumber);

    Optional<ECustomer> getById(Integer customerId);

    ECustomer getById(Integer customerId, Boolean handleNotFound);

    List<ECustomer> getFilteredList(String searchQuery);

    Page<ECustomer> getPaginatedList(PageDTO pageDTO);
}
