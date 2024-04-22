package ke.kigen.api.services.customer;

import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.time.LocalDateTime;

import org.springframework.stereotype.Service;

import ke.kigen.api.dtos.customer.CustomerDTO;
import ke.kigen.api.models.customer.ECustomer;

@Service
public class SCustomerUpdate extends SBaseCustomer implements ICustomerUpdate {

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
