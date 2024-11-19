package ke.kigen.api.repositories.payment;

import ke.kigen.api.models.payment.ECustomerTransaction;
import ke.kigen.api.models.payment.PKCustomerTransaction;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CustomerTransactionDAO extends JpaRepository<ECustomerTransaction, PKCustomerTransaction> {
    
}
