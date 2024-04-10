package ke.kigen.api.responses;

import lombok.Data;

@Data
public class SuccessResponse {
    
    private int status = 200;

    private String message;

    private Object content;

    public SuccessResponse(int status, String message, Object content) {
        this.setStatus(status);
        this.setContent(content);
        this.setMessage(message);
    }
}
