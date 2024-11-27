package ke.kigen.api.repositories.sales;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import ke.kigen.api.models.sales.ESaleType;

public interface SaleTypeDAO extends JpaRepository<ESaleType, Integer>, JpaSpecificationExecutor<ESaleType> {
    
    Boolean existsByName(String name);
}
