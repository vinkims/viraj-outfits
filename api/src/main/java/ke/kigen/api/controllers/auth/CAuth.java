package ke.kigen.api.controllers.auth;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;
import ke.kigen.api.dtos.auth.AuthDTO;
import ke.kigen.api.dtos.auth.SignoutDTO;
import ke.kigen.api.responses.SuccessResponse;
import ke.kigen.api.services.auth.IAuth;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping(path = "/auth")
@RequiredArgsConstructor
public class CAuth {
    
    private final IAuth sAuth;

    @PostMapping(path = "/login", consumes = "application/json", produces = "application/json")
    public ResponseEntity<SuccessResponse> authenticateUser(@Valid @RequestBody AuthDTO authDTO) {

        String token = sAuth.authenticateUser(authDTO);

        Map<String, Object> res = new HashMap<>();
        res.put("token", token);

        return ResponseEntity
            .ok()
            .body(new SuccessResponse(200, "successfully authenticated user", res));
    }

    @PostMapping(path = "/logout", consumes = "application/json", produces = "application/json")
    public ResponseEntity<SuccessResponse> signoutUser(@Valid SignoutDTO signoutDTO) {

        Boolean isSignout = sAuth.signoutUser(signoutDTO);

        Map<String, Object> content = new HashMap<>();
        content.put("signout", isSignout);
        content.put("userId", signoutDTO.getUserId());
        content.put("timestamp", new Date().toString());

        return ResponseEntity
            .ok()
            .body(new SuccessResponse(200, "signout successful", content));
    }
}
