package ke.kigen.api.controllers.user;

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
import ke.kigen.api.dtos.user.UserDTO;
import ke.kigen.api.models.user.EUser;
import ke.kigen.api.responses.SuccessPaginatedResponse;
import ke.kigen.api.responses.SuccessResponse;
import ke.kigen.api.services.user.IUser;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping(path = "/user")
@RequiredArgsConstructor
public class CUser {
    
    private final IUser sUser;

    @PostMapping(path = "", consumes = "application/json", produces = "application/json")
    public ResponseEntity<SuccessResponse> createUser(@Valid @RequestBody UserDTO userDTO) 
            throws URISyntaxException {

        EUser user = sUser.create(userDTO);

        return ResponseEntity
            .created(new URI("/" + user.getId()))
            .body(new SuccessResponse(201, "successfully created user", new UserDTO(user)));
    }

    @GetMapping(path = "", produces = "application/json")
    public ResponseEntity<SuccessPaginatedResponse> getPaginatedList(@RequestParam Map<String, Object> params) 
            throws InstantiationException, IllegalAccessException, IllegalArgumentException, InvocationTargetException, 
            NoSuchMethodException, SecurityException {

        PageDTO pageDTO = new PageDTO(params);

        Page<EUser> users = sUser.getPaginatedList(pageDTO);

        return ResponseEntity
            .ok()
            .body(new SuccessPaginatedResponse(200, "successfully fetched users", users, 
                UserDTO.class, EUser.class));
    }

    @GetMapping(path = "/{userValue}", produces = "application/json")
    public ResponseEntity<SuccessResponse> getUser(@PathVariable String userValue) {

        EUser user = sUser.getByIdOrContactValue(userValue, true);

        return ResponseEntity
            .ok()
            .body(new SuccessResponse(200, "successfully fetched user", new UserDTO(user)));
    }

    @PatchMapping(path = "/{userValue}", consumes = "application/json", produces = "application/json")
    public ResponseEntity<SuccessResponse> updateUser(@PathVariable String userValue, @Valid @RequestBody UserDTO userDTO) 
            throws IllegalAccessException, IllegalArgumentException, InvocationTargetException, NoSuchMethodException, SecurityException {

        EUser user = sUser.update(userValue, userDTO);

        return ResponseEntity
            .ok()
            .body(new SuccessResponse(200, "successfully updated user", new UserDTO(user)));
    }
}
