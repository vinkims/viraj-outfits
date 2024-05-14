package ke.kigen.api.repositories.income;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import ke.kigen.api.models.income.EIncomeType;

public interface IncomeTypeDAO extends JpaRepository<EIncomeType, Integer>, JpaSpecificationExecutor<EIncomeType> {
    
    Boolean existsByName(String name);
}
