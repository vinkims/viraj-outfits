package ke.kigen.api.configs.properties.logging;

import java.util.List;

import org.springframework.boot.context.properties.ConfigurationProperties;

import lombok.Data;

@ConfigurationProperties(prefix = "logging")
@Data
public class LoggingConfig {

    private List<String> allowedMethods;
    
    private Boolean logRequest;

    private Boolean logResponse;
}
