package ke.kigen.api.configs.properties.sale;

import org.springframework.boot.context.properties.ConfigurationProperties;

import lombok.Data;

@ConfigurationProperties(prefix = "type")
@Data
public class TypeConfig {
    
    private Integer onlineId;

    private Integer retailId;

    private Integer wholesaleId;

    public TypeConfig() {
        setOnlineId(3);
        setRetailId(1);
        setWholesaleId(2);
    }
}
