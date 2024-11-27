package ke.kigen.api.dtos.sales;

import ke.kigen.api.annotations.IsSaleTypeNameValid;
import ke.kigen.api.models.sales.ESaleType;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class SaleTypeDTO {
    
    private Integer id;

    @IsSaleTypeNameValid
    private String name;

    private String description;

    public SaleTypeDTO(ESaleType saleType) {
        setDescription(saleType.getDescrition());
        setId(saleType.getId());
        setName(saleType.getName());
    }
}
