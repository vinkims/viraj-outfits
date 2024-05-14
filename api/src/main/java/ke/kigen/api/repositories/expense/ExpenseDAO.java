package ke.kigen.api.repositories.expense;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import ke.kigen.api.models.expense.EExpense;

public interface ExpenseDAO extends JpaRepository<EExpense, Integer>, JpaSpecificationExecutor<EExpense> {
    
}
