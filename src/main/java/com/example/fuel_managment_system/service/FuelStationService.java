// src/main/java/com/example/fuel_b/service/FuelStationService.java
package com.example.fuel_managment_system.service;

import com.example.fuel_managment_system.entity.FuelStation;
import com.example.fuel_managment_system.repository.FuelStationRepository;
import com.example.fuel_managment_system.repository.TransactionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.Map;

@Service
public class FuelStationService {
    @Autowired
    private FuelStationRepository fuelStationRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private TransactionRepository transactionRepository;

    public FuelStation registerFuelStation(FuelStation fuelStation) {
        fuelStation.setPassword(passwordEncoder.encode(fuelStation.getPassword()));
        return fuelStationRepository.save(fuelStation);
    }

    public FuelStation validateFuelStation(String name, String password) {
        FuelStation fuelStation = fuelStationRepository.findByName(name);
        if (fuelStation != null && passwordEncoder.matches(password, fuelStation.getPassword())) {
            return fuelStation;
        }
        return null;
    }

    public FuelStation activateFuelStation(Long id) {
        FuelStation fuelStation = fuelStationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("FuelStation not found"));
        fuelStation.setStatus(1);
        return fuelStationRepository.save(fuelStation);
    }

    public List<FuelStation> getAllFuelStationsWithStatus() {
        //dont return password
        return fuelStationRepository.findAll();
    }

    public void deleteFuelStationById(Long id) {
        fuelStationRepository.deleteById(id);
    }

    public List<Map<String, Object>> getFuelStationsWithTotalPumpedToday() {
        LocalDateTime startOfDay = LocalDateTime.now().with(LocalTime.MIN);
        LocalDateTime endOfDay = LocalDateTime.now().with(LocalTime.MAX);
        return transactionRepository.findTotalPumpedByFuelStationsToday(startOfDay, endOfDay);
    }

    //getbyid
    public FuelStation getFuelStationById(Long id) {
        return fuelStationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("FuelStation not found"));
    }
}