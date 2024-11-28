package ke.kigen.api.repositories.sales;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;

import ke.kigen.api.models.sales.ESale;

public interface SaleDAO extends JpaRepository<ESale, Integer>, JpaSpecificationExecutor<ESale> {
    
    Boolean existsBySalesNumber(String salesNumber);

    Optional<ESale> findBySalesNumber(String salesNumber);

    @Query(
        value = "SELECT sales_number FROM sales "
            + "ORDER BY id DESC LIMIT 1",
        nativeQuery = true
    )
    String findLastSalesNumber();
}
