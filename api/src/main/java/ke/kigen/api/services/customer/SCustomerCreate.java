package ke.kigen.api.services.customer;

import java.time.LocalDateTime;

import org.springframework.stereotype.Service;

import ke.kigen.api.dtos.customer.CustomerDTO;
import ke.kigen.api.models.customer.ECustomer;

@Service
public class SCustomerCreate extends SBaseCustomer implements ICustomerCreate {

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
    
}
