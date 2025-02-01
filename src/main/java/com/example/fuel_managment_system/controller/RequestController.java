// src/main/java/com/example/fuel_b/controller/RequestController.java
package com.example.fuel_b.controller;

import com.example.fuel_b.entity.Request;
import com.example.fuel_b.service.RequestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/requests")
public class RequestController {

    @Autowired
    private RequestService requestService;

    @PostMapping
    public ResponseEntity<Request> createRequest(@RequestBody Request request) {
        Request createdRequest = requestService.createRequest(request);
        return ResponseEntity.ok(createdRequest);
    }

    //update request status by id
    @PutMapping("/{id}/status")
    public ResponseEntity<Request> updateStatus(@PathVariable Long id, @RequestBody Map<String, String> statusUpdate) {
        String status = statusUpdate.get("status");
        return requestService.updateStatus(id, status)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }


    // src/main/java/com/example/fuel_b/controller/RequestController.java
    @GetMapping("/all/{stationId}")
    public ResponseEntity<List<Request>> getRequestsByStationId(@PathVariable Long stationId) {
        List<Request> requests = requestService.getRequestsByStationId(stationId);
        return ResponseEntity.ok(requests);
    }

    //fetch all requests
    @GetMapping("/all")
    public ResponseEntity<List<Request>> getAllRequests() {
        List<Request> requests = requestService.getAllRequests();
        return ResponseEntity.ok(requests);
    }
}