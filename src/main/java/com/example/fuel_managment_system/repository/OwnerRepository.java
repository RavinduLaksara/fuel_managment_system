// src/main/java/com/example/fuelmanagement/repository/OwnerRepository.java
package com.example.fuel_managment_system.repository;

import com.example.fuel_b.entity.Owner;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OwnerRepository extends JpaRepository<Owner, Long> {
    Owner findByEmail(String email);


}
