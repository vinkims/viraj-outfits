package ke.kigen.api.services.customer;

import ke.kigen.api.dtos.customer.CustomerDTO;
import ke.kigen.api.models.customer.ECustomer;

public interface ICustomerCreate {
    
    ECustomer create(CustomerDTO customerDTO);
}
