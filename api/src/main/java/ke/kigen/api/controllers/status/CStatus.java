package ke.kigen.api.controllers.status;

import java.lang.reflect.InvocationTargetException;
import java.net.URI;
import java.net.URISyntaxException;

import java.util.Map;

import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;
import ke.kigen.api.dtos.general.PageDTO;
import ke.kigen.api.dtos.status.StatusDTO;
import ke.kigen.api.models.status.EStatus;
import ke.kigen.api.responses.SuccessPaginatedResponse;
import ke.kigen.api.responses.SuccessResponse;
import ke.kigen.api.services.status.SStatus;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping(path = "/status")
@RequiredArgsConstructor
public class CStatus {
    
    private final SStatus sStatus;

    @PostMapping(path = "", consumes = "application/json", produces = "application/json")
    public ResponseEntity<SuccessResponse> createStatus(@Valid @RequestBody StatusDTO statusDTO) 
            throws URISyntaxException {

        EStatus status = sStatus.create(statusDTO);

        return ResponseEntity
            .created(new URI("/" + status.getId()))
            .body(new SuccessResponse(201, "successfully created status", new StatusDTO(status)));
    }

    @GetMapping(path = "", produces = "application/json")
    public ResponseEntity<SuccessPaginatedResponse> getPaginatedlist(@RequestParam Map<String, Object> params) 
            throws InstantiationException, IllegalAccessException, IllegalArgumentException, InvocationTargetException, 
            NoSuchMethodException, SecurityException {

        PageDTO pageDTO = new PageDTO(params);
        pageDTO.setSortVal("id");

        Page<EStatus> statuses = sStatus.getPaginatedList(pageDTO);

        return ResponseEntity
            .ok()
            .body(new SuccessPaginatedResponse(200, "successfully fetched statuses", 
                statuses, StatusDTO.class, EStatus.class));
    }

    @GetMapping(path = "/{statusId}", produces = "application/json")
    public ResponseEntity<SuccessResponse> getStatus(@PathVariable Integer statusId) {

        EStatus status = sStatus.getById(statusId, true);

        return ResponseEntity
            .ok()
            .body(new SuccessResponse(200, "successfully fetched status", new StatusDTO(status)));
    }

    @PatchMapping(path = "/{statusId}", consumes = "application/json", produces = "application/json")
    public ResponseEntity<SuccessResponse> updateStatus(@PathVariable Integer statusId, @Valid @RequestBody StatusDTO statusDTO) {

        EStatus status = sStatus.update(statusId, statusDTO);

        return ResponseEntity
            .ok()
            .body(new SuccessResponse(200, "successfully updated status", new StatusDTO(status)));
    }
}
