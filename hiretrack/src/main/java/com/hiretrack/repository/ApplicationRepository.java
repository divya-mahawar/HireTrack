package com.hiretrack.repository;

import com.hiretrack.entity.Application;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

@Repository
public interface ApplicationRepository
        extends JpaRepository<Application, Long> {

    // Find applications belonging to a particular user
    List<Application> findByUserId(Long userId);
    Page<Application> findByUserId(Long userId, Pageable pageable);

    // Find a particular application owned by a user
    Optional<Application> findByIdAndUserId(Long id, Long userId);

    // Count applications belonging to a user
    long countByUserId(Long userId);

    // Count applications by user and status
    long countByUserIdAndStatus(Long userId, String status);

}