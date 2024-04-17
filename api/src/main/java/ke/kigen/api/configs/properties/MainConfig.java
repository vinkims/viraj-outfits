package ke.kigen.api.configs.properties;

import org.springframework.boot.context.properties.ConfigurationProperties;

import ke.kigen.api.configs.properties.status.StatusConfig;
import lombok.Data;

@ConfigurationProperties(prefix = "main")
@Data
public class MainConfig {
    
    private StatusConfig status;

    public MainConfig() {
        setStatus(new StatusConfig());
    }
}
