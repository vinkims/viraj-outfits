package ke.kigen.api.handlers;

import static jakarta.servlet.http.HttpServletResponse.SC_FORBIDDEN;

import java.io.IOException;

import java.io.OutputStream;
import java.util.Date;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.web.access.AccessDeniedHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.fasterxml.jackson.databind.ObjectMapper;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import ke.kigen.api.responses.GeneralErrorResponse;

@RestControllerAdvice
public class ApiAccessDeniedHandler implements AccessDeniedHandler {

    Logger logger = LoggerFactory.getLogger(ApiAccessDeniedHandler.class);

    @Override
    public void handle(HttpServletRequest request, HttpServletResponse response,
            AccessDeniedException accessDeniedException) throws IOException, ServletException {

        String message = "Access denied. You are not authorized to access the requested resource";
        GeneralErrorResponse basicErrorResponse = new GeneralErrorResponse(
            new Date().toString(), message, HttpStatus.FORBIDDEN.value());

        logger.error(String.format("(%s) %s -- [MSG] %s", 401, request.getServletPath(), message));

        response.setContentType("application/json");
        response.setStatus(SC_FORBIDDEN);

        OutputStream out = response.getOutputStream();
        ObjectMapper mapper = new ObjectMapper();
        mapper.writeValue(out, basicErrorResponse);
        out.flush();
    }
    
}
