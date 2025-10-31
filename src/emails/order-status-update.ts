export const orderStatusUpdateTemplate = {
  // Order Shipped Template
  shipped: {
    en: {
      subject: 'Your Soni Fashion Order #{{orderId}} has been Shipped!',
      body: `
        <h2>Dear {{customerName}},</h2>
        
        <p>Great news! Your order has been shipped and is on its way to you.</p>
        
        <h3>Order Details:</h3>
        
        <ul>
          <li><strong>Order ID:</strong> #{{orderId}}</li>
          <li><strong>Shipped Date:</strong> {{shippedDate}}</li>
          <li><strong>Tracking Number:</strong> {{trackingNumber}}</li>
          <li><strong>Shipping Partner:</strong> {{shippingPartner}}</li>
        </ul>
        
        <p>You can track your order using the tracking number provided above.</p>
        
        <p>Estimated Delivery Date: {{estimatedDeliveryDate}}</p>
        
        <p>Thank you for shopping with Soni Artificial Fashion Marketplace!</p>
        
        <p>Best regards,<br>
        The Soni Fashion Team</p>
      `
    },
    hi: {
      subject: 'आपका सोनी फैशन ऑर्डर #{{orderId}} भेज दिया गया है!',
      body: `
        <h2>प्रिय {{customerName}},</h2>
        
        <p>बहुत अच्छी खबर! आपका ऑर्डर भेज दिया गया है और आपके पास आ रहा है।</p>
        
        <h3>आदेश विवरण:</h3>
        
        <ul>
          <li><strong>आदेश आईडी:</strong> #{{orderId}}</li>
          <li><strong>भेजे गए तिथि:</strong> {{shippedDate}}</li>
          <li><strong>ट्रैकिंग नंबर:</strong> {{trackingNumber}}</li>
          <li><strong>शिपिंग साझेदार:</strong> {{shippingPartner}}</li>
        </ul>
        
        <p>आप ऊपर दिए गए ट्रैकिंग नंबर का उपयोग करके अपने ऑर्डर को ट्रैक कर सकते हैं।</p>
        
        <p>अनुमानित डिलीवरी तिथि: {{estimatedDeliveryDate}}</p>
        
        <p>सोनी कृत्रिम फैशन मार्केटप्लेस के साथ खरीदारी करने के लिए धन्यवाद!</p>
        
        <p>सादर,<br>
        सोनी फैशन टीम</p>
      `
    }
  },
  
  // Order Out for Delivery Template
  outForDelivery: {
    en: {
      subject: 'Your Soni Fashion Order #{{orderId}} is Out for Delivery!',
      body: `
        <h2>Dear {{customerName}},</h2>
        
        <p>Your order is out for delivery and will reach you soon!</p>
        
        <h3>Order Details:</h3>
        
        <ul>
          <li><strong>Order ID:</strong> #{{orderId}}</li>
          <li><strong>Out for Delivery Date:</strong> {{outForDeliveryDate}}</li>
          <li><strong>Tracking Number:</strong> {{trackingNumber}}</li>
          <li><strong>Delivery Executive:</strong> {{deliveryExecutive}}</li>
        </ul>
        
        <p>Please keep ₹{{totalAmount}} ready for cash on delivery.</p>
        
        <p>Expected Delivery Time: {{expectedDeliveryTime}}</p>
        
        <p>Thank you for shopping with Soni Artificial Fashion Marketplace!</p>
        
        <p>Best regards,<br>
        The Soni Fashion Team</p>
      `
    },
    hi: {
      subject: 'आपका सोनी फैशन ऑर्डर #{{orderId}} डिलीवरी के लिए निकला है!',
      body: `
        <h2>प्रिय {{customerName}},</h2>
        
        <p>आपका ऑर्डर डिलीवरी के लिए निकल गया है और जल्द ही आप तक पहुंच जाएगा!</p>
        
        <h3>आदेश विवरण:</h3>
        
        <ul>
          <li><strong>आदेश आईडी:</strong> #{{orderId}}</li>
          <li><strong>डिलीवरी के लिए निकले की तिथि:</strong> {{outForDeliveryDate}}</li>
          <li><strong>ट्रैकिंग नंबर:</strong> {{trackingNumber}}</li>
          <li><strong>डिलीवरी कार्यकर्ता:</strong> {{deliveryExecutive}}</li>
        </ul>
        
        <p>कृपया कैश ऑन डिलीवरी के लिए ₹{{totalAmount}} तैयार रखें।</p>
        
        <p>अपेक्षित डिलीवरी समय: {{expectedDeliveryTime}}</p>
        
        <p>सोनी कृत्रिम फैशन मार्केटप्लेस के साथ खरीदारी करने के लिए धन्यवाद!</p>
        
        <p>सादर,<br>
        सोनी फैशन टीम</p>
      `
    }
  },
  
  // Order Delivered Template
  delivered: {
    en: {
      subject: 'Your Soni Fashion Order #{{orderId}} has been Delivered!',
      body: `
        <h2>Dear {{customerName}},</h2>
        
        <p>We're happy to inform you that your order has been successfully delivered!</p>
        
        <h3>Order Details:</h3>
        
        <ul>
          <li><strong>Order ID:</strong> #{{orderId}}</li>
          <li><strong>Delivered Date:</strong> {{deliveredDate}}</li>
          <li><strong>Total Amount:</strong> ₹{{totalAmount}}</li>
        </ul>
        
        <p>We hope you love your artificial fashion products. If you have any feedback or need assistance, please feel free to contact us.</p>
        
        <p>Thank you for supporting our artisans!</p>
        
        <p>Best regards,<br>
        The Soni Fashion Team</p>
      `
    },
    hi: {
      subject: 'आपका सोनी फैशन ऑर्डर #{{orderId}} डिलीवर हो गया है!',
      body: `
        <h2>प्रिय {{customerName}},</h2>
        
        <p>हम आपको सूचित करने में खुशी महसूस करते हैं कि आपका ऑर्डर सफलतापूर्वक डिलीवर हो गया है!</p>
        
        <h3>आदेश विवरण:</h3>
        
        <ul>
          <li><strong>आदेश आईडी:</strong> #{{orderId}}</li>
          <li><strong>डिलीवर की तिथि:</strong> {{deliveredDate}}</li>
          <li><strong>कुल राशि:</strong> ₹{{totalAmount}}</li>
        </ul>
        
        <p>हम आशा करते हैं कि आपको हमारे कृत्रिम फैशन उत्पाद पसंद आएंगे। यदि आपके कोई प्रतिक्रिया है या सहायता की आवश्यकता है, तो कृपया हमसे संपर्क करें।</p>
        
        <p>हमारे कारीगरों का समर्थन करने के लिए धन्यवाद!</p>
        
        <p>सादर,<br>
        सोनी फैशन टीम</p>
      `
    }
  }
};