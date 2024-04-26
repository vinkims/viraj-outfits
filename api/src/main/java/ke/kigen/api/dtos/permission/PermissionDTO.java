package ke.kigen.api.dtos.permission;

import java.time.LocalDateTime;

import ke.kigen.api.models.permission.EPermission;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class PermissionDTO {
    
    private Integer id;

    private String name;

    private String method;

    private String resource;

    private LocalDateTime createdOn;

    private LocalDateTime updatedOn;

    public PermissionDTO(EPermission permission) {
        setCreatedOn(permission.getCreatedOn());
        setId(permission.getId());
        setMethod(permission.getMethod());
        setName(permission.getName());
        setResource(permission.getResource());
        setUpdatedOn(permission.getUpdatedOn());
    }
}
