package com.hiretrack.service;

import com.hiretrack.entity.User;
import com.hiretrack.repository.ApplicationRepository;
import com.hiretrack.repository.JobRepository;
import com.hiretrack.repository.UserRepository;

import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class DashboardService {

    private final JobRepository jobRepository;
    private final ApplicationRepository applicationRepository;
    private final UserRepository userRepository;

    public DashboardService(
            JobRepository jobRepository,
            ApplicationRepository applicationRepository,
            UserRepository userRepository) {

        this.jobRepository = jobRepository;
        this.applicationRepository = applicationRepository;
        this.userRepository = userRepository;
    }

    public Map<String, Long> getDashboardStats(String userEmail) {

        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Long userId = user.getId();

        Map<String, Long> stats = new HashMap<>();

        // Job listings are currently shared among all users
        stats.put("totalJobs", jobRepository.count());

        // Application statistics belong only to logged-in user
        stats.put("totalApplications",
                applicationRepository.countByUserId(userId));

        stats.put("applied",
                applicationRepository.countByUserIdAndStatus(userId, "APPLIED"));

        stats.put("shortlisted",
                applicationRepository.countByUserIdAndStatus(userId, "SHORTLISTED"));

        stats.put("rejected",
                applicationRepository.countByUserIdAndStatus(userId, "REJECTED"));

        stats.put("selected",
                applicationRepository.countByUserIdAndStatus(userId, "SELECTED"));

        return stats;
    }
}