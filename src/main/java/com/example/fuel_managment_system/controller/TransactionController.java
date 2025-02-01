// src/main/java/com/example/fuel_b/controller/TransactionController.java
package com.example.fuel_managment_system.controller;

import com.example.fuel_managment_system.entity.Transaction;
import com.example.fuel_managment_system.service.TransactionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/transactions")
public class TransactionController {

    @Autowired
    private TransactionService transactionService;

    @PostMapping("/add")
    public ResponseEntity<Transaction> addTransaction(@RequestBody Transaction transaction) {
        Transaction savedTransaction = transactionService.registerTransaction(transaction);
        return ResponseEntity.ok(savedTransaction);
    }

    @GetMapping("/total-pumped/{fuelStationId}")
    public ResponseEntity<Double> getTotalPumpedAmount(@PathVariable Long fuelStationId) {
        double totalPumpedAmount = transactionService.getTotalPumpedAmountByFuelStationId(fuelStationId);
        return ResponseEntity.ok(totalPumpedAmount);
    }

    @GetMapping("/all")
    public ResponseEntity<List<Transaction>> getAllTransactions() {
        List<Transaction> transactions = transactionService.getAllTransactions();
        return ResponseEntity.ok(transactions);
    }
    @GetMapping("/total-pumped-by-fuel-type/{fuelStationId}")
    public ResponseEntity<Map<String, Long>> getTotalPumpedAmountByFuelType(@PathVariable Long fuelStationId) {
        List<Object[]> results = transactionService.getTotalPumpedAmountByFuelTypeAndFuelStationId(fuelStationId);
        Map<String, Long> totalPumpedByFuelType = results.stream()
                .collect(Collectors.toMap(
                        result -> (String) result[0],
                        result -> (Long) result[1]
                ));
        return ResponseEntity.ok(totalPumpedByFuelType);
    }

    @GetMapping("/total-pumped-today")
    public ResponseEntity<Double> getTotalPumpedAmountToday() {
        double totalPumpedAmountToday = transactionService.getTotalPumpedAmountToday();
        return ResponseEntity.ok(totalPumpedAmountToday);
    }
    @GetMapping("/total-pumped-today/{fuelStationId}")
    public ResponseEntity<Double> getTotalPumpedAmountTodayByFuelStationId(@PathVariable Long fuelStationId) {
        double totalPumpedAmountToday = transactionService.getTotalPumpedAmountTodayByFuelStationId(fuelStationId);
        return ResponseEntity.ok(totalPumpedAmountToday);
    }

    @GetMapping("/count-vehicles-today")
    public ResponseEntity<Long> getCountOfDifferentVehicleIdsToday() {
        long countOfDifferentVehicleIdsToday = transactionService.getCountOfDifferentVehicleIdsToday();
        return ResponseEntity.ok(countOfDifferentVehicleIdsToday);
    }

    @GetMapping("/most-pumped-fuel-type-today")
    public ResponseEntity<Map<String, Object>> getMostPumpedFuelTypeAndAmountToday() {
        Object[] mostPumpedFuelTypeAndAmountToday = transactionService.getMostPumpedFuelTypeAndAmountToday();
        if (mostPumpedFuelTypeAndAmountToday == null) {
            return ResponseEntity.ok(null);
        }
        Map<String, Object> response = Map.of(
                "fuelType", mostPumpedFuelTypeAndAmountToday[0],
                "pumpedAmount", mostPumpedFuelTypeAndAmountToday[1]
        );
        return ResponseEntity.ok(response);
    }

    @GetMapping("/total-pumped-last-three-days")
    public ResponseEntity<Map<String, Long>> getTotalPumpedLastThreeDays() {
        Map<String, Long> totalPumpedLastThreeDays = transactionService.getTotalPumpedLastThreeDays();
        return ResponseEntity.ok(totalPumpedLastThreeDays);
    }

    @GetMapping("/total-pumped-last-six-months")
    public ResponseEntity<Map<String, Long>> getTotalPumpedLastSixMonths() {
        Map<String, Long> totalPumpedLastSixMonths = transactionService.getTotalPumpedLastSixMonths();
        return ResponseEntity.ok(totalPumpedLastSixMonths);
    }


    @GetMapping("/total-pumped-last-seven-days/{vehicleId}")
    public ResponseEntity<Map<String, Long>> getTotalPumpedLastSevenDaysByVehicleId(@PathVariable Long vehicleId) {
        Map<String, Long> totalPumpedLastSevenDays = transactionService.getTotalPumpedLastSevenDaysByVehicleId(vehicleId);
        return ResponseEntity.ok(totalPumpedLastSevenDays);
    }



}