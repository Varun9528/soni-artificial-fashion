export const adminNotificationTemplate = {
  en: {
    subject: 'New Order Received – #{{orderId}}',
    body: `
      <h2>Hello Admin,</h2>
      
      <p>A new order has been placed on Pachmarhi Marketplace.</p>
      
      <h3>Order Details:</h3>
      
      <ul>
        <li><strong>Order ID:</strong> #{{orderId}}</li>
        <li><strong>Date:</strong> {{orderDate}}</li>
        <li><strong>Customer Name:</strong> {{customerName}}</li>
        <li><strong>Customer Email:</strong> {{customerEmail}}</li>
        <li><strong>Total Amount:</strong> ₹{{totalAmount}}</li>
      </ul>
      
      <h4>Products Ordered:</h4>
      <ul>
        {{#products}}
        <li>{{name}} - ₹{{price}} (Qty: {{quantity}})</li>
        {{/products}}
      </ul>
      
      <h4>Shipping Address:</h4>
      <p>{{shippingAddress}}</p>
      
      <p>Please process this order from the Admin Dashboard.</p>
      
      <p>Best regards,<br>
      Pachmarhi Marketplace System</p>
    `
  },
  hi: {
    subject: 'नया आदेश प्राप्त – #{{orderId}}',
    body: `
      <h2>नमस्ते प्रशासक,</h2>
      
      <p>पचमढ़ी बाजार पर एक नया ऑर्डर दिया गया है।</p>
      
      <h3>आदेश विवरण:</h3>
      
      <ul>
        <li><strong>आदेश आईडी:</strong> #{{orderId}}</li>
        <li><strong>तारीख:</strong> {{orderDate}}</li>
        <li><strong>ग्राहक का नाम:</strong> {{customerName}}</li>
        <li><strong>ग्राहक ईमेल:</strong> {{customerEmail}}</li>
        <li><strong>कुल राशि:</strong> ₹{{totalAmount}}</li>
      </ul>
      
      <h4>आदेशित उत्पाद:</h4>
      <ul>
        {{#products}}
        <li>{{name}} - ₹{{price}} (मात्रा: {{quantity}})</li>
        {{/products}}
      </ul>
      
      <h4>शिपिंग पता:</h4>
      <p>{{shippingAddress}}</p>
      
      <p>कृपया प्रशासक डैशबोर्ड से इस आदेश की प्रक्रिया करें।</p>
      
      <p>सादर,<br>
      पचमढ़ी बाजार प्रणाली</p>
    `
  }
};