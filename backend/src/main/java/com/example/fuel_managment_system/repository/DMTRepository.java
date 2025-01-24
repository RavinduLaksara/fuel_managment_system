// src/main/java/com/example/fuel_b/repository/DMTRepository.java
package com.example.fuel_managment_system.repository;

import com.example.fuel_managment_system.entity.DMT;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface DMTRepository extends JpaRepository<DMT, Long> {
    Optional<DMT> findByRegistrationNumber(String registrationNumber);
}