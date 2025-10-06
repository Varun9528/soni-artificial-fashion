export const orderConfirmationTemplate = {
  en: {
    subject: 'Your Pachmarhi Order #{{orderId}} has been confirmed!',
    body: `
      <h2>Dear {{customerName}},</h2>
      
      <p>Thank you for shopping with Pachmarhi Tribal Art Marketplace!</p>
      
      <p>Your order has been successfully placed.</p>
      
      <h3>Order Summary:</h3>
      
      <ul>
        <li><strong>Order ID:</strong> #{{orderId}}</li>
        <li><strong>Date:</strong> {{orderDate}}</li>
        <li><strong>Total Amount:</strong> ₹{{totalAmount}}</li>
      </ul>
      
      <h4>Products:</h4>
      <ul>
        {{#products}}
        <li>{{name}} - ₹{{price}} (Qty: {{quantity}})</li>
        {{/products}}
      </ul>
      
      <h4>Shipping Address:</h4>
      <p>{{shippingAddress}}</p>
      
      <h4>Estimated Delivery:</h4>
      <p>5-7 business days</p>
      
      <p>We'll notify you when your order is shipped.</p>
      
      <p>Thank you for supporting our tribal artisans!</p>
      
      <p>Best regards,<br>
      The Pachmarhi Team</p>
    `
  },
  hi: {
    subject: 'आपका पचमढ़ी ऑर्डर #{{orderId}} पुष्टि कर दिया गया है!',
    body: `
      <h2>प्रिय {{customerName}},</h2>
      
      <p>पचमढ़ी जनजातीय कला बाजार के साथ खरीदारी करने के लिए धन्यवाद!</p>
      
      <p>आपका ऑर्डर सफलतापूर्वक दर्ज कर लिया गया है।</p>
      
      <h3>आदेश सारांश:</h3>
      
      <ul>
        <li><strong>आदेश आईडी:</strong> #{{orderId}}</li>
        <li><strong>तारीख:</strong> {{orderDate}}</li>
        <li><strong>कुल राशि:</strong> ₹{{totalAmount}}</li>
      </ul>
      
      <h4>उत्पाद:</h4>
      <ul>
        {{#products}}
        <li>{{name}} - ₹{{price}} (मात्रा: {{quantity}})</li>
        {{/products}}
      </ul>
      
      <h4>शिपिंग पता:</h4>
      <p>{{shippingAddress}}</p>
      
      <h4>अनुमानित डिलीवरी:</h4>
      <p>5-7 कार्य दिवस</p>
      
      <p>जब आपका ऑर्डर भेजा जाएगा तो हम आपको सूचित करेंगे।</p>
      
      <p>हमारे जनजातीय कारीगरों का समर्थन करने के लिए धन्यवाद!</p>
      
      <p>सादर,<br>
      पचमढ़ी टीम</p>
    `
  }
};