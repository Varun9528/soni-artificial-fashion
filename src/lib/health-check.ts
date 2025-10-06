// Database Connection Status Check
export async function checkDatabaseStatus() {
  try {
    const response = await fetch('/api/health/database');
    const data = await response.json();
    return data;
  } catch (error) {
    return {
      status: 'error',
      connected: false,
      message: 'Database connection failed',
      fallback: 'Using mock data'
    };
  }
}

// Admin Panel Status Check
export async function checkAdminStatus() {
  try {
    const response = await fetch('/api/health/admin');
    const data = await response.json();
    return data;
  } catch (error) {
    return {
      status: 'error',
      authenticated: false,
      message: 'Admin access check failed'
    };
  }
}