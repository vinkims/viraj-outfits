package ke.kigen.api.configs.properties.status;

import org.springframework.boot.context.properties.ConfigurationProperties;

import lombok.Data;

@ConfigurationProperties(prefix = "status")
@Data
public class StatusConfig {
    
    private Integer activeId;

    private Integer canceledId;

    private Integer completeId;

    private Integer failedId;

    private Integer inactiveId;

    private Integer partialId;

    private Integer pendingId;

    private Integer rejectedId;

    private Integer soldId;

    public StatusConfig() {
        setActiveId(1);
        setCanceledId(7);
        setCompleteId(4);
        setFailedId(5);
        setInactiveId(2);
        setPartialId(8);
        setPendingId(3);
        setRejectedId(6);
        setSoldId(9);
    }
}
