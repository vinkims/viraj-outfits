package ke.kigen.api.services.customer;

import java.util.Optional;

import org.springframework.stereotype.Service;

import ke.kigen.api.configs.properties.MainConfig;
import ke.kigen.api.exceptions.NotFoundException;
import ke.kigen.api.models.customer.ECustomer;
import ke.kigen.api.models.status.EStatus;
import ke.kigen.api.repositories.customer.CustomerDAO;
import ke.kigen.api.services.status.SStatus;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class SBaseCustomer {
    
    protected final CustomerDAO customerDAO;

    protected final MainConfig mainConfig;

    protected final SStatus sStatus;

    public SBaseCustomer() {
        this.customerDAO = null;
        this.mainConfig = null;
        this.sStatus = null;
    }

    protected Optional<ECustomer> getById(Integer customerId) {
        return customerDAO.findById(customerId);
    }

    protected ECustomer getById(Integer customerId, Boolean handleNotFound) {

        Optional<ECustomer> customer = getById(customerId);
        if (!customer.isPresent() && handleNotFound) {
            throw new NotFoundException("customer with specified id not found", "customerId");
        }
        return customer.get();
    }

    protected void save(ECustomer customer) {
        customerDAO.save(customer);
    }

    protected void setStatus(ECustomer customer, Integer statusId) {
        if (statusId == null) { return; }

        EStatus status = sStatus.getById(statusId, true);
        customer.setStatus(status);
    }
}
