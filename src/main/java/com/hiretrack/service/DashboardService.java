
package com.hiretrack.service;

import com.hiretrack.repository.ApplicationRepository;
import com.hiretrack.repository.JobRepository;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class DashboardService {

    private final JobRepository jobRepository;
    private final ApplicationRepository applicationRepository;

    public DashboardService(
            JobRepository jobRepository,
            ApplicationRepository applicationRepository) {
        this.jobRepository = jobRepository;
        this.applicationRepository = applicationRepository;
    }

    public Map<String, Long> getDashboardStats() {

        Map<String, Long> stats = new HashMap<>();

        stats.put("totalJobs", jobRepository.count());
        stats.put("totalApplications", applicationRepository.count());
        stats.put("applied", applicationRepository.countByStatus("APPLIED"));
        stats.put("shortlisted", applicationRepository.countByStatus("SHORTLISTED"));
        stats.put("rejected", applicationRepository.countByStatus("REJECTED"));
        stats.put("selected", applicationRepository.countByStatus("SELECTED"));

        return stats;
    }
}