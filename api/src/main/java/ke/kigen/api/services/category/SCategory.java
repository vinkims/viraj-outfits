package ke.kigen.api.services.category;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import ke.kigen.api.dtos.category.CategoryDTO;
import ke.kigen.api.dtos.general.PageDTO;
import ke.kigen.api.models.category.ECategory;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class SCategory implements ICategoryCreate, ICategoryListing, ICategoryUpdate {
    
    private final ICategoryCreate sCategoryCreate;

    private final ICategoryListing sCategoryListing;

    private final ICategoryUpdate sCategoryUpdate;

    @Override
    public Specification<ECategory> buildFilterSpec(String searchQuery) {
        return sCategoryListing.buildFilterSpec(searchQuery);
    }

    @Override
    public ECategory create(CategoryDTO categoryDTO) {
        return sCategoryCreate.create(categoryDTO);
    }

    @Override
    public Boolean checkExistsByName(String name) {
        return sCategoryListing.checkExistsByName(name);
    }

    @Override
    public Optional<ECategory> getById(Integer categoryId) {
        return sCategoryListing.getById(categoryId);
    }

    @Override
    public ECategory getById(Integer categoryId, Boolean handleNotFound) {
        return sCategoryListing.getById(categoryId, handleNotFound);
    }

    @Override
    public List<ECategory> getFilteredList(String searchQuery) {
        return sCategoryListing.getFilteredList(searchQuery);
    }

    @Override
    public Page<ECategory> getPaginatedList(PageDTO pageDTO) {
        return sCategoryListing.getPaginatedList(pageDTO);
    }

    @Override
    public ECategory update(Integer categoryId, CategoryDTO categoryDTO) {
        return sCategoryUpdate.update(categoryId, categoryDTO);
    }
}
