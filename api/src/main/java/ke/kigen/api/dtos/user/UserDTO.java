package ke.kigen.api.dtos.user;

import java.time.LocalDateTime;

import ke.kigen.api.dtos.role.RoleDTO;
import ke.kigen.api.dtos.status.StatusDTO;
import ke.kigen.api.models.user.EUser;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class UserDTO {
    
    private Integer id;

    private String firstName;

    private String middleName;

    private String lastName;

    private String password;

    private LocalDateTime createdOn;

    private LocalDateTime updatedOn;

    private LocalDateTime lastActiveOn;

    private RoleDTO role;

    private Integer roleId;

    private StatusDTO status;

    private Integer statusId;

    public UserDTO(EUser user) {
        setCreatedOn(user.getCreatedOn());
        setFirstName(user.getFirstName());
        setId(user.getId());
        setLastActiveOn(user.getLastActiveOn());
        setLastName(user.getLastName());
        setMiddleName(user.getMiddleName());
        if (user.getRole() != null) {
            setRole(new RoleDTO(user.getRole()));
        }
        if (user.getStatus() != null) {
            setStatus(new StatusDTO(user.getStatus()));
        }
        setUpdatedOn(user.getUpdatedOn());
    }
}
