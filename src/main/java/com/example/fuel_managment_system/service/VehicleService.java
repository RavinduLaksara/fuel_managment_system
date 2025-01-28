// src/main/java/com/example/fuel_b/service/VehicleService.java
package com.example.fuel_managment_system.service;

import com.example.fuel_b.entity.DMT;
import com.example.fuel_b.entity.Vehicle;
import com.example.fuel_b.repository.DMTRepository;
import com.example.fuel_b.repository.VehicleRepository;
import com.example.fuel_b.util.QRCodeGenerator;
import com.google.zxing.WriterException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.Base64;
import java.util.List;
import java.util.Optional;

@Service
public class VehicleService {
    private static final Logger logger = LoggerFactory.getLogger(VehicleService.class);

    @Autowired
    private VehicleRepository vehicleRepository;

    @Autowired
    private DMTRepository dmtRepository;

    @Scheduled(cron = "0 0 * * * *") // Every minute
    // Every hour: "0 0 * * * *"
    public void resetWeekQuota() {
        List<Vehicle> vehicles = vehicleRepository.findAll();
        for (Vehicle vehicle : vehicles) {
            vehicle.setWeekQuota(10);
        }
        vehicleRepository.saveAll(vehicles);
    }

    public Vehicle getVehicleByQRCode(String qrCodeBase64) throws IOException {
        String decodedText = QRCodeGenerator.decodeQRCodeText(qrCodeBase64);
        return vehicleRepository.findByRegistrationNumber(decodedText);
    }

    public Vehicle registerVehicle(Vehicle vehicle) {
        logger.info("Registering vehicle: {}", vehicle);

        // Check if the registration number exists in the DMT database
        Optional<DMT> dmtRecord = dmtRepository.findByRegistrationNumber(vehicle.getRegistrationNumber());
        if (dmtRecord.isEmpty()) {
            throw new IllegalArgumentException("Registration number not found in DMT database");
        }

        try {
            byte[] qrCode = QRCodeGenerator.getQRCodeImage(vehicle.getRegistrationNumber(), 250, 250);
            String qrCodeBase64 = Base64.getEncoder().encodeToString(qrCode);
            vehicle.setQrCode(qrCodeBase64);
        } catch (WriterException | IOException e) {
            logger.error("Error generating QR code", e);
        }
        return vehicleRepository.save(vehicle);
    }

    public Vehicle validateVehicle(String registrationNumber, String engineNumber) {
        logger.info("Validating vehicle with registration number: {} and engine number: {}", registrationNumber, engineNumber);
        Vehicle vehicle = vehicleRepository.findByRegistrationNumber(registrationNumber);
        if (vehicle != null && vehicle.getEngineNumber().equals(engineNumber)) {
            return vehicle;
        }
        return null;
    }

    public Vehicle updateWeekQuota(Long vehicleId, int pumpedAmount) {
        Optional<Vehicle> vehicleOptional = vehicleRepository.findById(vehicleId);
        if (vehicleOptional.isPresent()) {
            Vehicle vehicle = vehicleOptional.get();
            int newQuota = vehicle.getWeekQuota() - pumpedAmount;
            vehicle.setWeekQuota(newQuota);
            return vehicleRepository.save(vehicle);
        } else {
            throw new IllegalArgumentException("Vehicle not found with id: " + vehicleId);
        }
    }
}