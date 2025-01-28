// src/main/java/com/example/fuelmanagement/service/MockDMTService.java
package com.example.fuel_managment_system.service;

import org.springframework.stereotype.Service;

@Service
public class MockDMTService {
    public boolean validateVehicle(String registrationNumber) {
        // Mock validation logic
        return true;
    }
}