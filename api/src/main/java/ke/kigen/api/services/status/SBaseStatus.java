package ke.kigen.api.services.status;

import java.util.Optional;

import org.springframework.stereotype.Service;

import ke.kigen.api.exceptions.NotFoundException;
import ke.kigen.api.models.status.EStatus;
import ke.kigen.api.repositories.status.StatusDAO;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class SBaseStatus {
    
    protected final StatusDAO statusDAO;

    public SBaseStatus() {
        this.statusDAO = null;
    }

    protected Optional<EStatus> getById(Integer statusId) {
        return statusDAO.findById(statusId);
    }

    protected EStatus getById(Integer statusId, Boolean handleNotFound) {

        Optional<EStatus> status = getById(statusId);
        if (!status.isPresent() && handleNotFound) {
            throw new NotFoundException("status with specified id not found", "statusId");
        }
        return status.get();
    }

    protected void save(EStatus status) {
        statusDAO.save(status);
    }
}
