// src/main/java/com/example/fuel_b/controller/FuelStationController.java
package com.example.fuel_managment_system.controller;

import com.example.fuel_managment_system.entity.Employee;
import com.example.fuel_managment_system.entity.FuelStation;
import com.example.fuel_managment_system.security.JwtTokenProvider;
import com.example.fuel_managment_system.service.EmployeeService;
import com.example.fuel_managment_system.service.FuelStationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/fuel-stations")
public class FuelStationController {

    @Autowired
    private FuelStationService fuelStationService;

    @Autowired
    private EmployeeService employeeService;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @PostMapping("/register")
    public ResponseEntity<FuelStation> registerFuelStation(@RequestBody FuelStation fuelStation) {
        FuelStation registeredStation = fuelStationService.registerFuelStation(fuelStation);
        return ResponseEntity.ok(registeredStation);
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginFuelStation(@RequestBody FuelStation fuelStation) {
        FuelStation registeredStation = fuelStationService.validateFuelStation(fuelStation.getName(), fuelStation.getPassword());
        if (registeredStation != null) {
            String token = jwtTokenProvider.generateToken(registeredStation.getName());
            Map<String, Object> response = new HashMap<>();
            response.put("token", token);
            response.put("stationId", registeredStation.getId());
            response.put("status", registeredStation.getStatus());
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.status(401).body("Invalid credentials");
        }
    }

    @PostMapping("/employees/register")
    public ResponseEntity<Employee> registerEmployee( @RequestBody Employee employee) {
        Employee registeredEmployee = employeeService.registerEmployee(employee);
        return ResponseEntity.ok(registeredEmployee);
    }

    @PutMapping("/{id}/activate")
    public ResponseEntity<FuelStation> activateFuelStation(@PathVariable Long id) {
        FuelStation updatedStation = fuelStationService.activateFuelStation(id);
        return ResponseEntity.ok(updatedStation);
    }
    @GetMapping("/all-with-status")
    public ResponseEntity<List<FuelStation>> getAllFuelStationsWithStatus() {
        List<FuelStation> stations = fuelStationService.getAllFuelStationsWithStatus();
        return ResponseEntity.ok(stations);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteFuelStation(@PathVariable Long id) {
        fuelStationService.deleteFuelStationById(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/total-pumped-today")
    public ResponseEntity<List<Map<String, Object>>> getFuelStationsWithTotalPumpedToday() {
        List<Map<String, Object>> stationsWithTotalPumped = fuelStationService.getFuelStationsWithTotalPumpedToday();
        return ResponseEntity.ok(stationsWithTotalPumped);
    }

    //route get by id
    @GetMapping("station/{id}")
    public ResponseEntity<FuelStation> getFuelStationById(@PathVariable Long id) {
        FuelStation fuelStation = fuelStationService.getFuelStationById(id);
        return ResponseEntity.ok(fuelStation);
    }

}