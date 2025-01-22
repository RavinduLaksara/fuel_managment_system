// src/main/java/com/example/fuel_b/repository/TransactionRepository.java
package com.example.fuel_managment_system.repository;

import com.example.fuel_managment_system.entity.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {

    @Query("SELECT SUM(t.pumpedAmount) FROM Transaction t WHERE t.fuelStation.id = :fuelStationId")
    double sumPumpedAmountByFuelStationId(Long fuelStationId);

    @Query("SELECT t.fuelType, SUM(t.pumpedAmount) FROM Transaction t GROUP BY t.fuelType")
    List<Object[]> findTotalPumpedAmountByFuelType();


    @Query("SELECT SUM(t.pumpedAmount) FROM Transaction t WHERE t.timestamp BETWEEN :startOfDay AND :endOfDay")
    Double findTotalPumpedAmountByDateRange(@Param("startOfDay") LocalDateTime startOfDay, @Param("endOfDay") LocalDateTime endOfDay);


    @Query("SELECT SUM(t.pumpedAmount) FROM Transaction t WHERE t.timestamp BETWEEN :startOfDay AND :endOfDay AND t.fuelStation.id = :fuelStationId")
    Double findTotalPumpedAmountByDateRangeAndFuelStationId(@Param("startOfDay") LocalDateTime startOfDay, @Param("endOfDay") LocalDateTime endOfDay, @Param("fuelStationId") Long fuelStationId);


    @Query("SELECT COUNT(DISTINCT t.vehicle.id) FROM Transaction t WHERE t.timestamp BETWEEN :startOfDay AND :endOfDay")
    long countDistinctVehicleIdsByDateRange(@Param("startOfDay") LocalDateTime startOfDay, @Param("endOfDay") LocalDateTime endOfDay);

    @Query("SELECT t.fuelType, SUM(t.pumpedAmount) FROM Transaction t WHERE t.timestamp BETWEEN :startOfDay AND :endOfDay GROUP BY t.fuelType ORDER BY SUM(t.pumpedAmount) DESC")
    List<Object[]> findTotalPumpedAmountByFuelTypeAndDateRange(@Param("startOfDay") LocalDateTime startOfDay, @Param("endOfDay") LocalDateTime endOfDay);



    @Query("SELECT new map(fs.name as fuelStationName, SUM(t.pumpedAmount) as totalPumped) " +
            "FROM Transaction t JOIN t.fuelStation fs " +
            "WHERE t.timestamp BETWEEN :startOfDay AND :endOfDay " +
            "GROUP BY fs.name")
    List<Map<String, Object>> findTotalPumpedByFuelStationsToday(@Param("startOfDay") LocalDateTime startOfDay, @Param("endOfDay") LocalDateTime endOfDay);


    @Query("SELECT FUNCTION('DATE', t.timestamp), SUM(t.pumpedAmount) " +
            "FROM Transaction t " +
            "WHERE t.timestamp >= :threeDaysAgo " +
            "GROUP BY FUNCTION('DATE', t.timestamp)")
    List<Object[]> findTotalPumpedEachDay(@Param("threeDaysAgo") LocalDateTime threeDaysAgo);

    @Query("SELECT EXTRACT(YEAR FROM t.timestamp) AS year, EXTRACT(MONTH FROM t.timestamp) AS month, SUM(t.pumpedAmount) " +
            "FROM Transaction t " +
            "WHERE t.timestamp >= :sixMonthsAgo " +
            "GROUP BY EXTRACT(YEAR FROM t.timestamp), EXTRACT(MONTH FROM t.timestamp)")
    List<Object[]> findTotalPumpedEachMonth(@Param("sixMonthsAgo") LocalDateTime sixMonthsAgo);



    @Query("SELECT FUNCTION('DATE', t.timestamp), SUM(t.pumpedAmount) " +
            "FROM Transaction t " +
            "WHERE t.timestamp >= :sevenDaysAgo AND t.vehicle.id = :vehicleId " +
            "GROUP BY FUNCTION('DATE', t.timestamp)")
    List<Object[]> findTotalPumpedEachDayByVehicleId(@Param("sevenDaysAgo") LocalDateTime sevenDaysAgo, @Param("vehicleId") Long vehicleId);

}

