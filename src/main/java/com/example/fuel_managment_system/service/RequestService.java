// src/main/java/com/example/fuel_b/service/RequestService.java
package com.example.fuel_managment_system.service;

import com.example.fuel_managment_system.entity.Request;
import com.example.fuel_managment_system.repository.RequestRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class RequestService {

    @Autowired
    private RequestRepository requestRepository;

    public Request createRequest(Request request) {
        return requestRepository.save(request);
    }

    public Optional<Request> updateStatus(Long id, String status) {
        Optional<Request> request = requestRepository.findById(id);
        request.ifPresent(r -> {
            r.setStatus(status);
            requestRepository.save(r);
        });
        return request;
    }

    // src/main/java/com/example/fuel_b/service/RequestService.java
    public List<Request> getRequestsByStationId(Long stationId) {
        return requestRepository.findByFuelStationId(stationId);
    }

    //fetch all requests
    public List<Request> getAllRequests() {
        return requestRepository.findAll();
    }
}