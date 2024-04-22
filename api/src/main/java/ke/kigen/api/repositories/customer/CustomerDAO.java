package ke.kigen.api.repositories.customer;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import ke.kigen.api.models.customer.ECustomer;

public interface CustomerDAO extends JpaRepository<ECustomer, Integer>, JpaSpecificationExecutor<ECustomer> {
    
    Boolean existsByEmail(String email);

    Boolean existsByMobileNumber(String mobileNumber);
}
