package ke.kigen.api.services.payment.transaction;

import ke.kigen.api.models.customer.ECustomer;
import ke.kigen.api.models.payment.ECustomerTransaction;
import ke.kigen.api.models.payment.ETransaction;

public interface ICustomerTransaction {
    
    ECustomerTransaction create(ECustomer customer, ETransaction transaction);

    void save(ECustomerTransaction customerTransaction);
}
