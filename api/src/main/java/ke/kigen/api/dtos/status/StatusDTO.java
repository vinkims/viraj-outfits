package ke.kigen.api.dtos.status;

import ke.kigen.api.models.status.EStatus;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class StatusDTO {
    
    private Integer id;

    private String name;

    private String description;

    public StatusDTO(EStatus status) {
        setDescription(status.getDescription());
        setId(status.getId());
        setName(status.getName());
    }
}
