package ke.kigen.api.dtos.category;

import ke.kigen.api.annotations.IsCategoryNameValid;
import ke.kigen.api.models.category.ECategory;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class CategoryDTO {
    
    private Integer id;

    @IsCategoryNameValid
    private String name;

    private String description;

    public CategoryDTO(ECategory category) {
        setDescription(category.getDescription());
        setId(category.getId());
        setName(category.getName());
    }
}
