package ke.kigen.api.dtos.item;

import java.time.LocalDateTime;

import ke.kigen.api.models.item.EInventory;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class InventoryDTO {
    
    private Integer id;

    private ItemDTO item;

    private Integer itemId;

    private Integer quantity;

    private LocalDateTime createdOn;

    private LocalDateTime updatedOn;

    public InventoryDTO(EInventory inventory) {
        setCreatedOn(inventory.getCreatedOn());
        setId(inventory.getId());
        setItem(new ItemDTO(inventory.getItem()));
        setQuantity(inventory.getQuantity());
        setUpdatedOn(inventory.getUpdatedOn());
    }
}
