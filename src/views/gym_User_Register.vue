<template>
  <div class="register-page">
    <div class="register-container">
      <!-- Left Side - Brand Section -->
      <div class="brand-section">
        <div class="brand-content">
          <div class="logo-wrapper">
            <div class="logo-icon">🏋️</div>
            <h1 class="brand-name">Gym<span>Flow</span></h1>
          </div>
          <div class="brand-tagline">
            <p class="tagline">Start your fitness<br>business journey</p>
            <p class="sub-tagline">Join thousands of gym owners</p>
          </div>
          <div class="brand-stats">
            <div class="stat">
              <div class="stat-number">500+</div>
              <div class="stat-label">Gyms Trust Us</div>
            </div>
            <div class="stat">
              <div class="stat-number">50k+</div>
              <div class="stat-label">Active Members</div>
            </div>
            <div class="stat">
              <div class="stat-number">24/7</div>
              <div class="stat-label">Support</div>
            </div>
          </div>
        </div>
        <div class="brand-bg-shape"></div>
        <div class="testimonial">
          <div class="quote-icon">"</div>
          <p class="quote-text">The best decision for our gym! Member management has never been easier.</p>
          <div class="quote-author">
            <div class="author-avatar">RK</div>
            <div class="author-info">
              <div class="author-name">Rahul Kapoor</div>
              <div class="author-gym">PowerFit Gym</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Side - Registration Form -->
      <div class="form-section">
        <div class="form-wrapper">
          <div class="form-header">
            <div class="welcome-badge">Get Started</div>
            <h2>Create an account</h2>
            <p>Fill in your details to get started</p>
          </div>

          <form @submit.prevent="register" class="register-form">
            <!-- Two Column Layout -->
            <div class="form-row">
              <div class="input-group">
                <label>
                  <span class="label-icon">👤</span>
                  Owner Name
                </label>
                <input
                  v-model="name"
                  type="text"
                  placeholder="Enter owner name"
                  class="form-input"
                  :class="{ 'input-error': nameError }"
                  required
                />
                <span class="error-text" v-if="nameError">Owner name is required</span>
              </div>

              <div class="input-group">
                <label>
                  <span class="label-icon">🏢</span>
                  Gym Name
                </label>
                <input
                  v-model="gymName"
                  type="text"
                  placeholder="Enter gym name"
                  class="form-input"
                  :class="{ 'input-error': gymNameError }"
                  required
                />
                <span class="error-text" v-if="gymNameError">Gym name is required</span>
              </div>
            </div>

            <div class="form-row">
              <div class="input-group">
                <label>
                  <span class="label-icon">📧</span>
                  Email Address
                </label>
                <input
                  v-model="email"
                  type="email"
                  placeholder="Enter email address"
                  class="form-input"
                  :class="{ 'input-error': emailError }"
                  required
                />
                <span class="error-text" v-if="emailError">Valid email is required</span>
              </div>

              <div class="input-group">
                <label>
                  <span class="label-icon">📱</span>
                  Mobile Number
                </label>
                <input
                  v-model="phone"
                  type="tel"
                  placeholder="Enter mobile number"
                  class="form-input"
                  :class="{ 'input-error': phoneError }"
                  required
                />
                <span class="error-text" v-if="phoneError">Valid mobile number is required</span>
              </div>
            </div>

            <div class="input-group">
              <label>
                <span class="label-icon">🔒</span>
                Password
              </label>
              <div class="password-wrapper">
                <input
                  v-model="password"
                  :type="showPassword ? 'text' : 'password'"
                  placeholder="Create a strong password"
                  class="form-input"
                  :class="{ 'input-error': passwordError }"
                  required
                />
                <button type="button" class="toggle-password" @click="showPassword = !showPassword">
                  {{ showPassword ? "🙈" : "👁️" }}
                </button>
              </div>
              <div class="password-strength" v-if="password">
                <div class="strength-bar" :class="strengthClass"></div>
                <span class="strength-text">{{ strengthText }}</span>
              </div>
              <span class="error-text" v-if="passwordError">Password must be at least 6 characters</span>
            </div>

            <div class="input-group">
              <label>
                <span class="label-icon">📍</span>
                Gym Address
              </label>
              <textarea
                v-model="address"
                placeholder="Enter complete gym address"
                class="form-textarea"
                rows="3"
                :class="{ 'input-error': addressError }"
              ></textarea>
              <span class="error-text" v-if="addressError">Address is required</span>
            </div>

            <!-- Terms Agreement -->
            <label class="terms-checkbox">
              <input type="checkbox" v-model="agreeTerms" />
              <span>
                I agree to the 
                <a href="#" @click.prevent>Terms of Service</a> 
                and 
                <a href="#" @click.prevent>Privacy Policy</a>
              </span>
            </label>

            <!-- Register Button -->
            <button type="submit" class="register-button" :disabled="loading">
              <span v-if="loading" class="spinner"></span>
              <span v-else class="btn-icon">🚀</span>
              {{ loading ? "Creating account..." : "Create Account" }}
            </button>

            <!-- Login Link -->
            <div class="form-footer">
              <p>
                Already have an account?
                <span @click="goToLogin" class="login-link">Sign in</span>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";

// ================= ROUTER =================
const router = useRouter();

// ================= STATE =================
const name = ref("");
const gymName = ref("");
const email = ref("");
const phone = ref("");
const password = ref("");
const address = ref("");
const loading = ref(false);
const showPassword = ref(false);
const agreeTerms = ref(false);

// Error states
const nameError = ref(false);
const gymNameError = ref(false);
const emailError = ref(false);
const phoneError = ref(false);
const passwordError = ref(false);
const addressError = ref(false);

// ================= PASSWORD STRENGTH =================
const strengthClass = computed(() => {
  const pwd = password.value;
  if (!pwd) return "";
  if (pwd.length < 6) return "weak";
  if (pwd.length < 10) return "medium";
  return "strong";
});

const strengthText = computed(() => {
  const pwd = password.value;
  if (!pwd) return "";
  if (pwd.length < 6) return "Weak password";
  if (pwd.length < 10) return "Medium password";
  return "Strong password";
});

// ================= VALIDATION =================
const validateForm = () => {
  let isValid = true;
  
  nameError.value = !name.value.trim();
  gymNameError.value = !gymName.value.trim();
  emailError.value = !email.value || !/^\S+@\S+\.\S+$/.test(email.value);
  phoneError.value = !phone.value || !/^\d{10}$/.test(phone.value.replace(/\D/g, ''));
  passwordError.value = !password.value || password.value.length < 6;
  addressError.value = !address.value.trim();
  
  if (nameError.value || gymNameError.value || emailError.value || phoneError.value || passwordError.value || addressError.value) {
    isValid = false;
  }
  
  if (!agreeTerms.value) {
    alert("Please agree to the Terms of Service and Privacy Policy");
    isValid = false;
  }
  
  return isValid;
};

// ================= REGISTER =================
const register = async () => {
  if (!validateForm()) {
    alert("Please fill all fields correctly");
    return;
  }

  try {
    loading.value = true;

    const res = await axios.post("http://localhost:5002/api/auth/register", {
      name: name.value.trim(),
      gymName: gymName.value.trim(),
      email: email.value,
      phone: phone.value,
      password: password.value,
      address: address.value.trim(),
    });

    // Save Token
    localStorage.setItem("token", res.data.token);

    // Save User
    localStorage.setItem("user", JSON.stringify(res.data.user));

    alert("Registration Successful! Welcome to GymFlow.");

    // Redirect to Dashboard
    router.push("/dashboard");

  } catch (error) {
    const errorMsg = error.response?.data?.message || "Registration failed. Please try again.";
    alert(errorMsg);
  } finally {
    loading.value = false;
  }
};

// ================= LOGIN PAGE =================
const goToLogin = () => {
  router.push("/");
};
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.register-page {
  min-height: 100vh;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.register-container {
  display: flex;
  max-width: 1300px;
  width: 100%;
  background: white;
  border-radius: 32px;
  overflow: hidden;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  min-height: 700px;
}

/* ================= LEFT BRAND SECTION ================= */
.brand-section {
  flex: 1.2;
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
  font-size: 32px;
  font-weight: 700;
  color: white;
  margin-bottom: 12px;
  line-height: 1.2;
}

.sub-tagline {
  font-size: 14px;
  color: #94a3b8;
}

.brand-stats {
  display: flex;
  gap: 32px;
  margin-bottom: 48px;
}

.stat {
  text-align: center;
}

.stat-number {
  font-size: 28px;
  font-weight: 800;
  color: #facc15;
}

.stat-label {
  font-size: 12px;
  color: #94a3b8;
  margin-top: 4px;
}

.testimonial {
  position: relative;
  z-index: 1;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 20px;
  padding: 20px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.quote-icon {
  font-size: 48px;
  color: #facc15;
  opacity: 0.5;
  line-height: 1;
  margin-bottom: 8px;
}

.quote-text {
  color: #cbd5e1;
  font-size: 14px;
  line-height: 1.5;
  margin-bottom: 16px;
  font-style: italic;
}

.quote-author {
  display: flex;
  align-items: center;
  gap: 12px;
}

.author-avatar {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #facc15, #f59e0b);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  color: #0f172a;
}

.author-info {
  flex: 1;
}

.author-name {
  font-size: 14px;
  font-weight: 600;
  color: white;
}

.author-gym {
  font-size: 11px;
  color: #94a3b8;
}

/* ================= RIGHT FORM SECTION ================= */
.form-section {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 48px;
  background: white;
  overflow-y: auto;
}

.form-wrapper {
  width: 100%;
  max-width: 500px;
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
.register-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
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

.form-input {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  font-size: 14px;
  transition: all 0.2s ease;
  font-family: inherit;
}

.form-input:focus {
  outline: none;
  border-color: #facc15;
  box-shadow: 0 0 0 3px rgba(250, 204, 21, 0.1);
}

.form-input.input-error {
  border-color: #ef4444;
}

.form-textarea {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  font-size: 14px;
  transition: all 0.2s ease;
  font-family: inherit;
  resize: vertical;
}

.form-textarea:focus {
  outline: none;
  border-color: #facc15;
  box-shadow: 0 0 0 3px rgba(250, 204, 21, 0.1);
}

.form-textarea.input-error {
  border-color: #ef4444;
}

.error-text {
  font-size: 11px;
  color: #ef4444;
}

/* Password Wrapper */
.password-wrapper {
  position: relative;
}

.toggle-password {
  position: absolute;
  right: 12px;
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

/* Password Strength */
.password-strength {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 6px;
}

.strength-bar {
  height: 4px;
  border-radius: 4px;
  transition: all 0.3s;
}

.strength-bar.weak {
  background: #ef4444;
  width: 40px;
}

.strength-bar.medium {
  background: #f59e0b;
  width: 70px;
}

.strength-bar.strong {
  background: #10b981;
  width: 100px;
}

.strength-text {
  font-size: 11px;
  color: #64748b;
}

/* Terms Checkbox */
.terms-checkbox {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 12px;
  color: #475569;
  cursor: pointer;
  margin: 8px 0;
}

.terms-checkbox input {
  width: 16px;
  height: 16px;
  cursor: pointer;
  accent-color: #facc15;
}

.terms-checkbox a {
  color: #f59e0b;
  text-decoration: none;
}

.terms-checkbox a:hover {
  text-decoration: underline;
}

/* Register Button */
.register-button {
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

.register-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px -5px rgba(0, 0, 0, 0.2);
}

.register-button:disabled {
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

/* Form Footer */
.form-footer {
  text-align: center;
  padding-top: 16px;
  border-top: 1px solid #e2e8f0;
  margin-top: 8px;
}

.form-footer p {
  font-size: 13px;
  color: #64748b;
}

.login-link {
  color: #f59e0b;
  font-weight: 600;
  cursor: pointer;
  margin-left: 5px;
  transition: color 0.2s;
}

.login-link:hover {
  color: #d97706;
  text-decoration: underline;
}

/* Responsive Design */
@media (max-width: 1024px) {
  .brand-stats {
    gap: 20px;
  }
  
  .stat-number {
    font-size: 22px;
  }
}

@media (max-width: 968px) {
  .register-container {
    flex-direction: column;
    max-width: 600px;
  }
  
  .brand-section {
    padding: 32px;
  }
  
  .tagline {
    font-size: 24px;
  }
  
  .brand-stats {
    margin-bottom: 24px;
  }
  
  .testimonial {
    display: none;
  }
  
  .form-section {
    padding: 32px;
  }
}

@media (max-width: 640px) {
  .form-row {
    grid-template-columns: 1fr;
    gap: 16px;
  }
  
  .register-page {
    padding: 16px;
  }
  
  .form-header h2 {
    font-size: 24px;
  }
  
  .brand-stats {
    justify-content: center;
  }
}
</style>