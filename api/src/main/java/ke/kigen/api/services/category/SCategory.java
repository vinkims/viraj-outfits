package ke.kigen.api.services.category;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import ke.kigen.api.dtos.category.CategoryDTO;
import ke.kigen.api.dtos.general.PageDTO;
import ke.kigen.api.exceptions.NotFoundException;
import ke.kigen.api.models.category.ECategory;
import ke.kigen.api.repositories.category.CategoryDAO;
import ke.kigen.api.specifications.SpecBuilder;
import ke.kigen.api.specifications.SpecFactory;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class SCategory implements ICategory {
    
    private final CategoryDAO categoryDAO;

    private final SpecFactory specFactory;

    @Override
    @SuppressWarnings("unchecked")
    public Specification<ECategory> buildFilterSpec(String searchQuery) {
        
        SpecBuilder<ECategory> specBuilder = new SpecBuilder<>();

        specBuilder = (SpecBuilder<ECategory>) specFactory.generateSpecification(
            searchQuery, specBuilder, ALLOWED_FIELDS);

        return specBuilder.build();
    }

    @Override
    public ECategory create(CategoryDTO categoryDTO) {
        ECategory category = new ECategory();
        category.setDescription(categoryDTO.getDescription());
        category.setName(categoryDTO.getName());

        save(category);
        return category;
    }

    @Override
    public Boolean checkExistsByName(String name) {
        return categoryDAO.existsByName(name);
    }

    @Override
    public Optional<ECategory> getById(Integer categoryId) {
        return categoryDAO.findById(categoryId);
    }

    @Override
    public ECategory getById(Integer categoryId, Boolean handleNotFound) {
        
        Optional<ECategory> category = getById(categoryId);
        if (!category.isPresent() && handleNotFound) {
            throw new NotFoundException("category with specified id not found", "categoryId");
        }
        return category.get();
    }

    @Override
    public List<ECategory> getFilteredList(String searchQuery) {
        return categoryDAO.findAll(buildFilterSpec(searchQuery));
    }

    @Override
    public Page<ECategory> getPaginatedList(PageDTO pageDTO) {
        
        String search = pageDTO.getSearch();

        PageRequest pageRequest = PageRequest.of(pageDTO.getPageNumber(), pageDTO.getPageSize(), 
            Sort.by(pageDTO.getDirection(), pageDTO.getSortVal()));

        return categoryDAO.findAll(buildFilterSpec(search), pageRequest);
    }

    @Override
    public void save(ECategory category) {
        categoryDAO.save(category);
    }

    @Override
    public ECategory update(Integer categoryId, CategoryDTO categoryDTO) {
        ECategory category = getById(categoryId, true);
        if (categoryDTO.getDescription() != null) {
            category.setDescription(categoryDTO.getDescription());
        }
        if (categoryDTO.getName() != null) {
            category.setName(categoryDTO.getName());
        }

        save(category);
        return category;
    }
}
