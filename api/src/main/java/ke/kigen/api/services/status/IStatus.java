package ke.kigen.api.services.status;

import java.util.Optional;

import ke.kigen.api.dtos.status.StatusDTO;
import ke.kigen.api.models.Status.EStatus;

public interface IStatus {
    
    EStatus create(StatusDTO statusDTO);

    Optional<EStatus> getById(Integer statusId);

    EStatus getById(Integer statusId, Boolean handleNotFound);
}
