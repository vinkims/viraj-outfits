package ke.kigen.api.repositories.expense;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import ke.kigen.api.models.expense.EExpenseType;

public interface ExpensTypeDAO extends JpaRepository<EExpenseType, Integer>, JpaSpecificationExecutor<EExpenseType> {
    
    Boolean existsByName(String name);
}
