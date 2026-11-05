
package com.hiretrack.dto;

import com.hiretrack.entity.Application;

public class ApplicationMapper {

    public static Application toEntity(ApplicationRequestDTO dto) {
        Application application = new Application();

        application.setApplicantName(dto.getApplicantName());
        application.setEmail(dto.getEmail());

        return application;
    }

    public static ApplicationResponseDTO toResponseDTO(
            Application application) {

        return new ApplicationResponseDTO(
                application.getId(),
                application.getApplicantName(),
                application.getEmail(),
                application.getStatus(),
                application.getAppliedAt(),
                application.getJob() != null
                        ? application.getJob().getId()
                        : null
        );
    }
}

