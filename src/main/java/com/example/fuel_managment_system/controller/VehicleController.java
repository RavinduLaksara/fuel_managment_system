// src/main/java/com/example/fuel_b/controller/VehicleController.java
package com.example.fuel_managment_system.controller;

import com.example.fuel_managment_system.entity.Vehicle;
import com.example.fuel_managment_system.repository.VehicleRepository;
import com.example.fuel_managment_system.security.JwtTokenProvider;
import com.example.fuel_managment_system.service.VehicleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/vehicles")
public class VehicleController {
    @Autowired
    private VehicleService vehicleService;

    @Autowired
    private VehicleRepository vehicleRepository;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @PostMapping("/register")
    public Vehicle registerVehicle(@RequestBody Vehicle vehicle) {
        return vehicleService.registerVehicle(vehicle);
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginVehicle(@RequestBody Vehicle vehicle) {
        Vehicle registeredVehicle = vehicleService.validateVehicle(vehicle.getRegistrationNumber(), vehicle.getEngineNumber());
        if (registeredVehicle != null) {
            String token = jwtTokenProvider.generateToken(registeredVehicle.getRegistrationNumber());
            Map<String, Object> response = new HashMap<>();
            response.put("token", token);
            response.put("vehicle_id", registeredVehicle.getId());
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.status(401).body("Invalid credentials");
        }
    }


   //route to get vehicle data by registration number
    @GetMapping("/{registrationNumber}")
    public ResponseEntity<Vehicle> getVehicleByRegistrationNumber(@PathVariable String registrationNumber) {
        Vehicle vehicle = vehicleRepository.findByRegistrationNumber(registrationNumber);
        if (vehicle != null) {
            return ResponseEntity.ok(vehicle);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    //route to edit vehicle data by registration number
    @PutMapping("/{registrationNumber}")
    public ResponseEntity<Vehicle> editVehicleByRegistrationNumber(@PathVariable String registrationNumber, @RequestBody Vehicle vehicle) {
        Vehicle existingVehicle = vehicleRepository.findByRegistrationNumber(registrationNumber);
        if (existingVehicle != null) {
            existingVehicle.setEngineNumber(vehicle.getEngineNumber());
            existingVehicle.setOwnerName(vehicle.getOwnerName());
            existingVehicle.setModel(vehicle.getModel());
            vehicleRepository.save(existingVehicle);
            return ResponseEntity.ok(existingVehicle);
        } else {
            return ResponseEntity.notFound().build();
        }
    }






}