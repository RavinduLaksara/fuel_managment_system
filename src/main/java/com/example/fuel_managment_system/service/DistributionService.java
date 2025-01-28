// src/main/java/com/example/fuel_b/service/DistributionService.java
package com.example.fuel_managment_system.service;

import com.example.fuel_managment_system.entity.Distributions;
import com.example.fuel_managment_system.repository.DistributionsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class DistributionService {

    @Autowired
    private DistributionsRepository distributionsRepository;

    public double getTotalDistributedAmountTodayByFuelStationId(Long fuelStationId) {
        LocalDateTime startOfDay = LocalDateTime.now().toLocalDate().atStartOfDay();
        LocalDateTime endOfDay = LocalDateTime.now().toLocalDate().atTime(23, 59, 59);
        Double totalDistributedAmount = distributionsRepository.findTotalDistributedAmountByDateRangeAndFuelStationId(startOfDay, endOfDay, fuelStationId);
        return totalDistributedAmount != null ? totalDistributedAmount : 0.0;
    }

    public double getTotalDistributedAmountToday() {
        LocalDateTime startOfDay = LocalDateTime.now().toLocalDate().atStartOfDay();
        LocalDateTime endOfDay = LocalDateTime.now().toLocalDate().atTime(23, 59, 59);
        Double totalDistributedAmount = distributionsRepository.findTotalDistributedAmountByDateRange(startOfDay, endOfDay);
        return totalDistributedAmount != null ? totalDistributedAmount : 0.0;
    }


    public Object[] getMostDistributedFuelTypeAndAmountToday() {
        LocalDateTime startOfDay = LocalDateTime.now().toLocalDate().atStartOfDay();
        LocalDateTime endOfDay = LocalDateTime.now().toLocalDate().atTime(23, 59, 59);
        List<Object[]> results = distributionsRepository.findTotalDistributedAmountByFuelTypeAndDateRange(startOfDay, endOfDay);
        if (results.isEmpty()) {
            return null;
        }
        return results.get(0);
    }

    public long getDistinctFuelStationsCountToday() {
        LocalDateTime startOfDay = LocalDateTime.now().toLocalDate().atStartOfDay();
        LocalDateTime endOfDay = LocalDateTime.now().toLocalDate().atTime(23, 59, 59);
        return distributionsRepository.countDistinctFuelStationsByDateRange(startOfDay, endOfDay);
    }

    public Object[] getMostDistributedStationToday() {
        LocalDateTime startOfDay = LocalDateTime.now().toLocalDate().atStartOfDay();
        LocalDateTime endOfDay = LocalDateTime.now().toLocalDate().atTime(23, 59, 59);
        List<Object[]> results = distributionsRepository.findMostDistributedStationByDateRange(startOfDay, endOfDay);
        if (results.isEmpty()) {
            return null;
        }
        return results.get(0);
    }



    //getalldistributions
    public List<Distributions> getAllDistributions() {
        return distributionsRepository.findAll();
    }



}