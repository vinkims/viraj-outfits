package ke.kigen.api.responses;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class GeneralErrorResponse {
    
    private String timestamp;

    private String message;

    private int status;
}
