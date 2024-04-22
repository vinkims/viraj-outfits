package ke.kigen.api.configs.properties.admin;

import org.springframework.boot.context.properties.ConfigurationProperties;

import lombok.Data;

@ConfigurationProperties(prefix = "admin")
@Data
public class AdminConfig {
    
    private String email;

    private String password;
}
