package ke.kigen.api.repositories.category;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import ke.kigen.api.models.category.ECategory;

public interface CategoryDAO extends JpaRepository<ECategory, Integer>, JpaSpecificationExecutor<ECategory> {
    
    Boolean existsByName(String name);
}
