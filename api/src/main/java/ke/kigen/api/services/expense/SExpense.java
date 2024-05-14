package ke.kigen.api.services.expense;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import ke.kigen.api.configs.properties.MainConfig;
import ke.kigen.api.dtos.expense.ExpenseDTO;
import ke.kigen.api.dtos.general.PageDTO;
import ke.kigen.api.dtos.payment.TransactionDTO;
import ke.kigen.api.dtos.payment.TransactionExpenseDTO;
import ke.kigen.api.exceptions.NotFoundException;
import ke.kigen.api.models.expense.EExpense;
import ke.kigen.api.models.expense.EExpenseType;
import ke.kigen.api.models.status.EStatus;
import ke.kigen.api.models.user.EUser;
import ke.kigen.api.repositories.expense.ExpenseDAO;
import ke.kigen.api.services.auth.IUserDetails;
import ke.kigen.api.services.payment.transaction.ITransaction;
import ke.kigen.api.services.status.IStatus;
import ke.kigen.api.services.user.IUser;
import ke.kigen.api.specifications.SpecBuilder;
import ke.kigen.api.specifications.SpecFactory;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class SExpense implements IExpense {
    
    private final ExpenseDAO expenseDAO;

    private final IExpenseType sExpenseType;

    private final IStatus sStatus;

    private final ITransaction sTransaction;

    private final IUser sUser;

    private final IUserDetails sUserDetails;

    private final MainConfig mainConfig;

    private final SpecFactory specFactory;

    @Override
    @SuppressWarnings("unchecked")
    public Specification<EExpense> buildFilterSpec(String searchQuery) {

        SpecBuilder<EExpense> specBuilder = new SpecBuilder<>();

        specBuilder = (SpecBuilder<EExpense>) specFactory.generateSpecification(
            searchQuery, specBuilder, ALLOWED_FIELDS);

        return specBuilder.build();
    }

    @Override
    public EExpense create(ExpenseDTO expenseDTO) {
        EExpense expense = new EExpense();
        expense.setAmount(expenseDTO.getAmount());
        expense.setCreatedOn(LocalDateTime.now());
        expense.setDescription(expenseDTO.getDescription());
        setExpenseType(expense, expenseDTO.getExpenseTypeId());
        Integer statusId = expenseDTO.getStatusId() == null 
            ? mainConfig.getStatus().getCompleteId() 
            : expenseDTO.getStatusId();
        setStatus(expense, statusId);
        EUser user = sUserDetails.getActiveUserByContact();
        Integer userId = expenseDTO.getUserId() == null 
            ? user.getId() : expenseDTO.getUserId();
        setUser(expense, userId);

        save(expense);
        createTransaction(expense);
        return expense;
    }

    private void createTransaction(EExpense expense) {
        TransactionDTO transactionDTO = new TransactionDTO();
        transactionDTO.setAmount(expense.getAmount());
        transactionDTO.setDescription(expense.getDescription());
        String reference = String.format("Expense id: %s", expense.getId());
        transactionDTO.setReference(reference);
        String transactionCode = String.format("%s", System.currentTimeMillis());
        transactionDTO.setTransactionCode(transactionCode);
        Integer transactionTypeId = mainConfig.getTransactionType().getExpenseId();
        transactionDTO.setTransactionTypeId(transactionTypeId);

        TransactionExpenseDTO transactionExpenseDTO = new TransactionExpenseDTO();
        transactionExpenseDTO.setExpenseId(expense.getId());
        transactionDTO.setTransactionExpense(transactionExpenseDTO);

        sTransaction.create(transactionDTO);
    }

    @Override
    public Optional<EExpense> getById(Integer expenseId) {
        return expenseDAO.findById(expenseId);
    }

    @Override
    public EExpense getById(Integer expenseId, Boolean handleNotFound) {

        Optional<EExpense> expense = getById(expenseId);
        if (!expense.isPresent() && handleNotFound) {
            throw new NotFoundException("expense with specified id not found", "expenseId");
        }
        return expense.get();
    }

    @Override
    public List<EExpense> getFilteredList(String searchQuery) {
        return expenseDAO.findAll(buildFilterSpec(searchQuery));
    }

    @Override
    public Page<EExpense> getPaginatedList(PageDTO pageDTO) {

        String search = pageDTO.getSearch();

        PageRequest pageRequest = PageRequest.of(pageDTO.getPageNumber(), pageDTO.getPageSize(), 
            Sort.by(pageDTO.getDirection(), pageDTO.getSortVal()));

        return expenseDAO.findAll(buildFilterSpec(search), pageRequest);
    }

    @Override
    public void save(EExpense expense) {
        expenseDAO.save(expense);
    }

    private void setExpenseType(EExpense expense, Integer expenseTypeId) {
        if (expenseTypeId == null) { return; }

        EExpenseType eExpenseType = sExpenseType.getById(expenseTypeId, true);
        expense.setExpenseType(eExpenseType);
    }

    private void setStatus(EExpense expense, Integer statusId) {
        if (statusId == null) { return; }

        EStatus status = sStatus.getById(statusId, true);
        expense.setStatus(status);
    }

    private void setUser(EExpense expense, Integer userId) {
        if (userId == null) { return; }

        EUser user = sUser.getById(userId, true);
        expense.setUser(user);
    }

    @Override
    public EExpense update(Integer expenseId, ExpenseDTO expenseDTO) {
        EExpense expense = getById(expenseId, true);
        if (expenseDTO.getAmount() != null) {
            expense.setAmount(expenseDTO.getAmount());
        }
        if (expenseDTO.getDescription() != null) {
            expense.setDescription(expenseDTO.getDescription());
        }
        setExpenseType(expense, expenseDTO.getExpenseTypeId());
        setStatus(expense, expenseDTO.getStatusId());
        expense.setUpdatedOn(LocalDateTime.now());
        setUser(expense, expenseDTO.getUserId());
        
        save(expense);
        return expense;
    }
}
