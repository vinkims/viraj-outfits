package ke.kigen.api.services.payment;

import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import ke.kigen.api.configs.properties.MainConfig;
import ke.kigen.api.dtos.general.PageDTO;
import ke.kigen.api.dtos.payment.PaymentDTO;
import ke.kigen.api.exceptions.NotFoundException;
import ke.kigen.api.models.order.EOrder;
import ke.kigen.api.models.payment.EPayment;
import ke.kigen.api.models.payment.EPaymentChannel;
import ke.kigen.api.models.payment.ETransaction;
import ke.kigen.api.models.status.EStatus;
import ke.kigen.api.repositories.payment.PaymentDAO;
import ke.kigen.api.services.order.IOrder;
import ke.kigen.api.services.payment.payment_channel.IPaymentChannel;
import ke.kigen.api.services.payment.transaction.ITransaction;
import ke.kigen.api.services.status.IStatus;
import ke.kigen.api.specifications.SpecBuilder;
import ke.kigen.api.specifications.SpecFactory;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class SPayment implements IPayment {

    Logger logger = LoggerFactory.getLogger(SPayment.class);
    
    private final IOrder sOrder;

    private final IPaymentChannel sPaymentChannel;

    private final IStatus sStatus;

    private final ITransaction sTransaction;

    private final MainConfig mainConfig;

    private final PaymentDAO paymentDAO;

    private final SpecFactory specFactory;

    @Override
    @SuppressWarnings("unchecked")
    public Specification<EPayment> buildFilterSpec(String searchQuery) {

        SpecBuilder<EPayment> specBuilder = new SpecBuilder<>();

        specBuilder = (SpecBuilder<EPayment>) specFactory.generateSpecification(
            searchQuery, specBuilder, ALLOWED_FIELDS);

        return specBuilder.build();
    }

    @Override
    public Boolean checkExistsByExternalId(String externalId) {
        return paymentDAO.existsByExternalId(externalId);
    }

    @Override
    public EPayment create(PaymentDTO paymentDTO) {
        EPayment payment = new EPayment();
        payment.setAmount(paymentDTO.getAmount());
        payment.setCreatedOn(LocalDateTime.now());
        payment.setDescription(paymentDTO.getDescription());
        payment.setExternalId(paymentDTO.getExternalId());
        payment.setReference(paymentDTO.getReference());
        setOrder(payment, paymentDTO.getOrderId());
        setPaymentChannel(payment, paymentDTO.getPaymentChannelId());
        Integer statusId = paymentDTO.getStatusId() == null
            ? mainConfig.getStatus().getCompleteId()
            : paymentDTO.getStatusId();
        setStatus(payment, statusId);
        setTransaction(payment, paymentDTO.getTransactionId());

        save(payment);
        return payment;
    }

    @Override
    public Optional<EPayment> getByExternalId(String externalId) {
        return paymentDAO.findByExternalId(externalId);
    }

    @Override
    public Optional<EPayment> getById(Integer paymentId) {
        return paymentDAO.findById(paymentId);
    }

    @Override
    public EPayment getById(Integer paymentId, Boolean handleNotFound) {

        Optional<EPayment> payment = getById(paymentId);
        if (!payment.isPresent() && handleNotFound) {
            throw new NotFoundException("payment with specified id not found", "paymentId");
        }
        return payment.get();
    }

    @Override
    public Optional<EPayment> getByIdOrExternalId(String paymentValue) {
        Integer paymentId;
        try {
            paymentId = Integer.valueOf(paymentValue);
        } catch (Exception e) {
            paymentId = (Integer) null;
            logger.error("\n[LOCATION] - SPayment.getByIdOrExternalId\n[MSG] {}", e.getMessage());
            return getByExternalId(paymentValue);
        }

        return paymentDAO.findByIdOrExternalId(paymentId, paymentValue);
    }

    @Override
    public EPayment getByIdOrExternalId(String paymentValue, Boolean handleNotFound) {
        
        Optional<EPayment> payment = getByIdOrExternalId(paymentValue);
        if (!payment.isPresent() && handleNotFound) {
            throw new NotFoundException("payment with specified id or external id not found", "paymentValue");
        }
        return payment.get();
    }

    @Override
    public List<EPayment> getFilteredList(String searchQuery) {
        return paymentDAO.findAll(buildFilterSpec(searchQuery));
    }

    @Override
    public Page<EPayment> getPaginatedList(PageDTO pageDTO) {

        String search = pageDTO.getSearch();

        PageRequest pageRequest = PageRequest.of(pageDTO.getPageNumber(), pageDTO.getPageSize(), 
            Sort.by(pageDTO.getDirection(), pageDTO.getSortVal()));

        return paymentDAO.findAll(buildFilterSpec(search), pageRequest);
    }

    @Override
    public void save(EPayment payment) {
        paymentDAO.save(payment);
    }

    private void setOrder(EPayment payment, Integer orderId) {
        if (orderId == null) { return; }

        EOrder order = sOrder.getById(orderId, true);
        payment.setOrder(order);
    }

    private void setPaymentChannel(EPayment payment, Integer paymentChannelId) {
        if (paymentChannelId == null) { return; }

        EPaymentChannel paymentChannel = sPaymentChannel.getById(paymentChannelId, true);
        payment.setPaymentChannel(paymentChannel);
    }

    private void setStatus(EPayment payment, Integer statusId) {
        if (statusId == null) { return; }

        EStatus status = sStatus.getById(statusId, true);
        payment.setStatus(status);
    }

    private void setTransaction(EPayment payment, Integer transactionId) {
        if (transactionId == null) { return; }

        ETransaction transaction = sTransaction.getById(transactionId, true);
        payment.setTransaction(transaction);
    }

    @Override
    public EPayment update(String paymentValue, PaymentDTO paymentDTO) throws IllegalAccessException, 
            IllegalArgumentException, InvocationTargetException, NoSuchMethodException, SecurityException {

        EPayment payment = getByIdOrExternalId(paymentValue, true);

        String[] fields = {"Amount", "Description", "ExternalId", "Reference"};
        for (String field : fields) {
            Method getField = PaymentDTO.class.getMethod(String.format("get%s", field));
            Object fieldValue = getField.invoke(paymentDTO);

            if (fieldValue != null) {
                fieldValue = fieldValue.getClass().equals(String.class) ? ((String) fieldValue).trim() : fieldValue;
                EPayment.class.getMethod("set" + field, fieldValue.getClass()).invoke(payment, fieldValue);
            }
        }

        setOrder(payment, paymentDTO.getOrderId());
        setPaymentChannel(payment, paymentDTO.getPaymentChannelId());
        setStatus(payment, paymentDTO.getStatusId());
        setTransaction(payment, paymentDTO.getTransactionId());
        payment.setUpdatedOn(LocalDateTime.now());

        save(payment);
        return payment;
    }
}
