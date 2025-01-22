// src/main/java/com/example/fuel_b/repository/EmployeeRepository.java
package com.example.fuel_managment_system.repository;

import com.example.fuel_b.entity.Employee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EmployeeRepository extends JpaRepository<Employee, Long> {
    Employee findByUsername(String username);

}