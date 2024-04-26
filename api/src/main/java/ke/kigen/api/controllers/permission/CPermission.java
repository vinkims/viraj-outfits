package ke.kigen.api.controllers.permission;

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
import ke.kigen.api.dtos.permission.PermissionDTO;
import ke.kigen.api.models.permission.EPermission;
import ke.kigen.api.responses.SuccessPaginatedResponse;
import ke.kigen.api.responses.SuccessResponse;
import ke.kigen.api.services.permission.IPermission;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping(path = "/permission")
@RequiredArgsConstructor
public class CPermission {
    
    private final IPermission sPermission;

    @PostMapping(path = "", consumes = "application/json", produces = "application/json")
    public ResponseEntity<SuccessResponse> createPermission(@Valid @RequestBody PermissionDTO permissionDTO) 
            throws URISyntaxException {

        EPermission permission = sPermission.create(permissionDTO);

        return ResponseEntity
            .created(new URI("/" + permission.getId()))
            .body(new SuccessResponse(201, "successfully created permission", new PermissionDTO(permission)));
    }

    @GetMapping(path = "", produces = "application/json")
    public ResponseEntity<SuccessPaginatedResponse> getPaginatedList(@RequestParam Map<String, Object> params) 
            throws InstantiationException, IllegalAccessException, IllegalArgumentException, InvocationTargetException, 
            NoSuchMethodException, SecurityException {

        PageDTO pageDTO = new PageDTO(params);

        Page<EPermission> permissions = sPermission.getPaginatedList(pageDTO);

        return ResponseEntity
            .ok()
            .body(new SuccessPaginatedResponse(200, "successfully fetched permissions", permissions, 
                PermissionDTO.class, EPermission.class));
    }

    @GetMapping(path = "/{permissionId}", produces = "application/json")
    public ResponseEntity<SuccessResponse> getPermission(@PathVariable Integer permissionId) {

        EPermission permission = sPermission.getById(permissionId, true);

        return ResponseEntity
            .ok()
            .body(new SuccessResponse(200, "successfully fetched permission", new PermissionDTO(permission)));
    }

    @PatchMapping(path = "/{permissionId}", consumes = "application/json", produces = "application/json")
    public ResponseEntity<SuccessResponse> updatePermission(@PathVariable Integer permissionId, @Valid @RequestBody PermissionDTO permissionDTO) 
            throws IllegalAccessException, IllegalArgumentException, InvocationTargetException, NoSuchMethodException, SecurityException {

        EPermission permission = sPermission.update(permissionId, permissionDTO);

        return ResponseEntity
            .ok()
            .body(new SuccessResponse(200, "successfully updated permission", new PermissionDTO(permission)));
    }
}
