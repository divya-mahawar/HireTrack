package com.hiretrack.service;

import com.hiretrack.entity.Application;
import com.hiretrack.entity.Job;
import com.hiretrack.entity.User;
import com.hiretrack.repository.ApplicationRepository;
import com.hiretrack.repository.JobRepository;
import com.hiretrack.repository.UserRepository;

import org.springframework.stereotype.Service;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

@Service
public class ApplicationService {

    private final ApplicationRepository applicationRepository;
    private final JobRepository jobRepository;
    private final UserRepository userRepository;

    public ApplicationService(
            ApplicationRepository applicationRepository,
            JobRepository jobRepository,
            UserRepository userRepository) {

        this.applicationRepository = applicationRepository;
        this.jobRepository = jobRepository;
        this.userRepository = userRepository;
    }

    private User getUser(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public Application applyForJob(
            Long jobId, String applicantName, String email, String userEmail) {

        User user = getUser(userEmail);

        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new RuntimeException("Job not found"));

        Application application = new Application();
        application.setApplicantName(applicantName);
        application.setEmail(email);
        application.setJob(job);
        application.setUser(user);

        return applicationRepository.save(application);
    }

    public Page<Application> getAllApplications(
            Pageable pageable, String userEmail) {

        User user = getUser(userEmail);

        return applicationRepository.findByUserId(user.getId(), pageable);
    }

    public Application getApplicationById(Long id, String userEmail) {

        User user = getUser(userEmail);

        return applicationRepository.findByIdAndUserId(id, user.getId())
                .orElseThrow(() ->
                        new RuntimeException("Application not found"));
    }

    public Application updateStatus(
            Long id, String status, String userEmail) {

        Application application = getApplicationById(id, userEmail);

        application.setStatus(status);

        return applicationRepository.save(application);
    }

    public void deleteApplication(Long id, String userEmail) {

        Application application = getApplicationById(id, userEmail);

        applicationRepository.delete(application);
    }
}