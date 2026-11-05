
package com.hiretrack.controller;

import com.hiretrack.dto.JobMapper;
import com.hiretrack.dto.JobRequestDTO;
import com.hiretrack.dto.JobResponseDTO;
import com.hiretrack.entity.Job;
import com.hiretrack.service.JobService;
import com.hiretrack.repository.JobRepository;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

import java.util.List;

@RestController
@RequestMapping("/api/jobs")
public class JobController {

    private final JobService jobService;
    private final JobRepository jobRepository;

    public JobController(JobService jobService, JobRepository jobRepository) {
        this.jobService = jobService;
        this.jobRepository = jobRepository;
    }

    @PostMapping
    public ResponseEntity<JobResponseDTO> createJob(
            @Valid @RequestBody JobRequestDTO dto) {

        Job job = JobMapper.toEntity(dto);
        Job savedJob = jobService.createJob(job);

        return new ResponseEntity<>(
                JobMapper.toResponseDTO(savedJob),
                HttpStatus.CREATED
        );
    }

    @GetMapping
    public ResponseEntity<Page<JobResponseDTO>> getAllJobs(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "asc") String direction,
            @RequestParam(required = false) String search) {

        Sort sort = direction.equalsIgnoreCase("desc")
                ? Sort.by(sortBy).descending()
                : Sort.by(sortBy).ascending();

        Pageable pageable = PageRequest.of(page, size, sort);

        Page<JobResponseDTO> jobs;

        if (search != null && !search.trim().isEmpty()) {
            List<Job> results =
                    jobRepository
                    .findByTitleContainingIgnoreCaseOrCompanyContainingIgnoreCaseOrLocationContainingIgnoreCase(
                            search.trim(),
                            search.trim(),
                            search.trim()
                    );

            List<JobResponseDTO> filteredJobs = results.stream()
                    .map(JobMapper::toResponseDTO)
                    .toList();

            int start = (int) pageable.getOffset();
            int end = Math.min(start + pageable.getPageSize(), filteredJobs.size());

            List<JobResponseDTO> pageContent =
                    start >= filteredJobs.size()
                            ? List.of()
                            : filteredJobs.subList(start, end);

            jobs = new org.springframework.data.domain.PageImpl<>(
                    pageContent, pageable, filteredJobs.size()
            );

        } else {
            jobs = jobService.getAllJobs(pageable)
                    .map(JobMapper::toResponseDTO);
        }

        return ResponseEntity.ok(jobs);
    }

    @GetMapping("/{id}")
    public ResponseEntity<JobResponseDTO> getJobById(
            @PathVariable Long id) {

        Job job = jobService.getJobById(id);
        return ResponseEntity.ok(JobMapper.toResponseDTO(job));
    }

    @PutMapping("/{id}")
    public ResponseEntity<JobResponseDTO> updateJob(
            @PathVariable Long id,
            @Valid @RequestBody JobRequestDTO dto) {

        Job job = JobMapper.toEntity(dto);
        Job updatedJob = jobService.updateJob(id, job);

        return ResponseEntity.ok(JobMapper.toResponseDTO(updatedJob));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteJob(@PathVariable Long id) {

        jobService.deleteJob(id);
        return ResponseEntity.noContent().build();
    }
}
