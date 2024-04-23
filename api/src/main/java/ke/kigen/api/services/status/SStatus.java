package ke.kigen.api.services.status;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import ke.kigen.api.dtos.general.PageDTO;
import ke.kigen.api.dtos.status.StatusDTO;
import ke.kigen.api.exceptions.NotFoundException;
import ke.kigen.api.models.status.EStatus;
import ke.kigen.api.repositories.status.StatusDAO;
import ke.kigen.api.specifications.SpecBuilder;
import ke.kigen.api.specifications.SpecFactory;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class SStatus implements IStatus {

    private final SpecFactory specFactory;

    private final StatusDAO statusDAO;

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
    public EStatus create(StatusDTO statusDTO) {
        EStatus status = new EStatus();
        status.setDescription(statusDTO.getDescription());
        status.setName(statusDTO.getName());

        save(status);
        return status;
    }

    @Override
    public Optional<EStatus> getById(Integer statusId) {
        return statusDAO.findById(statusId);
    }

    @Override
    public EStatus getById(Integer statusId, Boolean handleNotFound) {
        
        Optional<EStatus> status = getById(statusId);
        if (!status.isPresent() && handleNotFound) {
            throw new NotFoundException("status with specified id not found", "statusId");
        }
        return status.get();
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

    @Override
    public void save(EStatus status) {
        statusDAO.save(status);
    }

    @Override
    public EStatus update(Integer statusId, StatusDTO statusDTO) {
        EStatus status = getById(statusId, true);
        if (statusDTO.getDescription() != null) {
            status.setDescription(statusDTO.getDescription());
        }
        if (statusDTO.getName() != null) {
            status.setName(statusDTO.getName());
        }

        save(status);
        return status;
    }
    
}
