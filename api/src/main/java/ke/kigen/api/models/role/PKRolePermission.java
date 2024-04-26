package ke.kigen.api.models.role;

import java.io.Serializable;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.Data;
import lombok.NoArgsConstructor;

@Embeddable
@Data
@NoArgsConstructor
public class PKRolePermission implements Serializable {
    
    private static final long serialVersionUID = 1L;
    
    @Column(name = "role_id")
    private Integer roleId;

    @Column(name = "permission_id")
    private Integer permissionId;

    public PKRolePermission(Integer roleId, Integer permissionId) {
        setPermissionId(permissionId);
        setRoleId(roleId);
    }

    @Override
    public int hashCode() {
        int hash = 31 + ((roleId == null) ? 0 : roleId.hashCode());
        hash *= 31 + ((permissionId == null) ? 0 : permissionId.hashCode());
        return hash;
    }

    @Override
    public boolean equals(Object object) {
        if (this == object) {
            return true;
        }
        if (object == null) {
            return false;
        }
        if (object.getClass() != getClass()) {
            return false;
        }

        PKRolePermission pkRolePermission = (PKRolePermission) object;

        if (roleId == null && pkRolePermission.getRoleId() != null) {
            return false;
        }
        if (permissionId == null && pkRolePermission.getPermissionId() != null) {
            return false;
        }

        return true;
    }
}
