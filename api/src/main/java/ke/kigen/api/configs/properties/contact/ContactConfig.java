package ke.kigen.api.configs.properties.contact;

import org.springframework.boot.context.properties.ConfigurationProperties;

import lombok.Data;

@ConfigurationProperties(prefix = "contact")
@Data
public class ContactConfig {
    
    private Integer emailTypeId;

    private Integer mobileTypeId;

    public ContactConfig() {
        setEmailTypeId(2);
        setMobileTypeId(1);
    }
}
