package ke.kigen.api.controllers.role;

import java.lang.reflect.InvocationTargetException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.Map;

import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
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
import ke.kigen.api.dtos.role.RoleDTO;
import ke.kigen.api.models.role.ERole;
import ke.kigen.api.responses.SuccessPaginatedResponse;
import ke.kigen.api.responses.SuccessResponse;
import ke.kigen.api.services.role.IRole;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping(path = "/role")
@RequiredArgsConstructor
public class CRole {
    
    private final IRole sRole;

    @PostMapping(path = "", consumes = "application/json", produces = "application/json")
    public ResponseEntity<SuccessResponse> createRole(@Valid @RequestBody RoleDTO roleDTO) 
            throws URISyntaxException {

        ERole role = sRole.create(roleDTO);

        return ResponseEntity
            .created(new URI("/" + role.getId()))
            .body(new SuccessResponse(201, "successfully created role", new RoleDTO(role)));
    }

    @GetMapping(path = "", produces = "application/json")
    public ResponseEntity<SuccessPaginatedResponse> getPaginatedList(@RequestParam Map<String, Object> params) 
            throws InstantiationException, IllegalAccessException, IllegalArgumentException, InvocationTargetException, 
            NoSuchMethodException, SecurityException {

        PageDTO pageDTO = new PageDTO(params);
        pageDTO.setSortVal("id");

        Page<ERole> roles = sRole.getPaginatedList(pageDTO);

        return ResponseEntity
            .ok()
            .body(new SuccessPaginatedResponse(200, "successfully fetched roles", 
                roles, RoleDTO.class, ERole.class));
    }

    @GetMapping(path = "/{roleId}", produces = "application/json")
    public ResponseEntity<SuccessResponse> getRole(@PathVariable Integer roleId) {

        ERole role = sRole.getById(roleId, true);

        return ResponseEntity
            .ok()
            .body(new SuccessResponse(200, "successfully fetched role", new RoleDTO(role)));
    }
    
    @PatchMapping(path = "/{roleId}", consumes = "application/json", produces = "application/json")
    public ResponseEntity<SuccessResponse> updateRole(@PathVariable Integer roleId, @Valid @RequestBody RoleDTO roleDTO) {

        ERole role = sRole.update(roleId, roleDTO);

        return ResponseEntity
            .ok()
            .body(new SuccessResponse(200, "successfully updated role", new RoleDTO(role)));
    }

    @PostMapping(path = "/{roleId}/permission", consumes = "application/json", produces = "application/json")
    public ResponseEntity<SuccessResponse> addRolePermissions(@PathVariable Integer roleId, @RequestBody RoleDTO roleDTO) {

        sRole.addRolePermissions(roleId, roleDTO.getRolePermissions());

        return ResponseEntity
            .ok()
            .body(new SuccessResponse(200, "successfully added permission(s) to role", null));
    }

    @DeleteMapping(path = "/{roleId}/permission", consumes = "application/json", produces = "application/json")
    public ResponseEntity<SuccessResponse> removeRolePermissions(@PathVariable Integer roleId, @RequestBody RoleDTO roleDTO) {

        sRole.removeRolePermission(roleId, roleDTO.getRolePermissions());

        return ResponseEntity
            .ok()
            .body(new SuccessResponse(200, "successfully removed permission(s) from role", null));
    }
}
