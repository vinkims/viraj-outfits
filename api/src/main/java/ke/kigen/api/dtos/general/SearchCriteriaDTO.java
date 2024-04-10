package ke.kigen.api.dtos.general;

import lombok.Data;

@Data
public class SearchCriteriaDTO {
    
    private String key;

    private String operation;

    private Object value;

    public SearchCriteriaDTO(String key, String operation, Object value) {
        setKey(key);
        setOperation(operation);
        setValue(value);
    }
}
