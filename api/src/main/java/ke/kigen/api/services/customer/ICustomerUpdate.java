package ke.kigen.api.services.customer;

import java.lang.reflect.InvocationTargetException;

import ke.kigen.api.dtos.customer.CustomerDTO;
import ke.kigen.api.models.customer.ECustomer;

public interface ICustomerUpdate {
    
    ECustomer update(Integer customerId, CustomerDTO customerDTO) throws IllegalAccessException, 
        IllegalArgumentException, InvocationTargetException, NoSuchMethodException, SecurityException;
}
