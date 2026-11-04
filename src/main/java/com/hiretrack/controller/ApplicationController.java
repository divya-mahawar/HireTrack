package com.hiretrack.controller;

import com.hiretrack.entity.Application;
import com.hiretrack.service.ApplicationService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/applications")
public class ApplicationController {

    private final ApplicationService applicationService;

    public ApplicationController(ApplicationService applicationService) {
        this.applicationService = applicationService;
    }

    // Apply for a job
    @PostMapping
    public Application applyForJob(
            @RequestParam Long jobId,
            @RequestBody Application application) {

        return applicationService.applyForJob(
                jobId,
                application.getApplicantName(),
                application.getEmail()
        );
    }

    // Get all applications
    @GetMapping
    public List<Application> getAllApplications() {
        return applicationService.getAllApplications();
    }

    // Get application by ID
    @GetMapping("/{id}")
    public Application getApplicationById(@PathVariable Long id) {
        return applicationService.getApplicationById(id);
    }

    // Update application status
    @PutMapping("/{id}/status")
    public Application updateStatus(
            @PathVariable Long id,
            @RequestParam String status) {

        return applicationService.updateStatus(id, status);
    }

    // Delete application
    @DeleteMapping("/{id}")
    public String deleteApplication(@PathVariable Long id) {
        applicationService.deleteApplication(id);
        return "Application deleted successfully";
    }
}
