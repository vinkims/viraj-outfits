package ke.kigen.api.configs.properties.transaction;

import org.springframework.boot.context.properties.ConfigurationProperties;

import lombok.Data;

@ConfigurationProperties(prefix = "source")
@Data
public class SourceConfig {

    private Integer adjustmentId;
    
    private Integer manualId;

    private Integer onlineId;

    private Integer walkInId;

    public SourceConfig() {
        setAdjustmentId(4);
        setManualId(3);
        setOnlineId(2);
        setWalkInId(1);
    }
}
