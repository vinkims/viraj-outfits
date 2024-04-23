package ke.kigen.api.services.category;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import ke.kigen.api.dtos.general.PageDTO;
import ke.kigen.api.models.category.ECategory;
import ke.kigen.api.specifications.SpecBuilder;
import ke.kigen.api.specifications.SpecFactory;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class SCategoryListing extends SBaseCategory implements ICategoryListing {
    
    private final SpecFactory specFactory;

    @Override
    public Specification<ECategory> buildFilterSpec(String searchQuery) {

        SpecBuilder<ECategory> specBuilder = new SpecBuilder();

        specBuilder = (SpecBuilder<ECategory>) specFactory.generateSpecification(searchQuery, 
            specBuilder, ALLOWED_FIELDS);

        return specBuilder.build();
    }

    @Override
    public Boolean checkExistsByName(String name) {
        return categoryDAO.existsByName(name);
    }

    @Override
    public Optional<ECategory> getById(Integer categoryId) {
        return super.getById(categoryId);
    }

    @Override
    public ECategory getById(Integer categoryId, Boolean handleNotFound) {
        return super.getById(categoryId, handleNotFound);
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
}
