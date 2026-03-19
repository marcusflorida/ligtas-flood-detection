package com.example.thesis_backend.controller;

import com.example.thesis_backend.model.DeviceReading;
import com.example.thesis_backend.service.DeviceReadingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/readings")
@CrossOrigin(origins = "http://localhost:5173")
public class DeviceController {

    @Autowired
    private DeviceReadingService service;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;  // WebSocket messaging

    @GetMapping
    public List<DeviceReading> getAllReadings() {
        return service.getAllReadings();
    }

    @PostMapping
    public DeviceReading createReading(@RequestBody DeviceReading reading) {
        DeviceReading saved = service.saveReading(reading);

        // Broadcast new reading to all WebSocket clients in real-time
        messagingTemplate.convertAndSend("/topic/readings", saved);

        return saved;
    }

    @GetMapping("/filter")
    public List<DeviceReading> filterByStatus(@RequestParam String status) {
        return service.getReadingsByStatus(status);
    }

    @GetMapping("/summary")
    public Map<String, Object> getSummary() {
        List<DeviceReading> all = service.getAllReadings();

        long dangerCount = all.stream()
                .filter(r -> "DANGER".equals(r.getStatus()))
                .count();

        long safeCount = all.stream()
                .filter(r -> "SAFE".equals(r.getStatus()))
                .count();

        long totalRescued = all.stream()
                .mapToInt(DeviceReading::getRescuedCount)
                .sum();

        double avgVoltage = all.stream()
                .mapToDouble(DeviceReading::getVoltage)
                .average()
                .orElse(0.0);

        Map<String, Object> summary = new HashMap<>();
        summary.put("totalReadings", all.size());
        summary.put("dangerCount", dangerCount);
        summary.put("safeCount", safeCount);
        summary.put("totalRescued", totalRescued);
        summary.put("avgVoltage", Math.round(avgVoltage * 100.0) / 100.0);

        return summary;
    }

    @GetMapping("/analytics")
    public List<Map<String, Object>> getLocationAnalytics() {
        List<DeviceReading> all = service.getAllReadings();

        Map<String, Integer> rescuedByLocation = new HashMap<>();
        Map<String, Integer> dangerByLocation = new HashMap<>();
        Map<String, Integer> safeByLocation = new HashMap<>();

        for (DeviceReading reading : all) {
            String location = reading.getLocation();
            int rescued = reading.getRescuedCount();

            rescuedByLocation.put(location,
                    rescuedByLocation.getOrDefault(location, 0) + rescued);

            if ("DANGER".equals(reading.getStatus())) {
                dangerByLocation.put(location,
                        dangerByLocation.getOrDefault(location, 0) + 1);
            } else {
                safeByLocation.put(location,
                        safeByLocation.getOrDefault(location, 0) + 1);
            }
        }

        return rescuedByLocation.entrySet().stream()
                .map(entry -> {
                    Map<String, Object> stat = new HashMap<>();
                    stat.put("location", entry.getKey());
                    stat.put("totalRescued", entry.getValue());
                    stat.put("dangerReadings", dangerByLocation.getOrDefault(entry.getKey(), 0));
                    stat.put("safeReadings", safeByLocation.getOrDefault(entry.getKey(), 0));
                    return stat;
                })
                .collect(Collectors.toList());
    }
}