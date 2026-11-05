package com.hiretrack.controller;

import com.hiretrack.dto.ApplicationMapper;
import com.hiretrack.dto.ApplicationRequestDTO;
import com.hiretrack.dto.ApplicationResponseDTO;
import com.hiretrack.entity.Application;
import com.hiretrack.service.ApplicationService;

import jakarta.validation.Valid;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import org.springframework.security.core.Authentication;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/applications")
public class ApplicationController {

    private final ApplicationService applicationService;

    public ApplicationController(ApplicationService applicationService) {
        this.applicationService = applicationService;
    }

    @PostMapping
    public ResponseEntity<ApplicationResponseDTO> applyForJob(
            @RequestParam Long jobId,
            @Valid @RequestBody ApplicationRequestDTO dto,
            Authentication authentication) {

        Application saved = applicationService.applyForJob(
                jobId,
                dto.getApplicantName(),
                dto.getEmail(),
                authentication.getName()
        );

        return new ResponseEntity<>(
                ApplicationMapper.toResponseDTO(saved),
                HttpStatus.CREATED
        );
    }

    @GetMapping
    public ResponseEntity<Page<ApplicationResponseDTO>> getAllApplications(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "asc") String direction,
            Authentication authentication) {

        Sort sort = direction.equalsIgnoreCase("desc")
                ? Sort.by(sortBy).descending()
                : Sort.by(sortBy).ascending();

        Pageable pageable = PageRequest.of(page, size, sort);

        Page<ApplicationResponseDTO> applications =
                applicationService.getAllApplications(
                        pageable,
                        authentication.getName()
                ).map(ApplicationMapper::toResponseDTO);

        return ResponseEntity.ok(applications);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApplicationResponseDTO> getApplicationById(
            @PathVariable Long id,
            Authentication authentication) {

        Application application =
                applicationService.getApplicationById(
                        id,
                        authentication.getName()
                );

        return ResponseEntity.ok(
                ApplicationMapper.toResponseDTO(application));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<ApplicationResponseDTO> updateStatus(
            @PathVariable Long id,
            @RequestParam String status,
            Authentication authentication) {

        Application updated =
                applicationService.updateStatus(
                        id,
                        status,
                        authentication.getName()
                );

        return ResponseEntity.ok(
                ApplicationMapper.toResponseDTO(updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteApplication(
            @PathVariable Long id,
            Authentication authentication) {

        applicationService.deleteApplication(
                id,
                authentication.getName()
        );

        return ResponseEntity.noContent().build();
    }
}