// Mock push notification service - in production, integrate with Firebase, OneSignal, or similar

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
    
    // Simulate permission request
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log('✅ Notification permission granted');
        resolve(true);
      }, 500);
    });
  }

  async sendNotification(options: PushNotificationOptions): Promise<boolean> {
    try {
      // In production, send actual push notification
      console.log('🔔 Sending push notification:', options);
      
      // Simulate notification delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Show browser notification if supported
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification(options.title, {
          body: options.body,
          icon: options.icon || '/favicon.ico',
          tag: options.tag,
          data: options.data
        });
      }
      
      console.log('✅ Push notification sent successfully');
      return true;
    } catch (error) {
      console.error('❌ Failed to send push notification:', error);
      return false;
    }
  }

  async sendOrderShippedNotification(orderId: string): Promise<boolean> {
    const title = "Order Shipped";
    const body = this.t('orderShipped').replace('[ID]', orderId);
    
    return this.sendNotification({
      title,
      body,
      tag: `order-shipped-${orderId}`,
      data: { orderId, type: 'shipped' }
    });
  }

  async sendOrderOutForDeliveryNotification(orderId: string): Promise<boolean> {
    const title = "Out for Delivery";
    const body = this.t('orderOutForDelivery').replace('[ID]', orderId);
    
    return this.sendNotification({
      title,
      body,
      tag: `order-out-for-delivery-${orderId}`,
      data: { orderId, type: 'out-for-delivery' }
    });
  }

  async sendOrderDeliveredNotification(orderId: string): Promise<boolean> {
    const title = "Order Delivered";
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