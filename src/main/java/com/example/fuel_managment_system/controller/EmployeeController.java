// src/main/java/com/example/fuel_b/controller/EmployeeController.java
package com.example.fuel_managment_system.controller;

import com.example.fuel_managment_system.entity.Employee;
import com.example.fuel_managment_system.entity.Vehicle;
import com.example.fuel_managment_system.repository.VehicleRepository;
import com.example.fuel_managment_system.security.JwtTokenProvider;
import com.example.fuel_managment_system.service.EmployeeService;
import com.example.fuel_managment_system.service.VehicleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/employees")
public class EmployeeController {
    @Autowired
    private EmployeeService employeeService;

    @Autowired
    private VehicleService vehicleService;

    @Autowired
    private VehicleRepository vehicleRepository;
    

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @PostMapping("/register")
    public Employee registerEmployee(@RequestBody Employee employee) {
        return employeeService.registerEmployee(employee);
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginEmployee(@RequestBody Employee employee) {
        Employee registeredEmployee = employeeService.validateEmployee(employee.getUsername(), employee.getPassword());
        if (registeredEmployee != null) {
            String token = jwtTokenProvider.generateToken(registeredEmployee.getUsername());
            Map<String, Object> response = new HashMap<>();
            response.put("token", token);
            response.put("employee_id", registeredEmployee.getId());
            response.put("employee_name", registeredEmployee.getUsername());
            response.put("fuel_station_id", registeredEmployee.getFuelStation().getId());
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.status(401).body("Invalid credentials");
        }
    }
    @PostMapping("/scan-qr")
    public ResponseEntity<Vehicle> getVehicleByQRCode(@RequestBody Map<String, String> request) {
        String qrCodeBase64 = request.get("qrCode");
        try {
            Vehicle vehicle = vehicleService.getVehicleByQRCode(qrCodeBase64);
            if (vehicle != null) {
                return ResponseEntity.ok(vehicle);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (IOException e) {
            return ResponseEntity.status(500).build();
        }
    }


    @PutMapping("/{id}/update-quota")
    public ResponseEntity<Vehicle> updateWeekQuota(@PathVariable Long id, @RequestBody Map<String, Integer> request) {
        try {
            int pumpedAmount = request.get("pumpedAmount");

            Vehicle updatedVehicle = vehicleService.updateWeekQuota(id, pumpedAmount);
            return ResponseEntity.ok(updatedVehicle);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(500).body(null);
        }
    }



}