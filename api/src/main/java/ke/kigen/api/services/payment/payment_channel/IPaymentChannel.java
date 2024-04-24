package ke.kigen.api.services.payment.payment_channel;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.jpa.domain.Specification;

import ke.kigen.api.dtos.general.PageDTO;
import ke.kigen.api.dtos.payment.PaymentChannelDTO;
import ke.kigen.api.models.payment.EPaymentChannel;

public interface IPaymentChannel {
    
    final List<String> ALLOWED_FIELDS = List.of();

    Specification<EPaymentChannel> buildFilterSpec(String searchQuery);

    Boolean checkExistsByName(String name);

    EPaymentChannel create(PaymentChannelDTO paymentChannelDTO);

    Optional<EPaymentChannel> getById(Integer paymentChannelId);

    EPaymentChannel getById(Integer paymentChannelId, Boolean handleNotFound);

    List<EPaymentChannel> getFilteredList(String searchQuery);

    Page<EPaymentChannel> getPaginatedList(PageDTO pageDTO);

    void save(EPaymentChannel paymentChannel);

    EPaymentChannel update(Integer paymentChannelId, PaymentChannelDTO paymentChannelDTO);
}
