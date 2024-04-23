package ke.kigen.api.services.category;

import org.springframework.stereotype.Service;

import ke.kigen.api.dtos.category.CategoryDTO;
import ke.kigen.api.models.category.ECategory;

@Service
public class SCategoryCreate extends SBaseCategory implements ICategoryCreate{

    @Override
    public ECategory create(CategoryDTO categoryDTO) {
        ECategory category = new ECategory();
        category.setDescription(categoryDTO.getDescription());
        category.setName(categoryDTO.getName());

        save(category);
        return category;
    }
    
}
