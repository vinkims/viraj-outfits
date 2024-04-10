package ke.kigen.api.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

import lombok.Data;
import lombok.EqualsAndHashCode;

@ResponseStatus(HttpStatus.BAD_REQUEST)
@Data
@EqualsAndHashCode(callSuper = false)
public class ThirdPartyClientException extends RuntimeException {
    
    private static final long serialVersionUID = 1L;

    private String exceptionMsg;

    private Object content;
    
    private HttpStatus statusCode;

    public ThirdPartyClientException(HttpStatus statusCode, String exception, Object content) {
        super(exception);
        this.setExceptionMsg(exception);
        this.setContent(content);
        setStatusCode(statusCode);
    }
}
