package com.hiretrack.repository;

import com.hiretrack.entity.Job;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface JobRepository extends JpaRepository<Job, Long> {

    // Search jobs by title
    List<Job> findByTitleContainingIgnoreCase(String title);

    // Search jobs by company
    List<Job> findByCompanyContainingIgnoreCase(String company);

    // Filter jobs by location
    List<Job> findByLocationContainingIgnoreCase(String location);

}
