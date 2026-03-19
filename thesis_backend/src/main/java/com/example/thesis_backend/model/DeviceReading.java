package com.example.thesis_backend.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Data
@Table(name = "device_readings")
public class DeviceReading {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Double latitude;
    private Double longitude;
    private Double voltage;
    private String status;
    private Integer rescuedCount;
    private String location;

    // NEW: Spike detection flag
    private Boolean spikeDetected;  // true if debounced spike confirmed
    private Integer spikeCount;      // consecutive spike readings

    @Column(name = "recorded_at")
    private LocalDateTime recordedAt;

    @PrePersist
    public void prePersist() {
        this.recordedAt = LocalDateTime.now();
        this.status = (this.voltage != null && this.voltage >= 30.0) ? "DANGER" : "SAFE";

        // Initialize spike fields if null
        if (this.spikeDetected == null) this.spikeDetected = false;
        if (this.spikeCount == null) this.spikeCount = 0;
    }
}