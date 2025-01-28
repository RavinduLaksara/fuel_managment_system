// src/main/java/com/example/fuel_b/service/TransactionService.java
package com.example.fuel_managment_system.service;

import com.example.fuel_managment_system.entity.Transaction;
import com.example.fuel_managment_system.repository.TransactionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class TransactionService {

    @Autowired
    private TransactionRepository transactionRepository;

    public Transaction registerTransaction(Transaction transaction) {
        return transactionRepository.save(transaction);
    }

    public double getTotalPumpedAmountByFuelStationId(Long fuelStationId) {
        return transactionRepository.sumPumpedAmountByFuelStationId(fuelStationId);
    }

    public List<Transaction> getAllTransactions() {
        return transactionRepository.findAll();
    }
    public List<Object[]> getTotalPumpedAmountByFuelType() {
        return transactionRepository.findTotalPumpedAmountByFuelType();
    }

    public double getTotalPumpedAmountToday() {
        LocalDateTime startOfDay = LocalDate.now().atStartOfDay();
        LocalDateTime endOfDay = LocalDate.now().atTime(LocalTime.MAX);
        return transactionRepository.findTotalPumpedAmountByDateRange(startOfDay, endOfDay);
    }

    public double getTotalPumpedAmountTodayByFuelStationId(Long fuelStationId) {
        LocalDateTime startOfDay = LocalDateTime.now().toLocalDate().atStartOfDay();
        LocalDateTime endOfDay = LocalDateTime.now().toLocalDate().atTime(23, 59, 59);
        Double totalPumpedAmount = transactionRepository.findTotalPumpedAmountByDateRangeAndFuelStationId(startOfDay, endOfDay, fuelStationId);
        return totalPumpedAmount != null ? totalPumpedAmount : 0.0;
    }

    public long getCountOfDifferentVehicleIdsToday() {
        LocalDateTime startOfDay = LocalDateTime.now().toLocalDate().atStartOfDay();
        LocalDateTime endOfDay = LocalDateTime.now().toLocalDate().atTime(23, 59, 59);
        return transactionRepository.countDistinctVehicleIdsByDateRange(startOfDay, endOfDay);
    }


    public Object[] getMostPumpedFuelTypeAndAmountToday() {
        LocalDateTime startOfDay = LocalDateTime.now().toLocalDate().atStartOfDay();
        LocalDateTime endOfDay = LocalDateTime.now().toLocalDate().atTime(23, 59, 59);
        List<Object[]> results = transactionRepository.findTotalPumpedAmountByFuelTypeAndDateRange(startOfDay, endOfDay);
        if (results.isEmpty()) {
            return null;
        }
        return results.get(0);
    }



    public Map<String, Long> getTotalPumpedLastThreeDays() {
        LocalDateTime threeDaysAgo = LocalDateTime.now().minusDays(3);
        List<Object[]> results = transactionRepository.findTotalPumpedEachDay(threeDaysAgo);
        return results.stream()
                .collect(Collectors.toMap(
                        result -> result[0].toString(),
                        result -> (Long) result[1]
                ));
    }

    public Map<String, Long> getTotalPumpedLastSixMonths() {
        LocalDateTime sixMonthsAgo = LocalDateTime.now().minusMonths(6);
        List<Object[]> results = transactionRepository.findTotalPumpedEachMonth(sixMonthsAgo);
        return results.stream()
                .collect(Collectors.toMap(
                        result -> result[0] + "-" + result[1], // Combine year and month
                        result -> (Long) result[2]
                ));
    }
    public Map<String, Long> getTotalPumpedLastSevenDaysByVehicleId(Long vehicleId) {
        LocalDateTime sevenDaysAgo = LocalDateTime.now().minusDays(7);
        List<Object[]> results = transactionRepository.findTotalPumpedEachDayByVehicleId(sevenDaysAgo, vehicleId);
        return results.stream()
                .collect(Collectors.toMap(
                        result -> result[0].toString(),
                        result -> (Long) result[1]
                ));
    }

    public List<Object[]> getTotalPumpedAmountByFuelTypeAndFuelStationId(Long fuelStationId) {
        return transactionRepository.findTotalPumpedAmountByFuelTypeAndFuelStationId(fuelStationId);
    }


}