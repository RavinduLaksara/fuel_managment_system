// src/main/java/com/example/fuel_b/controller/DistributionController.java
package com.example.fuel_managment_system.controller;

import com.example.fuel_managment_system.entity.Distributions;
import com.example.fuel_managment_system.repository.DistributionsRepository;
import com.example.fuel_managment_system.service.DistributionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/distributions")
public class DistributionController {

    @Autowired
    private DistributionsRepository distributionsRepository;

    @Autowired
    private DistributionService distributionService;



    @PostMapping("/create")
    public ResponseEntity<Distributions> createDistribution(@RequestBody Distributions distribution) {
        Distributions savedDistribution = distributionsRepository.save(distribution);
        //messagingTemplate.convertAndSend("/topic/distributions", savedDistribution);
        return ResponseEntity.ok(savedDistribution);
    }

    @GetMapping("/last-three-days")
    public ResponseEntity<List<Distributions>> getDistributionsFromLastThreeDays() {
        LocalDateTime threeDaysAgo = LocalDateTime.now().minusDays(3);
        List<Distributions> distributions = distributionsRepository.findDistributionsFromLastThreeDays(threeDaysAgo);
       // messagingTemplate.convertAndSend("/topic/distributions", distributions);
        return ResponseEntity.ok(distributions);
    }

    @GetMapping("/total-fuel-last-three-days")
    public ResponseEntity<Map<LocalDate, Double>> getTotalFuelDistributedEachDay() {
        LocalDateTime threeDaysAgo = LocalDateTime.now().minusDays(3);
        List<Object[]> results = distributionsRepository.findTotalFuelDistributedEachDay(threeDaysAgo);
        Map<LocalDate, Double> totalFuelPerDay = results.stream()
                .collect(Collectors.toMap(
                        result -> ((java.sql.Date) result[0]).toLocalDate(),
                        result -> (Double) result[1]
                ));
       // messagingTemplate.convertAndSend("/topic/distributions", totalFuelPerDay);
        return ResponseEntity.ok(totalFuelPerDay);
    }

    @GetMapping("/total-fuel-last-six-months")
    public ResponseEntity<Map<String, Double>> getTotalFuelDistributedLastSixMonths() {
        LocalDateTime sixMonthsAgo = LocalDateTime.now().minusMonths(6);
        List<Object[]> results = distributionsRepository.findTotalFuelDistributedEachMonth(sixMonthsAgo);
        Map<String, Double> totalFuelPerMonth = results.stream()
                .collect(Collectors.toMap(
                        result -> result[0] + "-" + result[1], // Combine year and month
                        result -> (Double) result[2]
                ));
       // messagingTemplate.convertAndSend("/topic/distributions", totalFuelPerMonth);
        return ResponseEntity.ok(totalFuelPerMonth);
    }

    @GetMapping("/total-distributed-today/{fuelStationId}")
    public ResponseEntity<Double> getTotalDistributedAmountTodayByFuelStationId(@PathVariable Long fuelStationId) {
        double totalDistributedAmountToday = distributionService.getTotalDistributedAmountTodayByFuelStationId(fuelStationId);
        //messagingTemplate.convertAndSend("/topic/distributions", totalDistributedAmountToday);
        return ResponseEntity.ok(totalDistributedAmountToday);
    }

    @GetMapping("/total-distributed-today")

    public ResponseEntity<Double> getTotalDistributedAmountToday() {
        double totalDistributedAmountToday = distributionService.getTotalDistributedAmountToday();
        return ResponseEntity.ok(totalDistributedAmountToday);
    }

    @GetMapping("/most-distributed-fuel-type-today")
    public ResponseEntity<Map<String, Object>> getMostDistributedFuelTypeAndAmountToday() {
        Object[] mostDistributedFuelTypeAndAmountToday = distributionService.getMostDistributedFuelTypeAndAmountToday();
        if (mostDistributedFuelTypeAndAmountToday == null) {
           // messagingTemplate.convertAndSend("/topic/distributions", Map.of("message", "No data available for today"));
            return ResponseEntity.ok(Map.of("message", "No data available for today"));
        }
        Map<String, Object> response = Map.of(
                "fuelType", mostDistributedFuelTypeAndAmountToday[0],
                "amount", mostDistributedFuelTypeAndAmountToday[1]
        );
       // messagingTemplate.convertAndSend("/topic/distributions", response);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/distinct-fuel-stations-today")
    public ResponseEntity<Long> getDistinctFuelStationsCountToday() {
        long count = distributionService.getDistinctFuelStationsCountToday();
        //messagingTemplate.convertAndSend("/topic/distributions", count);
        return ResponseEntity.ok(count);
    }

    @GetMapping("/most-distributed-station-today")
    public ResponseEntity<Map<String, Object>> getMostDistributedStationToday() {
        Object[] mostDistributedStationToday = distributionService.getMostDistributedStationToday();
        if (mostDistributedStationToday == null) {
            //messagingTemplate.convertAndSend("/topic/distributions", Map.of("message", "No data available for today"));
            return ResponseEntity.ok(Map.of("message", "No data available for today"));
        }
        Map<String, Object> response = Map.of(
                "stationName", mostDistributedStationToday[0],
                "amount", mostDistributedStationToday[1]
        );
       // messagingTemplate.convertAndSend("/topic/distributions", response);
        return ResponseEntity.ok(response);
    }

    //get all distributions
    @GetMapping("/all")
    public ResponseEntity<List<Distributions>> getAllDistributions() {
        List<Distributions> distributions = distributionService.getAllDistributions();
        return ResponseEntity.ok(distributions);
    }


    //total distributions by fuel station id categorized by fuel type


}