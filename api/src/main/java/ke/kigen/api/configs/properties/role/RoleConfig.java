package ke.kigen.api.configs.properties.role;

import org.springframework.boot.context.properties.ConfigurationProperties;

import lombok.Data;

@ConfigurationProperties(prefix = "role")
@Data
public class RoleConfig {
    
    private Integer adminId;

    private Integer apiClientId;

    private Integer attendantId;

    private Integer systemAdminId;

    public RoleConfig() {
        setAdminId(2);
        setApiClientId(4);
        setAttendantId(3);
        setSystemAdminId(1);
    }
}
