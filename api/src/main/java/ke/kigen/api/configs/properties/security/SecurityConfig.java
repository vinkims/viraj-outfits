package ke.kigen.api.configs.properties.security;

import org.springframework.boot.context.properties.ConfigurationProperties;

import lombok.Data;

@ConfigurationProperties(prefix = "security")
@Data
public class SecurityConfig {
    
    private String secretKey;

    private Integer tokenValidityPeriod;

    private Integer tokenValidityPeriodSec;

    public SecurityConfig() {
        setTokenValidityPeriod(168);
        setTokenValidityPeriodSec(8760);
    }
}
