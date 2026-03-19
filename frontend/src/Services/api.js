import axios from 'axios';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';

const API = axios.create({
  baseURL: 'http://localhost:8080/api'
});

export const getAllReadings = () => API.get('/readings');
export const createReading = (data) => API.post('/readings', data);
export const filterByStatus = (status) => API.get(`/readings/filter?status=${status}`);
export const getSummary = () => API.get('/readings/summary');
export const getAnalytics = () => API.get('/readings/analytics');
export const getAllSmsAlerts = () => API.get('/sms');
export const sendSmsAlert = (data) => API.post('/sms', data);

// WebSocket connection for real-time updates
export const connectWebSocket = (onMessageReceived) => {
  const socket = new SockJS('http://localhost:8080/ws');
  const stompClient = new Client({
    webSocketFactory: () => socket,
    reconnectDelay: 5000,
    heartbeatIncoming: 4000,
    heartbeatOutgoing: 4000,
    
    onConnect: () => {
      console.log('✅ WebSocket Connected!');
      
      // Subscribe to real-time device readings
      stompClient.subscribe('/topic/readings', (message) => {
        const reading = JSON.parse(message.body);
        console.log('📡 New reading received:', reading);
        onMessageReceived(reading);
      });
    },
    
    onDisconnect: () => {
      console.log('❌ WebSocket Disconnected');
    },
    
    onStompError: (frame) => {
      console.error('❌ WebSocket error:', frame);
    }
  });

  stompClient.activate();
  return stompClient;
};

export default API;