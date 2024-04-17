package ke.kigen.api.controllers.contact;

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
import ke.kigen.api.dtos.contacts.ContactTypeDTO;
import ke.kigen.api.dtos.general.PageDTO;
import ke.kigen.api.models.contacts.EContactType;
import ke.kigen.api.responses.SuccessPaginatedResponse;
import ke.kigen.api.responses.SuccessResponse;
import ke.kigen.api.services.contact.contact_type.SContactType;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping(path = "/contact/type")
@RequiredArgsConstructor
public class CContactType {
    
    private final SContactType sContactType;

    @PostMapping(path = "", consumes = "application/json", produces = "application/json")
    public ResponseEntity<SuccessResponse> createContactType(@Valid @RequestBody ContactTypeDTO contactTypeDTO) 
            throws URISyntaxException {

        EContactType contactType = sContactType.create(contactTypeDTO);

        return ResponseEntity
            .created(new URI("/" + contactType.getId()))
            .body(new SuccessResponse(201, "successfully created contact type", new ContactTypeDTO(contactType)));
    }

    @GetMapping(path = "", produces = "application/json")
    public ResponseEntity<SuccessPaginatedResponse> getPaginatedList(@RequestParam Map<String, Object> params) 
            throws InstantiationException, IllegalAccessException, IllegalArgumentException, InvocationTargetException, 
            NoSuchMethodException, SecurityException {

        PageDTO pageDTO = new PageDTO(params);
        pageDTO.setSortVal("id");

        Page<EContactType> contactTypes = sContactType.getPaginatedList(pageDTO);

        return ResponseEntity
            .ok()
            .body(new SuccessPaginatedResponse(200, "successfully fetched contact types", contactTypes, 
                ContactTypeDTO.class, EContactType.class));
    }

    @GetMapping(path = "/{contactTypeId}", produces = "application/json")
    public ResponseEntity<SuccessResponse> getContactType(@PathVariable Integer contactTypeId) {

        EContactType contactType = sContactType.getById(contactTypeId, true);

        return ResponseEntity
            .ok()
            .body(new SuccessResponse(200, "successfully fetched contact type", new ContactTypeDTO(contactType)));
    }

    @PatchMapping(path = "/{contactTypeId}", consumes = "application/json", produces = "application/json")
    public ResponseEntity<SuccessResponse> updateContactType(@PathVariable Integer contactTypeId, @Valid @RequestBody ContactTypeDTO contactTypeDTO) 
            throws IllegalAccessException, IllegalArgumentException, InvocationTargetException, NoSuchMethodException, SecurityException {

        EContactType contactType = sContactType.update(contactTypeId, contactTypeDTO);

        return ResponseEntity
            .ok()
            .body(new SuccessResponse(200, "successfully updated contact type", new ContactTypeDTO(contactType)));
    }
}
