package ke.kigen.api.services.status;

import ke.kigen.api.dtos.status.StatusDTO;
import ke.kigen.api.models.status.EStatus;

public interface IStatusCreate {
    
    EStatus create(StatusDTO statusDTO);
}