
package com.hiretrack.dto;

import com.hiretrack.entity.Job;

public class JobMapper {

    public static Job toEntity(JobRequestDTO dto) {
        Job job = new Job();

        job.setTitle(dto.getTitle());
        job.setCompany(dto.getCompany());
        job.setLocation(dto.getLocation());
        job.setDescription(dto.getDescription());
        job.setSalary(dto.getSalary());

        return job;
    }

    public static JobResponseDTO toResponseDTO(Job job) {
        return new JobResponseDTO(
                job.getId(),
                job.getTitle(),
                job.getCompany(),
                job.getLocation(),
                job.getDescription(),
                job.getSalary()
        );
    }
}

