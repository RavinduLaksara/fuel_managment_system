// src/main/java/com/example/fuel_b/repository/FuelStationRepository.java
package com.example.fuel_managment_system.repository;

import com.example.fuel_b.entity.Employee;
import com.example.fuel_b.entity.FuelStation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FuelStationRepository extends JpaRepository<FuelStation, Long> {


    FuelStation findByName(String name);

}