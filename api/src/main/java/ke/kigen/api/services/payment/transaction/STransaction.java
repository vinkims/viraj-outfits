package ke.kigen.api.services.payment.transaction;

import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import ke.kigen.api.configs.properties.MainConfig;
import ke.kigen.api.dtos.general.PageDTO;
import ke.kigen.api.dtos.payment.CustomerTransactionDTO;
import ke.kigen.api.dtos.payment.TransactionDTO;
import ke.kigen.api.dtos.payment.TransactionExpenseDTO;
import ke.kigen.api.dtos.payment.TransactionIncomeDTO;
import ke.kigen.api.dtos.payment.TransactionItemDTO;
import ke.kigen.api.events.ExpenseCreatedEvent;
import ke.kigen.api.events.IncomeCreatedEvent;
import ke.kigen.api.events.ItemCreatedEvent;
import ke.kigen.api.exceptions.NotFoundException;
import ke.kigen.api.models.customer.ECustomer;
import ke.kigen.api.models.expense.EExpense;
import ke.kigen.api.models.income.EIncome;
import ke.kigen.api.models.item.EItem;
import ke.kigen.api.models.payment.ECustomerTransaction;
import ke.kigen.api.models.payment.EPaymentChannel;
import ke.kigen.api.models.payment.ETransaction;
import ke.kigen.api.models.payment.ETransactionExpense;
import ke.kigen.api.models.payment.ETransactionIncome;
import ke.kigen.api.models.payment.ETransactionItem;
import ke.kigen.api.models.payment.ETransactionSource;
import ke.kigen.api.models.payment.ETransactionType;
import ke.kigen.api.models.status.EStatus;
import ke.kigen.api.models.user.EUser;
import ke.kigen.api.repositories.payment.TransactionDAO;
import ke.kigen.api.services.auth.IUserDetails;
import ke.kigen.api.services.customer.ICustomer;
import ke.kigen.api.services.expense.IExpense;
import ke.kigen.api.services.income.IIncome;
import ke.kigen.api.services.item.IItem;
import ke.kigen.api.services.payment.payment_channel.IPaymentChannel;
import ke.kigen.api.services.payment.transaction_source.ITransactionSource;
import ke.kigen.api.services.payment.transaction_type.ITransactionType;
import ke.kigen.api.services.status.IStatus;
import ke.kigen.api.services.user.IUser;
import ke.kigen.api.specifications.SpecBuilder;
import ke.kigen.api.specifications.SpecFactory;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.event.EventListener;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class STransaction implements ITransaction {

    Logger logger = LoggerFactory.getLogger(STransaction.class);

    private final ICustomer sCustomer;

    private final ICustomerTransaction sCustomerTransaction;

    private final IExpense sExpense;

    private final IIncome sIncome;

    private final IItem sItem;

    private final IPaymentChannel sPaymentChannel;

    private final IStatus sStatus;

    private final ITransactionExpense sTransactionExpense;

    private final ITransactionIncome sTransactionIncome;

    private final ITransactionItem sTransactionItem;

    private final ITransactionSource sTransactionSource;

    private final ITransactionType sTransactionType;

    private final IUser sUser;

    private final IUserDetails sUserDetails;

    private final MainConfig mainConfig;

    private final SpecFactory specFactory;

    private final TransactionDAO transactionDAO;
    
    @Override
    @SuppressWarnings("unchecked")
    public Specification<ETransaction> buildFilterSpec(String searchQuery) {

        SpecBuilder<ETransaction> specBuilder = new SpecBuilder<>();

        specBuilder = (SpecBuilder<ETransaction>) specFactory.generateSpecification(
            searchQuery, specBuilder, ALLOWED_FIELDS);

        return specBuilder.build();
    }

    @Override
    public Boolean checkExistsByTransactionCode(String transactionCode) {
        return transactionDAO.existsByTransactionCode(transactionCode);
    }

    @Override
    public ETransaction create(TransactionDTO transactionDTO) {
        ETransaction transaction = new ETransaction();
        transaction.setAmount(transactionDTO.getAmount());
        transaction.setCreatedOn(LocalDateTime.now());
        transaction.setDescription(transactionDTO.getDescription());
        Integer paymentChannelId = transactionDTO.getPaymentChannelId() == null
            ? mainConfig.getPaymentChannel().getCashId()
            : transactionDTO.getPaymentChannelId();
        setPaymentChannel(transaction, paymentChannelId);
        transaction.setReference(transactionDTO.getReference());
        Integer statusId = transactionDTO.getStatusId() == null
            ? mainConfig.getStatus().getCompleteId()
            : transactionDTO.getStatusId();
        setStatus(transaction, statusId);
        transaction.setTransactionCode(createTransactionCode());
        setTransactionSource(transaction, transactionDTO.getTransactionSourceId());
        setTransactionType(transaction, transactionDTO.getTransactionTypeId());
        EUser user = sUserDetails.getActiveUserByContact();
        Integer userId = transactionDTO.getUserId() == null
            ? user.getId()
            : transactionDTO.getUserId();
        setUser(transaction, userId);

        save(transaction);
        setCustomerTransaction(transaction, transactionDTO.getCustomerTransaction());
        setTransactionExpense(transaction, transactionDTO.getTransactionExpense());
        setTransactionIncome(transaction, transactionDTO.getTransactionIncome());
        setTransactionItem(transaction, transactionDTO.getTransactionItem());
        return transaction;
    }

    private String createTransactionCode() {
        // Get the last transaction code
        String lastTransactionCode = transactionDAO.findLastTransactionCode();

        // Extract the numeric part
        int lastNumber = lastTransactionCode == null ? 0 : Integer.parseInt(lastTransactionCode.replace("TXN", ""));
        int nextNumber = lastNumber + 1;

        return "TXN" + nextNumber;
    }

    @Override
    public Optional<ETransaction> getById(Integer transactionId) {
        return transactionDAO.findById(transactionId);
    }

    @Override
    public ETransaction getById(Integer transactionId, Boolean handleNotFound) {

        Optional<ETransaction> transaction = getById(transactionId);
        if (!transaction.isPresent() && handleNotFound) {
            throw new NotFoundException("transaction with specified id not found", "transactionId");
        }
        return transaction.get();
    }

    @Override
    public Optional<ETransaction> getByIdOrTransactionCode(String transactionValue) {
        Integer transactionId;
        try {
            transactionId = Integer.valueOf(transactionValue);
        } catch (Exception e) {
            transactionId = (Integer) null;
            logger.error("\n[LOCATION] - STransaction.getByIdOrTransactionCode\n[MSG] {}", e.getMessage());
            return getByTransactionCode(transactionValue);
        }
        
        return transactionDAO.findByIdOrTransactionCode(transactionId, transactionValue);
    }

    @Override
    public ETransaction getByIdOrTransactionCode(String transactionValue, Boolean handleNotFound) {

        Optional<ETransaction> transaction = getByIdOrTransactionCode(transactionValue);
        if (!transaction.isPresent() && handleNotFound) {
            throw new NotFoundException("transaction with specified id or transaction code not found", "transactionValue");
        }
        return transaction.get();
    }

    @Override
    public Optional<ETransaction> getByTransactionCode(String transactionCode) {
        return transactionDAO.findByTransactionCode(transactionCode);
    }

    @Override
    public List<ETransaction> getFilteredList(String searchQuery) {
        return transactionDAO.findAll(buildFilterSpec(searchQuery));
    }

    @Override
    public Page<ETransaction> getPaginatedList(PageDTO pageDTO) {

        String search = pageDTO.getSearch();

        PageRequest pageRequest = PageRequest.of(pageDTO.getPageNumber(), pageDTO.getPageSize(), 
            Sort.by(pageDTO.getDirection(), pageDTO.getSortVal()));

        return transactionDAO.findAll(buildFilterSpec(search), pageRequest);
    }

    @EventListener
    public void handleExpenseCreated(ExpenseCreatedEvent event) {
        EExpense expense = event.getExpense();
        ETransaction transaction = new ETransaction();
        transaction.setAmount(expense.getAmount());
        transaction.setCreatedOn(LocalDateTime.now());
        transaction.setDescription(expense.getDescription());
        String reference = String.format("Expense id: %s", expense.getId());
        transaction.setReference(reference);
        String transactionCode = String.format("%s", System.currentTimeMillis());
        transaction.setTransactionCode(transactionCode);
        Integer transactionTypeId = mainConfig.getTransaction().getType().getExpenseId();
        setTransactionType(transaction, transactionTypeId);

        save(transaction);

        TransactionExpenseDTO transactionExpenseDTO = new TransactionExpenseDTO();
        transactionExpenseDTO.setExpenseId(expense.getId());
        setTransactionExpense(transaction, transactionExpenseDTO);
    }

    @EventListener
    public void handleIncomeCreated(IncomeCreatedEvent event) {
        EIncome income = event.getIncome();
        ETransaction transaction = new ETransaction();
        transaction.setAmount(income.getAmount());
        transaction.setCreatedOn(LocalDateTime.now());
        transaction.setDescription(income.getDescription());
        String reference = String.format("Income id: %s", income.getId());
        transaction.setReference(reference);
        String transactionCode = String.format("%s", System.currentTimeMillis());
        transaction.setTransactionCode(transactionCode);
        Integer transactionTypeId = mainConfig.getTransaction().getType().getIncomeId();
        setTransactionType(transaction, transactionTypeId);

        save(transaction);

        TransactionIncomeDTO transactionIncomeDTO = new TransactionIncomeDTO();
        transactionIncomeDTO.setIncomeId(income.getId());
        setTransactionIncome(transaction, transactionIncomeDTO);
    }

    @EventListener
    public void handleItemCreated(ItemCreatedEvent event) {
        try{
            EItem item = event.getItem();
            TransactionDTO transactionDTO = new TransactionDTO();
            transactionDTO.setAmount(item.getPrice());
            String description = String.format("Item created. Id: %s", item.getId());
            transactionDTO.setDescription(description);
            String reference = String.format("PUR%s", System.currentTimeMillis());
            transactionDTO.setReference(reference);
            Integer transactionTypeId = mainConfig.getTransaction().getType().getPurchaseId();
            transactionDTO.setTransactionTypeId(transactionTypeId);
            create(transactionDTO);
        } catch(Exception e) {
            logger.error("\n[LOCATION] - STransaction.handleItemCreated\n[MSG] {}", e.getMessage());
        }
    }

    @Override
    public void save(ETransaction transaction) {
        transactionDAO.save(transaction);
    }

    private void setCustomerTransaction(ETransaction transaction, CustomerTransactionDTO customerTransactionDTO) {
        if (customerTransactionDTO == null) { return; }

        ECustomer customer = sCustomer.getById(customerTransactionDTO.getCustomerId(), true);
        ECustomerTransaction customerTransaction = sCustomerTransaction.create(customer, transaction);
        transaction.setCustomerTransaction(customerTransaction);
    }

    private void setPaymentChannel(ETransaction transaction, Integer paymentChannelId) {

        if (paymentChannelId != null) {
            EPaymentChannel paymentChannel = sPaymentChannel.getById(paymentChannelId, true);
            transaction.setPaymentChannel(paymentChannel);
        }
    }

    private void setStatus(ETransaction transaction, Integer statusId) {
        if (statusId == null) { return; }

        EStatus status = sStatus.getById(statusId, true);
        transaction.setStatus(status);
    }

    private void setTransactionExpense(ETransaction transaction, TransactionExpenseDTO transactionExpenseDTO) {
        if (transactionExpenseDTO == null) { return; }

        EExpense expense = sExpense.getById(transactionExpenseDTO.getExpenseId(), true);
        ETransactionExpense transactionExpense = sTransactionExpense.create(transaction, expense);
        transaction.setTransactionExpense(transactionExpense);
    }

    private void setTransactionIncome(ETransaction transaction, TransactionIncomeDTO transactionIncomeDTO) {
        if (transactionIncomeDTO == null) { return; }

        EIncome income = sIncome.getById(transactionIncomeDTO.getIncomeId(), true);
        ETransactionIncome transactionIncome = sTransactionIncome.create(transaction, income);
        transaction.setTransactionIncome(transactionIncome);
    }

    private void setTransactionItem(ETransaction transaction, TransactionItemDTO transactionItemDTO) {
        if (transactionItemDTO == null) { return; }

        EItem item = sItem.getById(transactionItemDTO.getItemId(), true);
        ETransactionItem existingTransactionItem = sTransactionItem.getByTransactionAndItem(transaction.getId(), item.getId());
        if (existingTransactionItem != null) {
            transaction.setTransactionItem(existingTransactionItem);
        } else {
            ETransactionItem transactionItem = sTransactionItem.create(transaction, item);
            transaction.setTransactionItem(transactionItem);
        }
    }

    private void setTransactionSource(ETransaction transaction, Integer transactionSourceId) {
        
        if (transactionSourceId != null) {
            ETransactionSource transactionSource = sTransactionSource.getById(transactionSourceId, true);
            transaction.setTransactionSource(transactionSource);
        }
    }

    private void setTransactionType(ETransaction transaction, Integer transactionTypeId) {
        if (transactionTypeId == null) { return; }

        ETransactionType transactionType = sTransactionType.getById(transactionTypeId, true);
        transaction.setTransactionType(transactionType);
    }

    private void setUser(ETransaction transaction, Integer userId) {

        if (userId != null) {
            EUser user = sUser.getById(userId, true);
            transaction.setUser(user);
        }
    }

    @Override
    public ETransaction update(String transactionValue, TransactionDTO transactionDTO) throws IllegalAccessException, 
            IllegalArgumentException, InvocationTargetException, NoSuchMethodException, SecurityException {

        ETransaction transaction = getByIdOrTransactionCode(transactionValue, true);

        String[] fields = {"Amount", "Description", "Reference"};
        for (String field : fields) {
            Method getField = TransactionDTO.class.getMethod(String.format("get%s", field));
            Object fieldValue = getField.invoke(transactionDTO);

            if (fieldValue != null) {
                fieldValue = fieldValue.getClass().equals(String.class) ? ((String) fieldValue).trim() : fieldValue;
                ETransaction.class.getMethod("set" + field, fieldValue.getClass()).invoke(transaction, fieldValue);
            }
        }

        setCustomerTransaction(transaction, transactionDTO.getCustomerTransaction());
        setPaymentChannel(transaction, transactionDTO.getPaymentChannelId());
        setStatus(transaction, transactionDTO.getStatusId());
        setTransactionItem(transaction, transactionDTO.getTransactionItem());
        setTransactionSource(transaction, transactionDTO.getTransactionSourceId());
        setTransactionType(transaction, transactionDTO.getTransactionTypeId());
        transaction.setUpdatedOn(LocalDateTime.now());

        save(transaction);
        return transaction;
    }
    
}
