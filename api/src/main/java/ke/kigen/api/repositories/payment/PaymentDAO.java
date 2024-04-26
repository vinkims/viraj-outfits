package ke.kigen.api.repositories.payment;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;

import ke.kigen.api.models.payment.EPayment;

public interface PaymentDAO extends JpaRepository<EPayment, Integer>, JpaSpecificationExecutor<EPayment> {
    
    Boolean existsByExternalId(String externalId);

    Optional<EPayment> findByExternalId(String externalId);

    @Query(
        value = "SELECT * FROM payments "
            + "WHERE external_id = :externalId "
            + "OR id = :paymentId",
        nativeQuery = true
    )
    Optional<EPayment> findByIdOrExternalId(Integer paymentId, String externalId);
}
