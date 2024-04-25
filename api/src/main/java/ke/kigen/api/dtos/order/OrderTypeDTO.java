package ke.kigen.api.dtos.order;

import ke.kigen.api.annotations.IsOrderTypeNameValid;
import ke.kigen.api.models.order.EOrderType;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class OrderTypeDTO {
    
    private Integer id;

    @IsOrderTypeNameValid
    private String name;

    private String description;

    public OrderTypeDTO(EOrderType orderType) {
        setDescription(orderType.getDescription());
        setId(orderType.getId());
        setName(orderType.getName());
    }
}
