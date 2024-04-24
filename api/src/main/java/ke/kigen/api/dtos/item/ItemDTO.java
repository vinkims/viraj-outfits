package ke.kigen.api.dtos.item;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import ke.kigen.api.dtos.category.CategoryDTO;
import ke.kigen.api.dtos.status.StatusDTO;
import ke.kigen.api.models.item.EItem;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class ItemDTO {
    
    private Integer id;

    private ItemTypeDTO itemType;

    private Integer itemTypeId;

    private String name;

    private CategoryDTO category;

    private Integer categoryId;

    private String color;

    private String size;

    private BigDecimal price;

    private ImageDTO image;

    private Integer imageId;

    private LocalDateTime createdOn;

    private LocalDateTime updatedOn;

    private StatusDTO status;

    private Integer statusId;

    public ItemDTO(EItem item) {
        setCategory(new CategoryDTO(item.getCategory()));
        setColor(item.getColor());
        setCreatedOn(item.getCreatedOn());
        setId(item.getId());
        setImage(new ImageDTO(item.getImage()));
        setItemType(new ItemTypeDTO(item.getItemType()));
        setName(item.getName());
        setPrice(item.getPrice());
        setSize(item.getSize());
        setStatus(new StatusDTO(item.getStatus()));
        setUpdatedOn(item.getUpdatedOn());
    }
}
