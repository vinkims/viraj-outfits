package ke.kigen.api.configs.properties.user;

import org.springframework.boot.context.properties.ConfigurationProperties;

import lombok.Data;

@ConfigurationProperties(prefix = "user")
@Data
public class UserConfig {
    
    private String apiClient;
}
