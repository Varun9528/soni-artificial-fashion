// Simple component to display auth messages in both languages
const AuthMessages = () => {
  return (
    <div className="hidden">
      {/* English messages */}
      <div id="auth-messages-en">
        <span id="login-success-en">Welcome back, {name}! Your session is secured.</span>
        <span id="invalid-token-en">Session expired, please login again.</span>
      </div>
      
      {/* Hindi messages */}
      <div id="auth-messages-hi">
        <span id="login-success-hi">स्वागत है, {name}! आपका सत्र सुरक्षित है।</span>
        <span id="invalid-token-hi">सत्र समाप्त हो गया है, कृपया दोबारा लॉगिन करें।</span>
      </div>
    </div>
  );
};

export default AuthMessages;