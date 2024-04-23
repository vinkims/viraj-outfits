package ke.kigen.api.handlers;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

import ke.kigen.api.exceptions.InvalidInputException;
import ke.kigen.api.exceptions.NotFoundException;
import ke.kigen.api.exceptions.ThirdPartyClientException;
import ke.kigen.api.responses.InvalidArgumentResponse;

@RestControllerAdvice
public class ApiExceptionHandler extends ResponseEntityExceptionHandler {
    
    Logger logger = LoggerFactory.getLogger(ApiExceptionHandler.class);

    /**
     * Handles exceptions due to invalid input
     * 
     * @param ex        MetodArgumentNotValidException class
     * @param headers   HttpHeaders class
     * @param status    HttpStatus class
     * @param request   WebRequest instance
     * 
     * @return  ResponseEntity object
     */
    public ResponseEntity<Object> handleMethodArgumentNotValid(MethodArgumentNotValidException ex, 
            HttpHeaders headers, HttpStatus status, WebRequest request) {

        String message = "Invalid input field value in request body";

        BindingResult bindingResult = ex.getBindingResult();
        Map<String, Object> errors = new HashMap<>();
        if (bindingResult.hasFieldErrors()) {
            for (FieldError err : ex.getBindingResult().getFieldErrors()) {
                String key = err.getField();
                String msg = err.getDefaultMessage();
                errors.put(key, msg);
            }
        }

        if (bindingResult.hasGlobalErrors()) {
            errors.put("generalError", bindingResult.getGlobalError().getDefaultMessage());
        }

        InvalidArgumentResponse exceptionResponseBody = new InvalidArgumentResponse(
            new Date().toString(), message, errors, status.value());

        logger.error(String.format("(%s) -- [MSG] %s || [ERRORS] %s", status.value(), message, errors));

        return new ResponseEntity<Object>(exceptionResponseBody, headers, status);
    }

    /**
     * Handles invalid input exceptions
     * 
     * @param ex        InvalidInputException obj
     * @param request   WebRequest instance
     * 
     * @return  ResponseEntity obj
     */
    @ExceptionHandler({ InvalidInputException.class })
    public ResponseEntity<Object> handleInvalidInputException(InvalidInputException ex, WebRequest request) {

        HttpStatus status = HttpStatus.BAD_REQUEST;
        String message = "Invalid input provided";
        Map<String, Object> errors = new HashMap<>();
        errors.put(ex.getInvalidField(), ex.getExceptionMsg());

        InvalidArgumentResponse invalidArgumentResp = new InvalidArgumentResponse(
            new Date().toString(), message, errors, status.value());

        logger.error("{}: [MSG] {} -> {}", status.value(), message, errors);

        return new ResponseEntity<>(invalidArgumentResp, new HttpHeaders(), status);
    }

    @ExceptionHandler({ NotFoundException.class })
    public ResponseEntity<Object> handleNotFoundException(NotFoundException ex, WebRequest request) {

        HttpStatus status = HttpStatus.NOT_FOUND;
        String message = "Invalid value provided";
        Map<String, Object> errors = new HashMap<>();
        errors.put(ex.getInvalidField(), ex.getExceptionMsg());

        InvalidArgumentResponse invalidArgumentResp = new InvalidArgumentResponse(
            new Date().toString(), message, errors, status.value());

        logger.error("{}: [MSG] {} -> {}", status.value(), message, errors);

        return new ResponseEntity<>(invalidArgumentResp, new HttpHeaders(), status);
    }

    @ExceptionHandler(ThirdPartyClientException.class)
    public void handleThirdPartyClientException(ThirdPartyClientException ex, WebRequest request) {
        logger.error("\n[STATUS] {}\n[MSG] {}\n[CONTENT] {}", ex.getStatusCode().value(), ex.getMessage(), ex.getContent());
    }
}
