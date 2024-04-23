package ke.kigen.api.services.category;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.jpa.domain.Specification;

import ke.kigen.api.dtos.category.CategoryDTO;
import ke.kigen.api.dtos.general.PageDTO;
import ke.kigen.api.models.category.ECategory;

public interface ICategory {

    final List<String> ALLOWED_FIELDS = List.of();

    Specification<ECategory> buildFilterSpec(String searchQuery);

    Boolean checkExistsByName(String name);

    ECategory create(CategoryDTO categoryDTO);

    Optional<ECategory> getById(Integer categoryId);

    ECategory getById(Integer categoryId, Boolean handleNotFound);

    List<ECategory> getFilteredList(String searchQuery);

    Page<ECategory> getPaginatedList(PageDTO pageDTO);
    
    void save(ECategory category);

    ECategory update(Integer categoryId, CategoryDTO categoryDTO);
}
