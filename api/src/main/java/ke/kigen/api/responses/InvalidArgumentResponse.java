package ke.kigen.api.responses;

import java.util.Map;
import lombok.Data;

@Data
public class InvalidArgumentResponse {
    
    private String timestamp;

    private String message;

    private Map<String, Object> errors;

    private int status;

    public InvalidArgumentResponse(String timestamp, String message, Map<String, Object> errors, int status) {
        super();
        this.timestamp = timestamp;
        this.message = message;
        this.errors = errors;
        this.status = status;
    }
}
