package com.example.thesis_backend.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Data
@Table(name = "sms_alerts")
public class SmsAlert {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String recipientName;
    private String phoneNumber;
    private String location;
    private Double voltage;
    private String status;

    @Column(name = "sent_at")
    private LocalDateTime sentAt;

    @PrePersist
    public void prePersist() {
        this.sentAt = LocalDateTime.now();
    }

    public String getMaskedPhoneNumber() {
        if (phoneNumber == null || phoneNumber.length() < 6) {
            return "****";
        }
        String first2 = phoneNumber.substring(0, 2);
        String last4 = phoneNumber.substring(phoneNumber.length() - 4);
        int maskedCount = phoneNumber.length() - 6;
        String masked = "*".repeat(maskedCount);
        return first2 + masked + last4;
    }
}