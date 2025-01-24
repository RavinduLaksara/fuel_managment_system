// src/main/java/com/example/fuel_b/repository/DistributionsRepository.java
package com.example.fuel_managment_system.repository;

import com.example.fuel_managment_system.entity.Distributions;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface DistributionsRepository extends JpaRepository<Distributions, Long> {

    @Query("SELECT d FROM Distributions d WHERE d.timestamp >= :startDate")
    List<Distributions> findDistributionsFromLastThreeDays(LocalDateTime startDate);

    //@Query("SELECT d.timestamp, SUM(d.fuelAmount) FROM Distributions d WHERE d.timestamp >= :startDate GROUP BY d.timestamp")
    //List<Object[]> findTotalFuelDistributedEachDay(LocalDateTime startDate);

    @Query("SELECT FUNCTION('DATE', d.timestamp), SUM(d.fuelAmount) FROM Distributions d WHERE d.timestamp >= :startDate GROUP BY FUNCTION('DATE', d.timestamp)")
    List<Object[]> findTotalFuelDistributedEachDay(LocalDateTime startDate);

    //query to fetch the total fuel distributed in the each month of the last 6 months
    // src/main/java/com/example/fuel_b/repository/DistributionsRepository.java
    @Query("SELECT EXTRACT(YEAR FROM d.timestamp), EXTRACT(MONTH FROM d.timestamp), SUM(d.fuelAmount) FROM Distributions d WHERE d.timestamp >= :startDate GROUP BY EXTRACT(YEAR FROM d.timestamp), EXTRACT(MONTH FROM d.timestamp)")
    List<Object[]> findTotalFuelDistributedEachMonth(LocalDateTime startDate);


    @Query("SELECT SUM(d.fuelAmount) FROM Distributions d WHERE d.timestamp BETWEEN :startOfDay AND :endOfDay AND d.fuelStation.id = :fuelStationId")
    Double findTotalDistributedAmountByDateRangeAndFuelStationId(@Param("startOfDay") LocalDateTime startOfDay, @Param("endOfDay") LocalDateTime endOfDay, @Param("fuelStationId") Long fuelStationId);


    @Query("SELECT SUM(d.fuelAmount) FROM Distributions d WHERE d.timestamp BETWEEN :startOfDay AND :endOfDay")
    Double findTotalDistributedAmountByDateRange(@Param("startOfDay") LocalDateTime startOfDay, @Param("endOfDay") LocalDateTime endOfDay);

    @Query("SELECT d.fuelType, SUM(d.fuelAmount) FROM Distributions d WHERE d.timestamp BETWEEN :startOfDay AND :endOfDay GROUP BY d.fuelType ORDER BY SUM(d.fuelAmount) DESC")
    List<Object[]> findTotalDistributedAmountByFuelTypeAndDateRange(@Param("startOfDay") LocalDateTime startOfDay, @Param("endOfDay") LocalDateTime endOfDay);


    // src/main/java/com/example/fuel_b/repository/DistributionsRepository.java
    @Query("SELECT COUNT(DISTINCT d.fuelStation.id) FROM Distributions d WHERE d.timestamp BETWEEN :startOfDay AND :endOfDay")
    long countDistinctFuelStationsByDateRange(@Param("startOfDay") LocalDateTime startOfDay, @Param("endOfDay") LocalDateTime endOfDay);

    // src/main/java/com/example/fuel_b/repository/DistributionsRepository.java
    @Query("SELECT d.fuelStation.name, SUM(d.fuelAmount) FROM Distributions d WHERE d.timestamp BETWEEN :startOfDay AND :endOfDay GROUP BY d.fuelStation.name ORDER BY SUM(d.fuelAmount) DESC")
    List<Object[]> findMostDistributedStationByDateRange(@Param("startOfDay") LocalDateTime startOfDay, @Param("endOfDay") LocalDateTime endOfDay);

}



