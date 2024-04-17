package ke.kigen.api.services.status;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import ke.kigen.api.dtos.general.PageDTO;
import ke.kigen.api.dtos.status.StatusDTO;
import ke.kigen.api.models.status.EStatus;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class SStatus implements IStatusCreate, IStatusListing, IStatusUpdate {

    private final IStatusCreate sStatusCreate;

    private final IStatusListing sStatusListing;

    private final IStatusUpdate sStatusUpdate;

    @Override
    public Specification<EStatus> buildFilterSpec(String searchQuery) {
        return sStatusListing.buildFilterSpec(searchQuery);
    }

    @Override
    public Boolean checkExistsByName(String name) {
        return sStatusListing.checkExistsByName(name);
    }

    @Override
    public EStatus create(StatusDTO statusDTO) {
        return sStatusCreate.create(statusDTO);
    }

    @Override
    public Optional<EStatus> getById(Integer statusId) {
        return sStatusListing.getById(statusId);
    }

    @Override
    public EStatus getById(Integer statusId, Boolean handleNotFound) {
        return sStatusListing.getById(statusId, handleNotFound);
    }

    @Override
    public List<EStatus> getFilteredList(String searchQuery) {
        return sStatusListing.getFilteredList(searchQuery);
    }

    @Override
    public Page<EStatus> getPaginatedList(PageDTO pageDTO) {
        return sStatusListing.getPaginatedList(pageDTO);
    }

    @Override
    public EStatus update(Integer statusId, StatusDTO statusDTO) {
        return sStatusUpdate.update(statusId, statusDTO);
    }
    
}
