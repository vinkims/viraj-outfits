package ke.kigen.api.dtos.user;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonInclude.Include;

import jakarta.validation.Valid;
import ke.kigen.api.dtos.contacts.ContactDTO;
import ke.kigen.api.dtos.role.RoleDTO;
import ke.kigen.api.dtos.status.StatusDTO;
import ke.kigen.api.models.contacts.EContact;
import ke.kigen.api.models.user.EUser;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@JsonInclude(value = Include.NON_NULL)
public class UserDTO {
    
    private Integer id;

    private String firstName;

    private String middleName;

    private String lastName;

    private List<@Valid ContactDTO> contacts;

    private String password;

    private LocalDateTime createdOn;

    private LocalDateTime updatedOn;

    private LocalDateTime lastActiveOn;

    private RoleDTO role;

    private Integer roleId;

    private StatusDTO status;

    private Integer statusId;

    public UserDTO(EUser user) {
        setContactData(user.getContacts());
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

    private void setContactData(List<EContact> contactList) {
        if (contactList == null || contactList.isEmpty()) {
            return;
        }
        contacts = new ArrayList<>();
        for (EContact contact : contactList) {
            contacts.add(new ContactDTO(contact));
        }
    }
}
