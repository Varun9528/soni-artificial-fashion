// Mock email service - in production, integrate with a real email service like Nodemailer, SendGrid, etc.

interface EmailOptions {
  to: string;
  subject: string;
  text: string;
  html?: string;
}

export const sendEmail = async (options: EmailOptions): Promise<boolean> => {
  try {
    // In production, you would integrate with an email service here
    console.log('📧 Sending email:', {
      to: options.to,
      subject: options.subject,
      text: options.text,
      html: options.html
    });
    
    // Simulate email sending delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock successful email sending
    console.log('✅ Email sent successfully to:', options.to);
    return true;
  } catch (error) {
    console.error('❌ Failed to send email:', error);
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