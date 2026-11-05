
package com.hiretrack.dto;

public class JobResponseDTO {

    private Long id;
    private String title;
    private String company;
    private String location;
    private String description;
    private Double salary;

    public JobResponseDTO() {
    }

    public JobResponseDTO(Long id, String title, String company,
                          String location, String description, Double salary) {
        this.id = id;
        this.title = title;
        this.company = company;
        this.location = location;
        this.description = description;
        this.salary = salary;
    }

    public Long getId() {
        return id;
    }

    public String getTitle() {
        return title;
    }

    public String getCompany() {
        return company;
    }

    public String getLocation() {
        return location;
    }

    public String getDescription() {
        return description;
    }

    public Double getSalary() {
        return salary;
    }
}

