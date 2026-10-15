<!-- Login Page - Modern Premium UI -->
<template>
  <div class="auth-page login-page">
    <div class="auth-container">
      <!-- Left Side - Brand Section -->
      <div class="brand-section">
        <div class="brand-content">
          <div class="logo-wrapper">
            <div class="logo-icon">🏋️</div>
            <h1 class="brand-name">Gym<span>Flow</span></h1>
          </div>
          <div class="brand-tagline">
            <p class="tagline">Manage your fitness empire</p>
            <p class="sub-tagline">Smart analytics • Member management • Automated billing</p>
          </div>
          <div class="brand-features">
            <div class="feature-item">
              <span class="feature-check">✓</span>
              <span>Real-time dashboard</span>
            </div>
            <div class="feature-item">
              <span class="feature-check">✓</span>
              <span>Member tracking</span>
            </div>
            <div class="feature-item">
              <span class="feature-check">✓</span>
              <span>Revenue analytics</span>
            </div>
          </div>
        </div>
        <div class="brand-bg-shape"></div>
      </div>

      <!-- Right Side - Login Form -->
      <div class="form-section">
        <div class="form-wrapper">
          <div class="form-header">
            <div class="welcome-badge">Welcome Back</div>
            <h2>Login to your account</h2>
            <p>Access your gym management dashboard</p>
          </div>

          <form @submit.prevent="login" class="auth-form">
            <!-- Email Field -->
            <div class="input-group">
              <label>
                <span class="label-icon">📧</span>
                Email Address
              </label>
              <input
                v-model="email"
                type="email"
                placeholder="Enter your email"
                class="auth-input"
                :class="{ 'input-error': emailError }"
                required
              />
              <span class="input-focus-border"></span>
            </div>

            <!-- Password Field -->
            <div class="input-group">
              <label>
                <span class="label-icon">🔒</span>
                Password
              </label>
              <div class="password-wrapper">
                <input
                  v-model="password"
                  :type="showPassword ? 'text' : 'password'"
                  placeholder="Enter your password"
                  class="auth-input"
                  :class="{ 'input-error': passwordError }"
                  required
                />
                <button type="button" class="toggle-password" @click="showPassword = !showPassword">
                  {{ showPassword ? "🙈" : "👁️" }}
                </button>
              </div>
            </div>

            <!-- Forgot Password -->
            <div class="form-options">
              <label class="checkbox-label">
                <input type="checkbox" v-model="rememberMe" />
                <span>Remember me</span>
              </label>
              <a href="#" class="forgot-link" @click.prevent="forgotPassword">Forgot password?</a>
            </div>

            <!-- Login Button -->
            <button type="submit" class="auth-button" :disabled="loading">
              <span v-if="loading" class="spinner"></span>
              <span v-else class="btn-icon">🔓</span>
              {{ loading ? "Logging in..." : "Login" }}
            </button>

            <!-- Register Link -->
            <div class="auth-footer">
              <p>
                Don't have an account?
                <span @click="goToRegister" class="auth-link">Create account</span>
              </p>
            </div>
          </form>

          <!-- Demo Credentials Hint -->
          <div class="demo-hint" v-if="showDemoHint">
            <div class="demo-icon">💡</div>
            <div class="demo-text">
              <strong>Demo Credentials</strong>
              <span>admin@gymflow.com / password123</span>
            </div>
            <button class="demo-close" @click="showDemoHint = false">×</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";

const router = useRouter();

// ================= STATE =================
const email = ref("");
const password = ref("");
const loading = ref(false);
const showPassword = ref(false);
const rememberMe = ref(false);
const showDemoHint = ref(true);
const emailError = ref(false);
const passwordError = ref(false);

// ================= LOGIN =================
const login = async () => {
  // Basic validation
  emailError.value = !email.value;
  passwordError.value = !password.value;
  
  if (!email.value || !password.value) {
    alert("Please fill in all fields");
    return;
  }

  try {
    loading.value = true;

    const res = await axios.post("http://localhost:5002/api/auth/login", {
      email: email.value,
      password: password.value,
    });

    // Save Token
    localStorage.setItem("token", res.data.token);
    
    // Save User
    localStorage.setItem("user", JSON.stringify(res.data.user));
    
    // Save remember me preference
    if (rememberMe.value) {
      localStorage.setItem("rememberedEmail", email.value);
    } else {
      localStorage.removeItem("rememberedEmail");
    }

    // Show success notification
    showNotification("Login Successful!", "success");
    
    router.push("/dashboard");

  } catch (error) {
    const errorMsg = error.response?.data?.message || "Login failed. Please try again.";
    showNotification(errorMsg, "error");
  } finally {
    loading.value = false;
  }
};

// ================= REGISTER PAGE =================
const goToRegister = () => {
  router.push("/register");
};

// ================= FORGOT PASSWORD =================
const forgotPassword = () => {
  alert("Password reset link will be sent to your email");
};

// ================= NOTIFICATION =================
const showNotification = (message, type) => {
  alert(message); // Can be replaced with a toast notification
};

// ================= LOAD REMEMBERED EMAIL =================
const loadRememberedEmail = () => {
  const remembered = localStorage.getItem("rememberedEmail");
  if (remembered) {
    email.value = remembered;
    rememberMe.value = true;
  }
};

// Load on mount
loadRememberedEmail();
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.auth-page {
  min-height: 100vh;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.auth-container {
  display: flex;
  max-width: 1200px;
  width: 100%;
  background: white;
  border-radius: 32px;
  overflow: hidden;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  min-height: 600px;
}

/* ================= LEFT BRAND SECTION ================= */
.brand-section {
  flex: 1;
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
  padding: 48px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  position: relative;
  overflow: hidden;
}

.brand-bg-shape {
  position: absolute;
  top: -50%;
  right: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(250, 204, 21, 0.08) 0%, transparent 70%);
  pointer-events: none;
}

.brand-content {
  position: relative;
  z-index: 1;
}

.logo-wrapper {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 48px;
}

.logo-icon {
  font-size: 48px;
  filter: drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1));
}

.brand-name {
  font-size: 32px;
  font-weight: 800;
  background: linear-gradient(135deg, #facc15, #f59e0b);
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
}

.brand-name span {
  background: none;
  color: #facc15;
}

.brand-tagline {
  margin-bottom: 48px;
}

.tagline {
  font-size: 28px;
  font-weight: 700;
  color: white;
  margin-bottom: 12px;
  line-height: 1.2;
}

.sub-tagline {
  font-size: 14px;
  color: #94a3b8;
}

.brand-features {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 12px;
  color: #cbd5e1;
  font-size: 14px;
}

.feature-check {
  width: 24px;
  height: 24px;
  background: rgba(250, 204, 21, 0.2);
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #facc15;
  font-weight: bold;
}

/* ================= RIGHT FORM SECTION ================= */
.form-section {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 48px;
  background: white;
}

.form-wrapper {
  width: 100%;
  max-width: 400px;
}

.form-header {
  text-align: center;
  margin-bottom: 32px;
}

.welcome-badge {
  display: inline-block;
  background: linear-gradient(135deg, #fef3c7, #fde68a);
  padding: 6px 16px;
  border-radius: 40px;
  font-size: 12px;
  font-weight: 600;
  color: #b45309;
  margin-bottom: 20px;
}

.form-header h2 {
  font-size: 28px;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 8px;
}

.form-header p {
  color: #64748b;
  font-size: 14px;
}

/* Form Styles */
.auth-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
  position: relative;
}

.input-group label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  font-weight: 600;
  color: #334155;
}

.label-icon {
  font-size: 14px;
}

.auth-input {
  width: 100%;
  padding: 14px 16px;
  border: 2px solid #e2e8f0;
  border-radius: 14px;
  font-size: 14px;
  transition: all 0.2s ease;
  font-family: inherit;
}

.auth-input:focus {
  outline: none;
  border-color: #facc15;
  box-shadow: 0 0 0 3px rgba(250, 204, 21, 0.1);
}

.auth-input.input-error {
  border-color: #ef4444;
}

.input-focus-border {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 0;
  height: 2px;
  transition: width 0.3s ease;
}

.password-wrapper {
  position: relative;
}

.toggle-password {
  position: absolute;
  right: 14px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  font-size: 18px;
  padding: 0;
  width: auto;
  color: #94a3b8;
}

.toggle-password:hover {
  background: none;
  transform: translateY(-50%) scale(1.1);
}

/* Form Options */
.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 13px;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  color: #475569;
}

.checkbox-label input {
  width: 16px;
  height: 16px;
  cursor: pointer;
  accent-color: #facc15;
}

.forgot-link {
  color: #f59e0b;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s;
}

.forgot-link:hover {
  color: #d97706;
}

/* Auth Button */
.auth-button {
  background: linear-gradient(135deg, #0f172a, #1e293b);
  color: white;
  border: none;
  padding: 14px 24px;
  border-radius: 40px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  transition: all 0.3s ease;
  margin-top: 8px;
}

.auth-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px -5px rgba(0, 0, 0, 0.2);
}

.auth-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.btn-icon {
  font-size: 16px;
}

.spinner {
  width: 18px;
  height: 18px;
  border: 2px solid white;
  border-top-color: transparent;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Auth Footer */
.auth-footer {
  text-align: center;
  padding-top: 16px;
  border-top: 1px solid #e2e8f0;
  margin-top: 8px;
}

.auth-footer p {
  font-size: 13px;
  color: #64748b;
}

.auth-link {
  color: #f59e0b;
  font-weight: 600;
  cursor: pointer;
  margin-left: 5px;
  transition: color 0.2s;
}

.auth-link:hover {
  color: #d97706;
  text-decoration: underline;
}

/* Demo Hint */
.demo-hint {
  margin-top: 24px;
  background: #fefce8;
  border: 1px solid #fde68a;
  border-radius: 16px;
  padding: 12px 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  position: relative;
}

.demo-icon {
  font-size: 20px;
}

.demo-text {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.demo-text strong {
  font-size: 12px;
  color: #b45309;
}

.demo-text span {
  font-size: 11px;
  color: #92400e;
  font-family: monospace;
}

.demo-close {
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  color: #b45309;
  width: auto;
  padding: 0;
}

.demo-close:hover {
  background: none;
  transform: scale(1.1);
}

/* Responsive Design */
@media (max-width: 968px) {
  .auth-container {
    flex-direction: column;
    max-width: 500px;
  }
  
  .brand-section {
    padding: 32px;
  }
  
  .tagline {
    font-size: 22px;
  }
  
  .form-section {
    padding: 32px;
  }
}

@media (max-width: 480px) {
  .auth-page {
    padding: 16px;
  }
  
  .form-wrapper {
    max-width: 100%;
  }
  
  .form-header h2 {
    font-size: 24px;
  }
  
  .brand-features {
    display: none;
  }
  
  .brand-tagline {
    margin-bottom: 0;
  }
}
</style>