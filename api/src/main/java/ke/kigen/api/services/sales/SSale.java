package ke.kigen.api.services.sales;

import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.math.BigDecimal;
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
import ke.kigen.api.dtos.sales.SaleDTO;
import ke.kigen.api.exceptions.NotFoundException;
import ke.kigen.api.models.customer.ECustomer;
import ke.kigen.api.models.item.EItem;
import ke.kigen.api.models.payment.ETransaction;
import ke.kigen.api.models.sales.ESale;
import ke.kigen.api.models.sales.ESaleType;
import ke.kigen.api.models.status.EStatus;
import ke.kigen.api.models.user.EUser;
import ke.kigen.api.repositories.sales.SaleDAO;
import ke.kigen.api.services.auth.IUserDetails;
import ke.kigen.api.services.customer.ICustomer;
import ke.kigen.api.services.item.IItem;
import ke.kigen.api.services.payment.transaction.ITransaction;
import ke.kigen.api.services.status.IStatus;
import ke.kigen.api.services.user.IUser;
import ke.kigen.api.specifications.SpecBuilder;
import ke.kigen.api.specifications.SpecFactory;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class SSale implements ISale {

    Logger logger = LoggerFactory.getLogger(SSale.class);

    private final ICustomer sCustomer;

    private final IItem sItem;

    private final ISaleType sSaleType;

    private final IStatus sStatus;

    private final ITransaction sTransaction;

    private final IUser sUser;

    private final IUserDetails sUserDetails;

    private final MainConfig mainConfig;

    private final SaleDAO saleDAO;

    private final SpecFactory specFactory;
    
    @Override
    @SuppressWarnings("unchecked")
    public Specification<ESale> buildFilterSpec(String searchQuery) {

        SpecBuilder<ESale> specBuilder = new SpecBuilder<>();

        specBuilder = (SpecBuilder<ESale>) specFactory.generateSpecification(
            searchQuery, specBuilder, ALLOWED_FIELDS);

        return specBuilder.build();
    }

    @Override
    public Boolean checkExistsBySalesNumber(String salesNumber) {
        return saleDAO.existsBySalesNumber(salesNumber);
    }

    @Override
    public ESale create(SaleDTO saleDTO) {
        ESale sale = new ESale();
        sale.setAmount(saleDTO.getAmount());
        sale.setCreatedOn(LocalDateTime.now());
        setCustomer(sale, saleDTO.getCustomerId());
        BigDecimal discount = saleDTO.getDiscount() == null ? new BigDecimal("0") : saleDTO.getDiscount();
        sale.setDiscount(discount);
        setItem(sale, saleDTO.getItemId());
        BigDecimal netAmount = sale.getAmount().subtract(discount);
        sale.setNetAmount(netAmount);
        Integer saleTypeId = saleDTO.getSaleTypeId() == null ? mainConfig.getSale().getType().getRetailId() : saleDTO.getSaleTypeId();
        setSaleType(sale, saleTypeId);
        sale.setSalesNumber(createSalesNumber());
        Integer statusId = saleDTO.getStatusId() == null ? mainConfig.getStatus().getCompleteId() : saleDTO.getStatusId();
        setStatus(sale, statusId);
        EUser user = sUserDetails.getActiveUserByContact();
        Integer userId = saleDTO.getUserId() == null ? user.getId() : saleDTO.getUserId();
        setUser(sale, userId);

        save(sale);
        return sale;
    }

    private String createSalesNumber() {
        String lastSalesNumber = saleDAO.findLastSalesNumber();

        // Extract the numeric part
        int lastNumber = lastSalesNumber == null ? 0 : Integer.parseInt(lastSalesNumber.replace("SL", ""));
        int nextNumber = lastNumber + 1;

        return "SL" + nextNumber;
    }

    @Override
    public Optional<ESale> getById(Integer saleId) {
        return saleDAO.findById(saleId);
    }

    @Override
    public ESale getById(Integer saleId, Boolean handleNotFound) {

        Optional<ESale> sale = getById(saleId);
        if (sale.isPresent()) {
            return sale.get();
        } else if (Boolean.TRUE.equals(handleNotFound)) {
            throw new NotFoundException("sale with specified id not found", "saleTypeId");
        }
        return null;
    }

    @Override
    public Optional<ESale> getBySalesNumber(String salesNumber) {
        return saleDAO.findBySalesNumber(salesNumber);
    }

    @Override
    public ESale getBySalesNumber(String salesNumber, Boolean handleNotFound) {

        Optional<ESale> sale = getBySalesNumber(salesNumber);
        if (sale.isPresent()) {
            return sale.get();
        } else if (Boolean.TRUE.equals(handleNotFound)) {
            throw new NotFoundException("sale with specified sales number not found", "salesNumber");
        }
        return null;
    }

    @Override
    public List<ESale> getFilteredList(String searchQuery) {
        return saleDAO.findAll(buildFilterSpec(searchQuery));
    }

    @Override
    public Page<ESale> getPaginatedList(PageDTO pageDTO) {

        String search = pageDTO.getSearch();

        PageRequest pageRequest = PageRequest.of(pageDTO.getPageNumber(), pageDTO.getPageSize(), 
            Sort.by(pageDTO.getDirection(), pageDTO.getSortVal()));

        return saleDAO.findAll(buildFilterSpec(search), pageRequest);
    }

    @Override
    public void save(ESale sale) {
        saleDAO.save(sale);
    }

    private void setCustomer(ESale sale, Integer customerId) {

        if (customerId != null) {
            ECustomer customer = sCustomer.getById(customerId, true);
            sale.setCustomer(customer);
        }
    }

    private void setItem(ESale sale, Integer itemId) {

        if (itemId != null) {
            EItem item = sItem.getById(itemId, true);
            sale.setItem(item);
        }
    }

    private void setSaleType(ESale sale, Integer saleTypeId) {

        if (saleTypeId != null) {
            ESaleType saleType = sSaleType.getById(saleTypeId, true);
            sale.setSaleType(saleType);
        }
    }

    private void setStatus(ESale sale, Integer statusId) {

        if (statusId != null) {
            EStatus status = sStatus.getById(statusId, true);
            sale.setStatus(status);
        }
    }

    private void setTransaction(ESale sale, Integer transactionId) {

        if (transactionId != null) {
            ETransaction transaction = sTransaction.getById(transactionId, true);
            sale.setTransaction(transaction);
        }
    }

    private void setUser(ESale sale, Integer userId) {

        if (userId != null) {
            EUser user = sUser.getById(userId, true);
            sale.setUser(user);
        }
    }

    @Override
    public ESale update(Integer saleTypeId, SaleDTO saleDTO) throws IllegalAccessException, 
            IllegalArgumentException, InvocationTargetException, NoSuchMethodException, SecurityException {

        ESale sale = getById(saleTypeId, true);
        String[] fields = {"Amount", "Discount", "NetAmount"};
        for (String field : fields) {
            Method getField = SaleDTO.class.getMethod(String.format("get%s", field));
            Object fieldValue = getField.invoke(saleDTO);

            if (fieldValue != null) {
                fieldValue = fieldValue.getClass().equals(String.class) ? ((String) fieldValue).trim() : fieldValue;
                ESale.class.getMethod("set" + field, fieldValue.getClass()).invoke(sale, fieldValue);
            }
        }

        setCustomer(sale, saleDTO.getCustomerId());
        setItem(sale, saleDTO.getItemId());
        setSaleType(sale, saleDTO.getSaleTypeId());
        setStatus(sale, saleDTO.getStatusId());
        setTransaction(sale, saleDTO.getTransactionId());
        sale.setUpdatedOn(LocalDateTime.now());
        setUser(sale, saleDTO.getUserId());

        save(sale);
        return sale;
    }
    
}
