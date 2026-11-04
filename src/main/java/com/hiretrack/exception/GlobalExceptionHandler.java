
package com.hiretrack.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;
import java.util.Map;
import com.hiretrack.exception.JobNotFoundException;

@RestControllerAdvice
public class GlobalExceptionHandler {

   
@ExceptionHandler(JobNotFoundException.class)
public ResponseEntity<Map<String, Object>> handleJobNotFoundException(
        JobNotFoundException ex) {

    Map<String, Object> response = Map.of(
            "message", ex.getMessage(),
            "status", HttpStatus.NOT_FOUND.value(),
            "timestamp", LocalDateTime.now()
    );

    return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
}

}
