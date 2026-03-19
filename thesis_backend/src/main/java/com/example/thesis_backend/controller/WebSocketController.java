package com.example.thesis_backend.controller;

import com.example.thesis_backend.model.DeviceReading;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

@Controller
public class WebSocketController {
    @MessageMapping("/device-update")
    @SendTo("/topic/readings")
    public DeviceReading sendDeviceUpdate(DeviceReading reading) {
        System.out.println("Received device update: " + reading);
        return reading;  // Broadcast to all connected clients
    }
}