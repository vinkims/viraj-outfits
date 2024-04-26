package ke.kigen.api.models.role;

import java.io.Serializable;
import java.util.Objects;

import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.MapsId;
import ke.kigen.api.models.permission.EPermission;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity(name = "role_permissions")
@Data
@NoArgsConstructor
public class ERolePermission implements Serializable {
    
    private static final long serialVersionUID = 1L;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "permission_id", referencedColumnName = "id")
    @MapsId(value = "permissionId")
    private EPermission permission;

    @EmbeddedId
    private PKRolePermission pkRolePermission;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "role_id", referencedColumnName = "id")
    @MapsId(value = "roleId")
    private ERole role;

    public ERolePermission(ERole role, EPermission permission) {
        setPermission(permission);
        setRole(role);
        setPkRolePermission(new PKRolePermission(role.getId(), permission.getId()));
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(pkRolePermission);
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

        return Objects.equals(pkRolePermission, ((ERolePermission) object).getPkRolePermission());
    }
}
