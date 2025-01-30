// src/main/java/com/example/fuel_b/entity/Request.java
package com.example.fuel_managment_system.entity;

import jakarta.persistence.*;

@Entity
public class Request {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "fuelstation_id", nullable = false)
    private FuelStation fuelStation;

    @Column(nullable = false)
    private double amount;

    @Column(nullable = false)
    private String fuelType;

    @Column(nullable = false)
    private String status;

    // Getters and setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public FuelStation getFuelStation() {
        return fuelStation;
    }

    public void setFuelStation(FuelStation fuelStation) {
        this.fuelStation = fuelStation;
    }

    public double getAmount() {
        return amount;
    }

    public void setAmount(double amount) {
        this.amount = amount;
    }

    public String getFuelType() {
        return fuelType;
    }

    public void setFuelType(String fuelType) {
        this.fuelType = fuelType;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}