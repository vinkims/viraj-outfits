package ke.kigen.api.dtos.general;

import java.util.Map;
import org.springframework.data.domain.Sort.Direction;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class PageDTO {
    
    private Direction direction;

    private Integer pageNumber = 0;

    private Integer pageSize = 10;

    private String search;

    private String sortDirection;

    private String sortVal;

    public PageDTO(Map<String, Object> params) {
        this.setPageNumber(Integer.valueOf((String) params.getOrDefault("pgNum", "0")));
        this.setPageSize(Integer.valueOf((String) params.getOrDefault("pgSize", "10")));
        this.setSearch((String) params.getOrDefault("q", null));
        this.setSortDirection((String) params.getOrDefault("sortDirection", "desc"));
        this.setSortVal((String) params.getOrDefault("sortValue", "createdOn"));
        this.setDirection();
    }

    public void setDirection() {
        direction = sortDirection.equals("asc") ? Direction.ASC : Direction.DESC;
    }
}
