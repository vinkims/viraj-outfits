package ke.kigen.api.handlers;

import java.io.PrintWriter;
import java.io.StringWriter;
import java.util.Date;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

import ke.kigen.api.responses.GeneralErrorResponse;

@RestControllerAdvice
public class UnhandledExceptionHandler extends ResponseEntityExceptionHandler {
    
    Logger logger = LoggerFactory.getLogger(UnhandledExceptionHandler.class);

    @ExceptionHandler(Exception.class)
    public ResponseEntity<Object> handleUnhandledExceptions(Exception ex, WebRequest request) {

        HttpStatus status = HttpStatus.INTERNAL_SERVER_ERROR;
        String message = "Something went wrong. Ensure you are sending a valid request and try again.";
        GeneralErrorResponse basicErrorResponse = new GeneralErrorResponse(new Date().toString(), message, status.value());

        logger.error(String.format("(%s) -- [MSG] %s", status.value(), message));

        StringWriter writer = new StringWriter();
        PrintWriter printWriter = new PrintWriter(writer);
        ex.printStackTrace(printWriter);

        logger.error(String.format("\n[ENDPOINT] %s\n--[CAUSE] %s\n--[MSG] %s\n[STACKTRACE] %s",
            request.getDescription(true), ex.getCause(), ex.getMessage(), writer.toString()));

        return new ResponseEntity<>(basicErrorResponse, new HttpHeaders(), status);
    }
}
