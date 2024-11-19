package ke.kigen.api.services.payment.transaction;

import ke.kigen.api.models.customer.ECustomer;
import ke.kigen.api.models.payment.ECustomerTransaction;
import ke.kigen.api.models.payment.ETransaction;
import ke.kigen.api.repositories.payment.CustomerTransactionDAO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class SCustomerTransaction implements ICustomerTransaction {
    
    private final CustomerTransactionDAO customerTransactionDAO;

    @Override
    public ECustomerTransaction create(ECustomer customer, ETransaction transaction) {
        ECustomerTransaction customerTransaction = new ECustomerTransaction(customer, transaction);
        save(customerTransaction);
        return customerTransaction;
    }

    @Override
    public void save(ECustomerTransaction customerTransaction) {
        customerTransactionDAO.save(customerTransaction);
    }
    
}
