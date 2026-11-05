package com.hiretrack.controller;

import com.hiretrack.service.DashboardService;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final DashboardService dashboardService;

    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    @GetMapping("/stats")
    public Map<String, Long> getDashboardStats(
            Authentication authentication) {

        return dashboardService.getDashboardStats(
                authentication.getName()
        );
    }
}