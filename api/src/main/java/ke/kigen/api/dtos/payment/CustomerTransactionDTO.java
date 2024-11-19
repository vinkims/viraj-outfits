package ke.kigen.api.dtos.payment;

import ke.kigen.api.dtos.customer.CustomerDTO;
import ke.kigen.api.models.payment.ECustomerTransaction;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class CustomerTransactionDTO {
    
    private CustomerDTO customer;

    private Integer customerId;

    public CustomerTransactionDTO(ECustomerTransaction customerTransaction) {
        setCustomer(new CustomerDTO(customerTransaction.getCustomer()));
    }
}
