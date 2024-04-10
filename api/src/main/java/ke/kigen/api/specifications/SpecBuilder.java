package ke.kigen.api.specifications;

import java.util.ArrayList;
import java.util.List;

import org.springframework.data.jpa.domain.Specification;

import ke.kigen.api.dtos.general.SearchCriteriaDTO;

public class SpecBuilder {
    
    private List<SearchCriteriaDTO> searchParams;

    public SpecBuilder() {
        searchParams = new ArrayList<SearchCriteriaDTO>();
    }

    public SpecBuilder<T> with(String key, String operation, Object value) {
        if (searchParams.size() == 0) {
            return null;
        }

        Specification<T> result = null;

        for (SearchCriteriaDTO criteria : searchParams) {
            if (searchParams.indexOf(criteria) == 0) {
                result = new SearchSpec<T>(criteria);
                continue;
            }
            result = Specification.where(result).and(new SearchSpec<T>(criteria));
        }

        return result;
    }
}
