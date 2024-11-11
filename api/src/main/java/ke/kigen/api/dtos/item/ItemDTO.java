package ke.kigen.api.dtos.item;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonInclude.Include;

import ke.kigen.api.annotations.IsItemCodeValid;
import ke.kigen.api.dtos.category.CategoryDTO;
import ke.kigen.api.dtos.status.StatusDTO;
import ke.kigen.api.models.item.EItem;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@JsonInclude(value = Include.NON_NULL)
public class ItemDTO {
    
    private Integer id;

    @JsonIgnoreProperties(value = {"createdOn", "updatedOn", "status"})
    private ItemTypeDTO itemType;

    private Integer itemTypeId;

    private String name;

    @IsItemCodeValid
    private String itemCode;

    private CategoryDTO category;

    private Integer categoryId;

    private String color;

    private String size;

    private BigDecimal price;

    private BigDecimal sellingPrice;

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
        if (item.getImage() != null) {
            setImage(new ImageDTO(item.getImage()));
        }
        setItemCode(item.getItemCode());
        setItemType(new ItemTypeDTO(item.getItemType()));
        setName(item.getName());
        setPrice(item.getPrice());
        setSellingPrice(item.getSellingPrice());
        setSize(item.getSize());
        setStatus(new StatusDTO(item.getStatus()));
        setUpdatedOn(item.getUpdatedOn());
    }
}
