export const passwordResetTemplate = {
  en: {
    subject: 'Reset Your Soni Fashion Account Password',
    body: `
      <h2>Dear {{customerName}},</h2>
      
      <p>We received a request to reset your password for your Soni Fashion account.</p>
      
      <p>If you made this request, please click the button below to set a new password:</p>
      
      <p style="text-align: center; margin: 30px 0;">
        <a href="{{resetLink}}" 
           style="background-color: #d97706; color: white; padding: 12px 24px; 
                  text-decoration: none; border-radius: 6px; font-weight: bold;">
          Reset Password
        </a>
      </p>
      
      <p>If you didn't request this, you can safely ignore this email. Your password will not be changed.</p>
      
      <p>This link will expire in 1 hour for security reasons.</p>
      
      <p>Best regards,<br>
      The Soni Fashion Team</p>
    `
  },
  hi: {
    subject: 'अपना सोनी फैशन खाता पासवर्ड रीसेट करें',
    body: `
      <h2>प्रिय {{customerName}},</h2>
      
      <p>हमें आपके सोनी फैशन खाते के पासवर्ड को रीसेट करने का अनुरोध प्राप्त हुआ है।</p>
      
      <p>यदि आपने यह अनुरोध किया है, तो कृपया नया पासवर्ड सेट करने के लिए नीचे दिए गए बटन पर क्लिक करें:</p>
      
      <p style="text-align: center; margin: 30px 0;">
        <a href="{{resetLink}}" 
           style="background-color: #d97706; color: white; padding: 12px 24px; 
                  text-decoration: none; border-radius: 6px; font-weight: bold;">
          पासवर्ड रीसेट करें
        </a>
      </p>
      
      <p>यदि आपने यह अनुरोध नहीं किया है, तो आप इस ईमेल को सुरक्षित रूप से अनदेखा कर सकते हैं। आपका पासवर्ड नहीं बदला जाएगा।</p>
      
      <p>सुरक्षा कारणों से यह लिंक 1 घंटे में समाप्त हो जाएगा।</p>
      
      <p>सादर,<br>
      सोनी फैशन टीम</p>
    `
  }
};