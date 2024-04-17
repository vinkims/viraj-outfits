package ke.kigen.api.services.status;

import org.springframework.stereotype.Service;

import ke.kigen.api.dtos.status.StatusDTO;
import ke.kigen.api.models.status.EStatus;

@Service
public class SStatusUpdate extends SBaseStatus implements IStatusUpdate {

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
