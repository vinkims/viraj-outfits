package ke.kigen.api.services.payment.transaction;

import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.event.EventListener;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import ke.kigen.api.configs.properties.MainConfig;
import ke.kigen.api.dtos.general.PageDTO;
import ke.kigen.api.dtos.payment.TransactionDTO;
import ke.kigen.api.dtos.payment.TransactionExpenseDTO;
import ke.kigen.api.dtos.payment.TransactionIncomeDTO;
import ke.kigen.api.events.ExpenseCreatedEvent;
import ke.kigen.api.events.IncomeCreatedEvent;
import ke.kigen.api.exceptions.NotFoundException;
import ke.kigen.api.models.expense.EExpense;
import ke.kigen.api.models.income.EIncome;
import ke.kigen.api.models.payment.ETransaction;
import ke.kigen.api.models.payment.ETransactionExpense;
import ke.kigen.api.models.payment.ETransactionIncome;
import ke.kigen.api.models.payment.ETransactionType;
import ke.kigen.api.models.status.EStatus;
import ke.kigen.api.repositories.payment.TransactionDAO;
import ke.kigen.api.services.expense.IExpense;
import ke.kigen.api.services.income.IIncome;
import ke.kigen.api.services.payment.transaction_type.ITransactionType;
import ke.kigen.api.services.status.IStatus;
import ke.kigen.api.specifications.SpecBuilder;
import ke.kigen.api.specifications.SpecFactory;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class STransaction implements ITransaction {

    Logger logger = LoggerFactory.getLogger(STransaction.class);

    private final IExpense sExpense;

    private final IIncome sIncome;

    private final IStatus sStatus;

    private final ITransactionExpense sTransactionExpense;

    private final ITransactionIncome sTransactionIncome;

    private final ITransactionType sTransactionType;

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
        transaction.setReference(transactionDTO.getReference());
        Integer statusId = transactionDTO.getStatusId() == null
            ? mainConfig.getStatus().getCompleteId()
            : transactionDTO.getStatusId();
        setStatus(transaction, statusId);
        transaction.setTransactionCode(transactionDTO.getTransactionCode());
        setTransactionType(transaction, transactionDTO.getTransactionTypeId());

        save(transaction);
        setTransactionExpense(transaction, transactionDTO.getTransactionExpense());
        setTransactionIncome(transaction, transactionDTO.getTransactionIncome());
        return transaction;
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
        Integer transactionTypeId = mainConfig.getTransactionType().getExpenseId();
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
        Integer transactionTypeId = mainConfig.getTransactionType().getIncomeId();
        setTransactionType(transaction, transactionTypeId);

        save(transaction);

        TransactionIncomeDTO transactionIncomeDTO = new TransactionIncomeDTO();
        transactionIncomeDTO.setIncomeId(income.getId());
        setTransactionIncome(transaction, transactionIncomeDTO);
    }

    @Override
    public void save(ETransaction transaction) {
        transactionDAO.save(transaction);
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

    private void setTransactionType(ETransaction transaction, Integer transactionTypeId) {
        if (transactionTypeId == null) { return; }

        ETransactionType transactionType = sTransactionType.getById(transactionTypeId, true);
        transaction.setTransactionType(transactionType);
    }

    @Override
    public ETransaction update(String transactionValue, TransactionDTO transactionDTO) throws IllegalAccessException, 
            IllegalArgumentException, InvocationTargetException, NoSuchMethodException, SecurityException {

        ETransaction transaction = getByIdOrTransactionCode(transactionValue, true);

        String[] fields = {"Amount", "Description", "Reference", "TransactionCode"};
        for (String field : fields) {
            Method getField = TransactionDTO.class.getMethod(String.format("get%s", field));
            Object fieldValue = getField.invoke(transactionDTO);

            if (fieldValue != null) {
                fieldValue = fieldValue.getClass().equals(String.class) ? ((String) fieldValue).trim() : fieldValue;
                ETransaction.class.getMethod("set" + field, fieldValue.getClass()).invoke(transaction, fieldValue);
            }
        }

        setStatus(transaction, transactionDTO.getStatusId());
        setTransactionType(transaction, transactionDTO.getTransactionTypeId());
        transaction.setUpdatedOn(LocalDateTime.now());

        save(transaction);
        return transaction;
    }
    
}
