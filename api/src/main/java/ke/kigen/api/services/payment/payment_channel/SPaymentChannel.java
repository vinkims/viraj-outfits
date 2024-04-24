package ke.kigen.api.services.payment.payment_channel;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import ke.kigen.api.dtos.general.PageDTO;
import ke.kigen.api.dtos.payment.PaymentChannelDTO;
import ke.kigen.api.exceptions.NotFoundException;
import ke.kigen.api.models.payment.EPaymentChannel;
import ke.kigen.api.repositories.payment.PaymentChannelDAO;
import ke.kigen.api.specifications.SpecBuilder;
import ke.kigen.api.specifications.SpecFactory;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class SPaymentChannel implements IPaymentChannel {
    
    private final PaymentChannelDAO paymentChannelDAO;

    private final SpecFactory specFactory;

    @Override
    @SuppressWarnings("unchecked")
    public Specification<EPaymentChannel> buildFilterSpec(String searchQuery) {

        SpecBuilder<EPaymentChannel> specBuilder = new SpecBuilder<>();

        specBuilder = (SpecBuilder<EPaymentChannel>) specFactory.generateSpecification(
            searchQuery, specBuilder, ALLOWED_FIELDS);

        return specBuilder.build();
    }

    @Override
    public Boolean checkExistsByName(String name) {
        return paymentChannelDAO.existsByName(name);
    }

    @Override
    public EPaymentChannel create(PaymentChannelDTO paymentChannelDTO) {
        EPaymentChannel paymentChannel = new EPaymentChannel();
        paymentChannel.setDescription(paymentChannelDTO.getDescription());
        paymentChannel.setName(paymentChannelDTO.getName());

        save(paymentChannel);
        return paymentChannel;
    }

    @Override
    public Optional<EPaymentChannel> getById(Integer paymentChannelId) {
        return paymentChannelDAO.findById(paymentChannelId);
    }

    @Override
    public EPaymentChannel getById(Integer paymentChannelId, Boolean handleNotFound) {

        Optional<EPaymentChannel> paymentChannel = getById(paymentChannelId);
        if (!paymentChannel.isPresent() && handleNotFound) {
            throw new NotFoundException("payment channel with specified id not found", "paymentChannelId");
        }
        return paymentChannel.get();
    }

    @Override
    public List<EPaymentChannel> getFilteredList(String searchQuery) {
        return paymentChannelDAO.findAll(buildFilterSpec(searchQuery));
    }

    @Override
    public Page<EPaymentChannel> getPaginatedList(PageDTO pageDTO) {

        String search = pageDTO.getSearch();

        PageRequest pageRequest = PageRequest.of(pageDTO.getPageNumber(), pageDTO.getPageSize(), 
            Sort.by(pageDTO.getDirection(), pageDTO.getSortVal()));

        return paymentChannelDAO.findAll(buildFilterSpec(search), pageRequest);
    }

    @Override
    public void save(EPaymentChannel paymentChannel) {
        paymentChannelDAO.save(paymentChannel);
    }

    @Override
    public EPaymentChannel update(Integer paymentChannelId, PaymentChannelDTO paymentChannelDTO) {
        EPaymentChannel paymentChannel = getById(paymentChannelId, true);
        if (paymentChannelDTO.getDescription() != null) {
            paymentChannel.setDescription(paymentChannelDTO.getDescription());
        }
        if (paymentChannelDTO.getName() != null) {
            paymentChannel.setName(paymentChannelDTO.getName());
        }

        save(paymentChannel);
        return paymentChannel;
    }
}
