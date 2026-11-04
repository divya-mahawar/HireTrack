package com.hiretrack.service;

import com.hiretrack.entity.Application;
import com.hiretrack.entity.Job;
import com.hiretrack.repository.ApplicationRepository;
import com.hiretrack.repository.JobRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ApplicationService {

    private final ApplicationRepository applicationRepository;
    private final JobRepository jobRepository;

    public ApplicationService(
            ApplicationRepository applicationRepository,
            JobRepository jobRepository) {
        this.applicationRepository = applicationRepository;
        this.jobRepository = jobRepository;
    }

    public Application applyForJob(
            Long jobId, String applicantName, String email) {

        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new RuntimeException("Job not found"));

        Application application = new Application();
        application.setApplicantName(applicantName);
        application.setEmail(email);
        application.setJob(job);

        return applicationRepository.save(application);
    }

    public List<Application> getAllApplications() {
        return applicationRepository.findAll();
    }

    public Application getApplicationById(Long id) {
        return applicationRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Application not found"));
    }

    public Application updateStatus(Long id, String status) {
        Application application = getApplicationById(id);
        application.setStatus(status);
        return applicationRepository.save(application);
    }

    public void deleteApplication(Long id) {
        applicationRepository.deleteById(id);
    }
}
