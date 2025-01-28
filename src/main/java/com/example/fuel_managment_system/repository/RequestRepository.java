// src/main/java/com/example/fuel_b/repository/RequestRepository.java
package com.example.fuel_managment_system.repository;

import com.example.fuel_managment_system.entity.Request;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RequestRepository extends JpaRepository<Request, Long> {
    // src/main/java/com/example/fuel_b/repository/RequestRepository.java
    List<Request> findByFuelStationId(Long stationId);
}