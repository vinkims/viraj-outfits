package ke.kigen.api.configs.properties.transaction;

import org.springframework.boot.context.properties.ConfigurationProperties;

import lombok.Data;

@ConfigurationProperties(prefix = "transaction")
@Data
public class TransactionConfig {
    
    private SourceConfig source;

    private TypeConfig type;

    public TransactionConfig() {
        setSource(new SourceConfig());
        setType(new TypeConfig());
    }
}
