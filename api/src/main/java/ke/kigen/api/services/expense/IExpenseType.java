package ke.kigen.api.services.expense;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.jpa.domain.Specification;

import ke.kigen.api.dtos.expense.ExpenseTypeDTO;
import ke.kigen.api.dtos.general.PageDTO;
import ke.kigen.api.models.expense.EExpenseType;

public interface IExpenseType {
    
    final List<String> ALLOWED_FIELDS = List.of();

    Specification<EExpenseType> buildFilterSpec(String searchQuery);

    Boolean checkExistsByName(String name);

    EExpenseType create(ExpenseTypeDTO expenseTypeDTO);

    Optional<EExpenseType> getById(Integer expenseTypeId);

    EExpenseType getById(Integer expenseTypeId, Boolean handleNotFound);

    Page<EExpenseType> getPaginatedList(PageDTO pageDTO);

    void save(EExpenseType expenseType);

    EExpenseType update(Integer expenseTypeId, ExpenseTypeDTO expenseTypeDTO);
}
