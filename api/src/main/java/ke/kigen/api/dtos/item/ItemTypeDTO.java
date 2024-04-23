package ke.kigen.api.dtos.item;

import java.time.LocalDateTime;

import ke.kigen.api.annotations.IsItemTypeNameValid;
import ke.kigen.api.dtos.status.StatusDTO;
import ke.kigen.api.models.item.EItemType;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class ItemTypeDTO {
    
    private Integer id;

    @IsItemTypeNameValid
    private String name;

    private String description;

    private LocalDateTime createdOn;

    private LocalDateTime updatedOn;

    private StatusDTO status;

    private Integer statusId;

    public ItemTypeDTO(EItemType itemType) {
        setCreatedOn(itemType.getCreatedOn());
        setDescription(itemType.getDescription());
        setId(itemType.getId());
        setName(itemType.getName());
        setStatus(new StatusDTO(itemType.getStatus()));
        setUpdatedOn(itemType.getUpdatedOn());
    }
}
