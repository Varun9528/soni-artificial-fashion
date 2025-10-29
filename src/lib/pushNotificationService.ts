// Enhanced push notification service with better browser notification support

interface PushNotificationOptions {
  title: string;
  body: string;
  icon?: string;
  tag?: string;
  data?: any;
}

export class PushNotificationService {
  private static instance: PushNotificationService;
  private language: string = 'en';

  private constructor() {}

  static getInstance(): PushNotificationService {
    if (!PushNotificationService.instance) {
      PushNotificationService.instance = new PushNotificationService();
    }
    return PushNotificationService.instance;
  }

  setLanguage(language: string) {
    this.language = language;
  }

  // Mock localization function
  private t = (key: string) => {
    const translations: any = {
      en: {
        orderShipped: "Your order #[ID] has been shipped!",
        orderOutForDelivery: "Your order #[ID] is out for delivery.",
        orderDelivered: "Your order #[ID] has been delivered."
      },
      hi: {
        orderShipped: "आपका ऑर्डर #[ID] भेज दिया गया है!",
        orderOutForDelivery: "आपका ऑर्डर #[ID] डिलीवरी के लिए निकला है।",
        orderDelivered: "आपका ऑर्डर #[ID] डिलीवर हो गया है।"
      }
    };
    
    return translations[this.language][key] || key;
  };

  async requestPermission(): Promise<boolean> {
    // In production, request notification permission from the browser
    console.log('🔔 Requesting notification permission...');
    
    // Check if browser supports notifications
    if (!('Notification' in window)) {
      console.log('❌ This browser does not support desktop notification');
      return false;
    }
    
    // Check if permission has already been granted
    if (Notification.permission === 'granted') {
      console.log('✅ Notification permission already granted');
      return true;
    }
    
    // Request permission
    if (Notification.permission !== 'denied') {
      try {
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
          console.log('✅ Notification permission granted');
          return true;
        } else {
          console.log('❌ Notification permission denied');
          return false;
        }
      } catch (error) {
        console.error('❌ Error requesting notification permission:', error);
        return false;
      }
    }
    
    console.log('❌ Notification permission denied');
    return false;
  }

  async sendNotification(options: PushNotificationOptions): Promise<boolean> {
    try {
      // Log the notification for debugging
      console.log('🔔 Sending push notification:', options);
      
      // Show browser notification if supported and permission is granted
      if ('Notification' in window && Notification.permission === 'granted') {
        // Create notification with click handler
        const notification = new Notification(options.title, {
          body: options.body,
          icon: options.icon || '/images/logo/logo-png.png',
          tag: options.tag,
          data: options.data
        });
        
        // Add click handler to redirect to order tracking page
        notification.onclick = function(event) {
          event.preventDefault();
          if (options.data && options.data.orderId) {
            // In a real implementation, this would navigate to the order tracking page
            window.open(`/track-order?orderId=${options.data.orderId}`, '_blank');
          }
        };
        
        console.log('✅ Browser notification sent successfully');
      } else {
        // Fallback: Show alert if notifications aren't supported or permission is denied
        console.log('ℹ️  Browser notification not supported or permission denied, showing alert instead');
        // In a real implementation, you might want to show a toast notification or similar
        alert(`${options.title}\n${options.body}`);
      }
      
      return true;
    } catch (error) {
      console.error('❌ Failed to send push notification:', error);
      return false;
    }
  }

  async sendOrderShippedNotification(orderId: string): Promise<boolean> {
    const title = this.language === 'hi' ? "ऑर्डर भेज दिया गया" : "Order Shipped";
    const body = this.t('orderShipped').replace('[ID]', orderId);
    
    return this.sendNotification({
      title,
      body,
      tag: `order-shipped-${orderId}`,
      data: { orderId, type: 'shipped' }
    });
  }

  async sendOrderOutForDeliveryNotification(orderId: string): Promise<boolean> {
    const title = this.language === 'hi' ? "डिलीवरी के लिए निकला" : "Out for Delivery";
    const body = this.t('orderOutForDelivery').replace('[ID]', orderId);
    
    return this.sendNotification({
      title,
      body,
      tag: `order-out-for-delivery-${orderId}`,
      data: { orderId, type: 'out-for-delivery' }
    });
  }

  async sendOrderDeliveredNotification(orderId: string): Promise<boolean> {
    const title = this.language === 'hi' ? "ऑर्डर डिलीवर हो गया" : "Order Delivered";
    const body = this.t('orderDelivered').replace('[ID]', orderId);
    
    return this.sendNotification({
      title,
      body,
      tag: `order-delivered-${orderId}`,
      data: { orderId, type: 'delivered' }
    });
  }
}

// Export singleton instance
export const pushNotificationService = PushNotificationService.getInstance();