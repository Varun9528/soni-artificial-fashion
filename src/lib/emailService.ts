// Enhanced email service with better logging and simulation

interface EmailOptions {
  to: string;
  subject: string;
  text: string;
  html?: string;
}

export const sendEmail = async (options: EmailOptions): Promise<boolean> => {
  try {
    // Log email details in a more visible way
    console.log('📧 === EMAIL NOTIFICATION ===');
    console.log('To:', options.to);
    console.log('Subject:', options.subject);
    console.log('Text:', options.text);
    console.log('HTML Preview:', options.html ? options.html.substring(0, 200) + '...' : 'None');
    console.log('============================');
    
    // In production, you would integrate with an email service here
    // For now, we'll simulate email sending with a delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Mock successful email sending
    console.log('✅ Email notification sent successfully to:', options.to);
    return true;
  } catch (error) {
    console.error('❌ Failed to send email notification:', error);
    return false;
  }
};

// Order confirmation email template
export const getOrderConfirmationEmail = (orderData: {
  customerName: string;
  orderId: string;
  trackingLink: string;
  language: 'en' | 'hi';
}) => {
  const { customerName, orderId, trackingLink, language } = orderData;
  
  if (language === 'hi') {
    return {
      subject: "ऑर्डर की पुष्टि – पचमढ़ी ट्राइबल आर्ट मार्केटप्लेस",
      text: `नमस्ते ${customerName},
आपका ऑर्डर #${orderId} सफलतापूर्वक प्राप्त हो गया है। आपका ट्राइबल आर्ट प्रोडक्ट जल्द ही भेज दिया जाएगा।
अपना ऑर्डर यहाँ ट्रैक करें: ${trackingLink}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #d97706;">नमस्ते ${customerName},</h2>
          <p>आपका ऑर्डर <strong>#${orderId}</strong> सफलतापूर्वक प्राप्त हो गया है। आपका ट्राइबल आर्ट प्रोडक्ट जल्द ही भेज दिया जाएगा।</p>
          <p><a href="${trackingLink}" style="background-color: #d97706; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">अपना ऑर्डर यहाँ ट्रैक करें</a></p>
          <p>धन्यवाद,<br/>पचमढ़ी ट्राइबल आर्ट मार्केटप्लेस टीम</p>
        </div>
      `
    };
  } else {
    return {
      subject: "Order Confirmation – Pachmarhi Tribal Art Marketplace",
      text: `Hello ${customerName},
Thank you for your order #${orderId}. Your tribal art product(s) will be shipped soon.
Track your order here: ${trackingLink}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #d97706;">Hello ${customerName},</h2>
          <p>Thank you for your order <strong>#${orderId}</strong>. Your tribal art product(s) will be shipped soon.</p>
          <p><a href="${trackingLink}" style="background-color: #d97706; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Track your order here</a></p>
          <p>Thank you,<br/>Pachmarhi Tribal Art Marketplace Team</p>
        </div>
      `
    };
  }
};

// Order shipped email template
export const getOrderShippedEmail = (orderData: {
  customerName: string;
  orderId: string;
  shippedDate: string;
  trackingNumber: string;
  shippingPartner: string;
  estimatedDeliveryDate: string;
  language: 'en' | 'hi';
}) => {
  const { customerName, orderId, shippedDate, trackingNumber, shippingPartner, estimatedDeliveryDate, language } = orderData;
  
  if (language === 'hi') {
    return {
      subject: `आपका पचमढ़ी ऑर्डर #${orderId} भेज दिया गया है!`,
      text: `नमस्ते ${customerName},

बहुत अच्छी खबर! आपका ऑर्डर #${orderId} भेज दिया गया है और आपके पास आ रहा है।

ऑर्डर विवरण:
- ऑर्डर आईडी: #${orderId}
- भेजे गए तिथि: ${shippedDate}
- ट्रैकिंग नंबर: ${trackingNumber}
- शिपिंग साझेदार: ${shippingPartner}

आप ऊपर दिए गए ट्रैकिंग नंबर का उपयोग करके अपने ऑर्डर को ट्रैक कर सकते हैं।

अनुमानित डिलीवरी तिथि: ${estimatedDeliveryDate}

पचमढ़ी जनजातीय कला बाजार के साथ खरीदारी करने के लिए धन्यवाद!

सादर,
पचमढ़ी टीम`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #d97706;">नमस्ते ${customerName},</h2>
          <p>बहुत अच्छी खबर! आपका ऑर्डर <strong>#${orderId}</strong> भेज दिया गया है और आपके पास आ रहा है।</p>
          
          <h3>ऑर्डर विवरण:</h3>
          
          <ul>
            <li><strong>ऑर्डर आईडी:</strong> #${orderId}</li>
            <li><strong>भेजे गए तिथि:</strong> ${shippedDate}</li>
            <li><strong>ट्रैकिंग नंबर:</strong> ${trackingNumber}</li>
            <li><strong>शिपिंग साझेदार:</strong> ${shippingPartner}</li>
          </ul>
          
          <p>आप ऊपर दिए गए ट्रैकिंग नंबर का उपयोग करके अपने ऑर्डर को ट्रैक कर सकते हैं।</p>
          
          <p><strong>अनुमानित डिलीवरी तिथि:</strong> ${estimatedDeliveryDate}</p>
          
          <p>पचमढ़ी जनजातीय कला बाजार के साथ खरीदारी करने के लिए धन्यवाद!</p>
          
          <p>सादर,<br/>पचमढ़ी टीम</p>
        </div>
      `
    };
  } else {
    return {
      subject: `Your Pachmarhi Order #${orderId} has been Shipped!`,
      text: `Hello ${customerName},

Great news! Your order #${orderId} has been shipped and is on its way to you.

Order Details:
- Order ID: #${orderId}
- Shipped Date: ${shippedDate}
- Tracking Number: ${trackingNumber}
- Shipping Partner: ${shippingPartner}

You can track your order using the tracking number provided above.

Estimated Delivery Date: ${estimatedDeliveryDate}

Thank you for shopping with Pachmarhi Tribal Art Marketplace!

Best regards,
The Pachmarhi Team`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #d97706;">Hello ${customerName},</h2>
          <p>Great news! Your order <strong>#${orderId}</strong> has been shipped and is on its way to you.</p>
          
          <h3>Order Details:</h3>
          
          <ul>
            <li><strong>Order ID:</strong> #${orderId}</li>
            <li><strong>Shipped Date:</strong> ${shippedDate}</li>
            <li><strong>Tracking Number:</strong> ${trackingNumber}</li>
            <li><strong>Shipping Partner:</strong> ${shippingPartner}</li>
          </ul>
          
          <p>You can track your order using the tracking number provided above.</p>
          
          <p><strong>Estimated Delivery Date:</strong> ${estimatedDeliveryDate}</p>
          
          <p>Thank you for shopping with Pachmarhi Tribal Art Marketplace!</p>
          
          <p>Best regards,<br/>The Pachmarhi Team</p>
        </div>
      `
    };
  }
};

// Order out for delivery email template
export const getOrderOutForDeliveryEmail = (orderData: {
  customerName: string;
  orderId: string;
  outForDeliveryDate: string;
  trackingNumber: string;
  deliveryExecutive: string;
  totalAmount: number;
  expectedDeliveryTime: string;
  language: 'en' | 'hi';
}) => {
  const { customerName, orderId, outForDeliveryDate, trackingNumber, deliveryExecutive, totalAmount, expectedDeliveryTime, language } = orderData;
  
  if (language === 'hi') {
    return {
      subject: `आपका पचमढ़ी ऑर्डर #${orderId} डिलीवरी के लिए निकला है!`,
      text: `नमस्ते ${customerName},

आपका ऑर्डर #${orderId} डिलीवरी के लिए निकल गया है और जल्द ही आप तक पहुंच जाएगा!

ऑर्डर विवरण:
- ऑर्डर आईडी: #${orderId}
- डिलीवरी के लिए निकले की तिथि: ${outForDeliveryDate}
- ट्रैकिंग नंबर: ${trackingNumber}
- डिलीवरी कार्यकर्ता: ${deliveryExecutive}

कृपया कैश ऑन डिलीवरी के लिए ₹${totalAmount} तैयार रखें।

अपेक्षित डिलीवरी समय: ${expectedDeliveryTime}

पचमढ़ी जनजातीय कला बाजार के साथ खरीदारी करने के लिए धन्यवाद!

सादर,
पचमढ़ी टीम`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #d97706;">नमस्ते ${customerName},</h2>
          <p>आपका ऑर्डर <strong>#${orderId}</strong> डिलीवरी के लिए निकल गया है और जल्द ही आप तक पहुंच जाएगा!</p>
          
          <h3>ऑर्डर विवरण:</h3>
          
          <ul>
            <li><strong>ऑर्डर आईडी:</strong> #${orderId}</li>
            <li><strong>डिलीवरी के लिए निकले की तिथि:</strong> ${outForDeliveryDate}</li>
            <li><strong>ट्रैकिंग नंबर:</strong> ${trackingNumber}</li>
            <li><strong>डिलीवरी कार्यकर्ता:</strong> ${deliveryExecutive}</li>
          </ul>
          
          <p>कृपया कैश ऑन डिलीवरी के लिए <strong>₹${totalAmount}</strong> तैयार रखें।</p>
          
          <p><strong>अपेक्षित डिलीवरी समय:</strong> ${expectedDeliveryTime}</p>
          
          <p>पचमढ़ी जनजातीय कला बाजार के साथ खरीदारी करने के लिए धन्यवाद!</p>
          
          <p>सादर,<br/>पचमढ़ी टीम</p>
        </div>
      `
    };
  } else {
    return {
      subject: `Your Pachmarhi Order #${orderId} is Out for Delivery!`,
      text: `Hello ${customerName},

Your order #${orderId} is out for delivery and will reach you soon!

Order Details:
- Order ID: #${orderId}
- Out for Delivery Date: ${outForDeliveryDate}
- Tracking Number: ${trackingNumber}
- Delivery Executive: ${deliveryExecutive}

Please keep ₹${totalAmount} ready for cash on delivery.

Expected Delivery Time: ${expectedDeliveryTime}

Thank you for shopping with Pachmarhi Tribal Art Marketplace!

Best regards,
The Pachmarhi Team`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #d97706;">Hello ${customerName},</h2>
          <p>Your order <strong>#${orderId}</strong> is out for delivery and will reach you soon!</p>
          
          <h3>Order Details:</h3>
          
          <ul>
            <li><strong>Order ID:</strong> #${orderId}</li>
            <li><strong>Out for Delivery Date:</strong> ${outForDeliveryDate}</li>
            <li><strong>Tracking Number:</strong> ${trackingNumber}</li>
            <li><strong>Delivery Executive:</strong> ${deliveryExecutive}</li>
          </ul>
          
          <p>Please keep <strong>₹${totalAmount}</strong> ready for cash on delivery.</p>
          
          <p><strong>Expected Delivery Time:</strong> ${expectedDeliveryTime}</p>
          
          <p>Thank you for shopping with Pachmarhi Tribal Art Marketplace!</p>
          
          <p>Best regards,<br/>The Pachmarhi Team</p>
        </div>
      `
    };
  }
};

// Order delivered email template
export const getOrderDeliveredEmail = (orderData: {
  customerName: string;
  orderId: string;
  deliveredDate: string;
  totalAmount: number;
  language: 'en' | 'hi';
}) => {
  const { customerName, orderId, deliveredDate, totalAmount, language } = orderData;
  
  if (language === 'hi') {
    return {
      subject: `आपका पचमढ़ी ऑर्डर #${orderId} डिलीवर हो गया है!`,
      text: `नमस्ते ${customerName},

हम आपको सूचित करने में खुशी महसूस करते हैं कि आपका ऑर्डर #${orderId} सफलतापूर्वक डिलीवर हो गया है!

ऑर्डर विवरण:
- ऑर्डर आईडी: #${orderId}
- डिलीवर की तिथि: ${deliveredDate}
- कुल राशि: ₹${totalAmount}

हम आशा करते हैं कि आपको हमारे जनजातीय कला उत्पाद पसंद आएंगे। यदि आपके कोई प्रतिक्रिया है या सहायता की आवश्यकता है, तो कृपया हमसे संपर्क करें।

हमारे जनजातीय कारीगरों का समर्थन करने के लिए धन्यवाद!

सादर,
पचमढ़ी टीम`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #d97706;">नमस्ते ${customerName},</h2>
          <p>हम आपको सूचित करने में खुशी महसूस करते हैं कि आपका ऑर्डर <strong>#${orderId}</strong> सफलतापूर्वक डिलीवर हो गया है!</p>
          
          <h3>ऑर्डर विवरण:</h3>
          
          <ul>
            <li><strong>ऑर्डर आईडी:</strong> #${orderId}</li>
            <li><strong>डिलीवर की तिथि:</strong> ${deliveredDate}</li>
            <li><strong>कुल राशि:</strong> ₹${totalAmount}</li>
          </ul>
          
          <p>हम आशा करते हैं कि आपको हमारे जनजातीय कला उत्पाद पसंद आएंगे। यदि आपके कोई प्रतिक्रिया है या सहायता की आवश्यकता है, तो कृपया हमसे संपर्क करें।</p>
          
          <p>हमारे जनजातीय कारीगरों का समर्थन करने के लिए धन्यवाद!</p>
          
          <p>सादर,<br/>पचमढ़ी टीम</p>
        </div>
      `
    };
  } else {
    return {
      subject: `Your Pachmarhi Order #${orderId} has been Delivered!`,
      text: `Hello ${customerName},

We're happy to inform you that your order #${orderId} has been successfully delivered!

Order Details:
- Order ID: #${orderId}
- Delivered Date: ${deliveredDate}
- Total Amount: ₹${totalAmount}

We hope you love your tribal art products. If you have any feedback or need assistance, please feel free to contact us.

Thank you for supporting our tribal artisans!

Best regards,
The Pachmarhi Team`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #d97706;">Hello ${customerName},</h2>
          <p>We're happy to inform you that your order <strong>#${orderId}</strong> has been successfully delivered!</p>
          
          <h3>Order Details:</h3>
          
          <ul>
            <li><strong>Order ID:</strong> #${orderId}</li>
            <li><strong>Delivered Date:</strong> ${deliveredDate}</li>
            <li><strong>Total Amount:</strong> ₹${totalAmount}</li>
          </ul>
          
          <p>We hope you love your tribal art products. If you have any feedback or need assistance, please feel free to contact us.</p>
          
          <p>Thank you for supporting our tribal artisans!</p>
          
          <p>Best regards,<br/>The Pachmarhi Team</p>
        </div>
      `
    };
  }
};