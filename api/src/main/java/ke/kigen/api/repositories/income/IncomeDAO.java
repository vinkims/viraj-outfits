package ke.kigen.api.repositories.income;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import ke.kigen.api.models.income.EIncome;

public interface IncomeDAO extends JpaRepository<EIncome, Integer>, JpaSpecificationExecutor<EIncome> {
    
}
