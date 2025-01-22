// src/main/java/com/example/fuelmanagement/repository/VehicleRepository.java
package com.example.fuel_managment_system.repository;

import com.example.fuel_b.entity.Vehicle;
import org.springframework.data.jpa.repository.JpaRepository;

public interface VehicleRepository extends JpaRepository<Vehicle, Long> {
    Vehicle findByRegistrationNumber(String registrationNumber);


}