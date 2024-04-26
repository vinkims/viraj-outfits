package ke.kigen.api.services.payment;
import java.util.List;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.jpa.domain.Specification;

import ke.kigen.api.dtos.general.PageDTO;
import ke.kigen.api.dtos.payment.PaymentDTO;
import ke.kigen.api.models.payment.EPayment;

public interface IPayment {
    
    final List<String> ALLOWED_FIELDS = List.of(
        "amount",
        "createdOn",
        "order.id",
        "paymentChannel.id",
        "paymentChannel.name",
        "reference",
        "status.id",
        "status.name",
        "transaction.name",
        "transaction.transactionCode",
        "updatedOn"
    );

    Specification<EPayment> buildFilterSpec(String searchQuery);

    Boolean checkExistsByExternalId(String externalId);

    EPayment create(PaymentDTO paymentDTO);

    Optional<EPayment> getByExternalId(String externalId);

    Optional<EPayment> getById(Integer paymentId);

    EPayment getById(Integer paymentId, Boolean handleNotFound);

    Optional<EPayment> getByIdOrExternalId(String paymentValue);

    EPayment getByIdOrExternalId(String paymentValue, Boolean handleNotFound);

    List<EPayment> getFilteredList(String searchQuery);

    Page<EPayment> getPaginatedList(PageDTO pageDTO);

    void save(EPayment payment);

    EPayment update(String paymentValue, PaymentDTO paymentDTO);
}
