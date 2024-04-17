package ke.kigen.api.services.status;

import org.springframework.stereotype.Service;

import ke.kigen.api.dtos.status.StatusDTO;
import ke.kigen.api.models.status.EStatus;

@Service
public class SStatusCreate extends SBaseStatus implements IStatusCreate {

    @Override
    public EStatus create(StatusDTO statusDTO) {
        EStatus status = new EStatus();
        status.setDescription(statusDTO.getDescription());
        status.setName(statusDTO.getName());

        save(status);
        return status;
    }
    
}
