package ke.kigen.api.configs.properties;

import org.springframework.boot.context.properties.ConfigurationProperties;

import ke.kigen.api.configs.properties.contact.ContactConfig;
import ke.kigen.api.configs.properties.security.SecurityConfig;
import ke.kigen.api.configs.properties.status.StatusConfig;
import lombok.Data;

@ConfigurationProperties(prefix = "main")
@Data
public class MainConfig {

    private ContactConfig contact;

    private SecurityConfig security;
    
    private StatusConfig status;

    public MainConfig() {
        setContact(new ContactConfig());
        setSecurity(new SecurityConfig());
        setStatus(new StatusConfig());
    }
}
