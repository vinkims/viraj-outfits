package ke.kigen.api.configs.properties.sale;

import org.springframework.boot.context.properties.ConfigurationProperties;

import lombok.Data;

@ConfigurationProperties(prefix = "sale")
@Data
public class SaleConfig {
    
    private TypeConfig type;

    public SaleConfig() {
        setType(new TypeConfig());
    }
}
