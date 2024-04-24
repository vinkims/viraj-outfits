package ke.kigen.api.repositories.payment;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import ke.kigen.api.models.payment.EPaymentChannel;

public interface PaymentChannelDAO extends JpaRepository<EPaymentChannel, Integer>, JpaSpecificationExecutor<EPaymentChannel> {
    
    Boolean existsByName(String name);
}
