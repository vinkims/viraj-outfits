package ke.kigen.api.dtos.general;

import org.springframework.data.domain.Page;

import lombok.Data;

@Data
public class PageInfoDTO {
    
    private Integer pageNumber;

    private Integer pageSize;

    private Integer totalPages;

    private Long totalResults;

    private Integer pageResults;

    private String nextPage;

    private String prevPage;

    public PageInfoDTO(Page<?> page) {
        this.setPageNumber(page.getPageable().getPageNumber());
        this.setPageSize(page.getPageable().getPageSize());
        this.setTotalPages(page.getTotalPages());
        this.setTotalResults(page.getTotalElements());
        this.setPageResults(page.getNumberOfElements());
    }
}
