// src/main/java/com/example/fuel_b/entity/Distributions.java
package com.example.fuel_managment_system.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
public class Distributions {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private double fuelAmount;

    private LocalDateTime timestamp;

    @ManyToOne
    @JoinColumn(name = "fuel_station_id")
    private FuelStation fuelStation;

    private String fuelType; // Add this line

    // Getters and setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public double getFuelAmount() {
        return fuelAmount;
    }

    public void setFuelAmount(double fuelAmount) {
        this.fuelAmount = fuelAmount;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }

    public FuelStation getFuelStation() {
        return fuelStation;
    }

    public void setFuelStation(FuelStation fuelStation) {
        this.fuelStation = fuelStation;
    }

    public String getFuelType() {
        return fuelType;
    }

    public void setFuelType(String fuelType) {
        this.fuelType = fuelType;
    }
}