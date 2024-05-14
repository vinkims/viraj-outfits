package ke.kigen.api.services.expense;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.jpa.domain.Specification;

import ke.kigen.api.dtos.expense.ExpenseDTO;
import ke.kigen.api.dtos.general.PageDTO;
import ke.kigen.api.models.expense.EExpense;

public interface IExpense {
    
    final List<String> ALLOWED_FIELDS = List.of(
        "amount",
        "createdOn",
        "expenseType.id",
        "expenseType.name",
        "status.id",
        "status.name",
        "updatedOn",
        "user.id"
    );

    Specification<EExpense> buildFilterSpec(String searchQuery);

    EExpense create(ExpenseDTO expenseDTO);

    Optional<EExpense> getById(Integer expenseId);

    EExpense getById(Integer expenseId, Boolean handleNotFound);

    List<EExpense> getFilteredList(String searchQuery);

    Page<EExpense> getPaginatedList(PageDTO pageDTO);

    void save(EExpense expense);

    EExpense update(Integer expenseId, ExpenseDTO expenseDTO);
}
