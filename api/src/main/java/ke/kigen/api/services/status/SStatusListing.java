package ke.kigen.api.services.status;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import ke.kigen.api.dtos.general.PageDTO;
import ke.kigen.api.models.status.EStatus;
import ke.kigen.api.specifications.SpecBuilder;
import ke.kigen.api.specifications.SpecFactory;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class SStatusListing extends SBaseStatus implements IStatusListing {

    private final SpecFactory specFactory;
    
    @Override
    @SuppressWarnings("unchecked")
    public Specification<EStatus> buildFilterSpec(String searchQuery) {

        SpecBuilder<EStatus> specBuilder = new SpecBuilder<>();

        specBuilder = (SpecBuilder<EStatus>) specFactory.generateSpecification(
            searchQuery, specBuilder, ALLOWED_FIELDS);

        return specBuilder.build();
    }

    @Override
    public Boolean checkExistsByName(String name) {
        return statusDAO.existsByName(name);
    }

    @Override
    public Optional<EStatus> getById(Integer statusId) {
        return super.getById(statusId);
    }

    @Override
    public EStatus getById(Integer statusId, Boolean handleNotFound) {
        return super.getById(statusId, handleNotFound);
    }

    @Override
    public List<EStatus> getFilteredList(String searchQuery) {
        return statusDAO.findAll(buildFilterSpec(searchQuery));
    }

    @Override
    public Page<EStatus> getPaginatedList(PageDTO pageDTO) {

        String search = pageDTO.getSearch();

        PageRequest pageRequest = PageRequest.of(pageDTO.getPageNumber(), pageDTO.getPageSize(), 
            Sort.by(pageDTO.getDirection(), pageDTO.getSortVal()));

        return statusDAO.findAll(buildFilterSpec(search), pageRequest);
    }
    
}
