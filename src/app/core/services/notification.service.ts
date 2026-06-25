import { Injectable, signal, OnDestroy } from '@angular/core';

export interface AppNotification {
  id: string;
  type: 'COURSE_CREATED' | 'COURSE_UPDATED';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService implements OnDestroy {
  private ws: WebSocket | null = null;
  
  notifications = signal<AppNotification[]>([]);
  unreadCount = signal<number>(0);

  constructor() {
    this.connect();
  }

  private connect() {
    try {
      this.ws = new WebSocket('ws://localhost:8080');
      
      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          this.handleIncomingNotification(data);
        } catch (e) {
          console.error('Error parsing websocket message', e);
        }
      };

      this.ws.onclose = () => {
        console.log('WebSocket connection closed. Retrying in 5s...');
        setTimeout(() => this.connect(), 5000);
      };
      
      this.ws.onerror = (error) => {
        console.error('WebSocket error:', error);
      };
    } catch (e) {
      console.error('WebSocket initialization failed', e);
    }
  }

  private handleIncomingNotification(data: any) {
    if (data && data.type && data.title) {
      const newNotification: AppNotification = {
        id: Math.random().toString(36).substr(2, 9),
        type: data.type,
        title: data.title,
        message: data.message || '',
        timestamp: new Date(),
        read: false
      };
      
      this.notifications.update(current => [newNotification, ...current]);
      this.unreadCount.update(count => count + 1);
    }
  }

  broadcast(type: 'COURSE_CREATED' | 'COURSE_UPDATED', title: string, message: string) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ type, title, message }));
    } else {
      console.warn('WebSocket not connected. Cannot send notification.');
      // Fallback local notification just in case ws is down
      this.handleIncomingNotification({ type, title, message });
    }
  }

  markAllAsRead() {
    this.notifications.update(current => current.map(n => ({ ...n, read: true })));
    this.unreadCount.set(0);
  }

  ngOnDestroy() {
    if (this.ws) {
      this.ws.close();
    }
  }
}
