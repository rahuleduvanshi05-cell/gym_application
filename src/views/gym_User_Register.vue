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

            <label class="terms-checkbox">
              <input type="checkbox" v-model="agreeTerms" />
              <span>
                I agree to the
                <a href="#" @click.prevent>Terms of Service</a>
                and
                <a href="#" @click.prevent>Privacy Policy</a>
              </span>
            </label>

            <button type="submit" class="register-button" :disabled="loading">
              <span v-if="loading" class="spinner"></span>
              <span v-else class="btn-icon">🚀</span>
              {{ loading ? "Creating account..." : "Create Account" }}
            </button>

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
  phoneError.value = !phone.value || !/^\d{10}$/.test(phone.value.replace(/\D/g, ""));
  passwordError.value = !password.value || password.value.length < 6;
  addressError.value = !address.value.trim();

  if (
    nameError.value ||
    gymNameError.value ||
    emailError.value ||
    phoneError.value ||
    passwordError.value ||
    addressError.value
  ) {
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

    localStorage.setItem("token", res.data.token);
    localStorage.setItem("user", JSON.stringify(res.data.user));

    alert("Registration Successful! Welcome to GymFlow.");
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

<style scoped>
/* ================= COLOR TOKENS =================
   Navy   #0B1F3A  – trust, structure (brand panel, headings)
   Orange #F97316  – energy, the single action color (CTA, focus, accents)
   Teal   #14B8A6  – strength / success (strong password)
   Mist   #F1F5F9  – calm page background
   Slate  #475569  – body text
================================================= */
.register-page {
  --navy-900: #071428;
  --navy-800: #0b1f3a;
  --navy-700: #14305a;
  --orange-500: #f97316;
  --orange-400: #fb923c;
  --orange-100: #ffedd5;
  --orange-700: #c2410c;
  --teal-500: #14b8a6;
  --mist: #f1f5f9;
  --line: #dbe3ee;
  --text-strong: #0b1f3a;
  --text-body: #475569;
  --text-muted: #64748b;
  --danger: #dc2626;
  --warning: #f59e0b;

  min-height: 100vh;
  font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  background:
    radial-gradient(circle at 12% 18%, rgba(249, 115, 22, 0.1), transparent 40%),
    radial-gradient(circle at 88% 82%, rgba(20, 184, 166, 0.1), transparent 40%),
    var(--mist);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.register-page *,
.register-page *::before,
.register-page *::after {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.register-container {
  display: flex;
  max-width: 1300px;
  width: 100%;
  background: #ffffff;
  border-radius: 28px;
  overflow: hidden;
  box-shadow: 0 30px 60px -20px rgba(11, 31, 58, 0.35);
  min-height: 700px;
}

/* ================= LEFT BRAND SECTION ================= */
.brand-section {
  flex: 1.2;
  background: linear-gradient(160deg, var(--navy-800) 0%, var(--navy-900) 100%);
  padding: 48px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  position: relative;
  overflow: hidden;
}

.brand-bg-shape {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(circle at 85% 12%, rgba(249, 115, 22, 0.22), transparent 45%),
    radial-gradient(circle at 10% 95%, rgba(20, 184, 166, 0.18), transparent 45%);
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
  font-size: 40px;
  width: 64px;
  height: 64px;
  display: grid;
  place-items: center;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.14);
  border-radius: 18px;
}

.brand-name {
  font-size: 32px;
  font-weight: 800;
  letter-spacing: -0.02em;
  color: #ffffff;
}

.brand-name span {
  color: var(--orange-500);
}

.brand-tagline {
  margin-bottom: 48px;
}

.tagline {
  font-size: 36px;
  font-weight: 800;
  letter-spacing: -0.02em;
  color: #ffffff;
  margin-bottom: 12px;
  line-height: 1.15;
}

.sub-tagline {
  font-size: 15px;
  color: #a9b8cf;
}

.brand-stats {
  display: flex;
  gap: 32px;
  margin-bottom: 48px;
}

.stat {
  text-align: left;
  padding-left: 14px;
  border-left: 3px solid var(--orange-500);
}

.stat-number {
  font-size: 28px;
  font-weight: 800;
  color: #ffffff;
}

.stat-label {
  font-size: 12px;
  color: #a9b8cf;
  margin-top: 4px;
}

.testimonial {
  position: relative;
  z-index: 1;
  background: rgba(255, 255, 255, 0.06);
  border-radius: 20px;
  padding: 22px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.12);
}

.quote-icon {
  font-size: 48px;
  color: var(--orange-400);
  opacity: 0.8;
  line-height: 1;
  margin-bottom: 8px;
}

.quote-text {
  color: #dbe4f2;
  font-size: 14px;
  line-height: 1.6;
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
  background: var(--orange-500);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  color: var(--navy-900);
}

.author-info {
  flex: 1;
}

.author-name {
  font-size: 14px;
  font-weight: 600;
  color: #ffffff;
}

.author-gym {
  font-size: 12px;
  color: #a9b8cf;
}

/* ================= RIGHT FORM SECTION ================= */
.form-section {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 48px;
  background: #ffffff;
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
  background: var(--orange-100);
  padding: 6px 16px;
  border-radius: 40px;
  font-size: 12px;
  font-weight: 700;
  color: var(--orange-700);
  margin-bottom: 20px;
}

.form-header h2 {
  font-size: 28px;
  font-weight: 800;
  letter-spacing: -0.02em;
  color: var(--text-strong);
  margin-bottom: 8px;
}

.form-header p {
  color: var(--text-muted);
  font-size: 14px;
}

/* ================= FORM ================= */
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
  color: var(--text-strong);
}

.label-icon {
  font-size: 14px;
}

.form-input,
.form-textarea {
  width: 100%;
  padding: 12px 16px;
  background: #f8fafc;
  color: var(--text-strong);
  border: 1.5px solid var(--line);
  border-radius: 12px;
  font-size: 14px;
  font-family: inherit;
  transition: border-color 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
}

.form-textarea {
  resize: vertical;
}

.form-input::placeholder,
.form-textarea::placeholder {
  color: #94a3b8;
}

.form-input:hover,
.form-textarea:hover {
  border-color: #b9c6d8;
}

.form-input:focus,
.form-textarea:focus {
  outline: none;
  background: #ffffff;
  border-color: var(--orange-500);
  box-shadow: 0 0 0 4px rgba(249, 115, 22, 0.16);
}

.form-input.input-error,
.form-textarea.input-error {
  border-color: var(--danger);
  background: #fef2f2;
}

.form-input.input-error:focus,
.form-textarea.input-error:focus {
  box-shadow: 0 0 0 4px rgba(220, 38, 38, 0.15);
}

.error-text {
  font-size: 12px;
  color: var(--danger);
}

/* ================= PASSWORD ================= */
.password-wrapper {
  position: relative;
}

.password-wrapper .form-input {
  padding-right: 48px;
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
  line-height: 1;
  padding: 4px;
  border-radius: 8px;
  color: var(--text-muted);
}

.toggle-password:hover {
  background: #e2e8f0;
}

.toggle-password:focus-visible {
  outline: 2px solid var(--orange-500);
  outline-offset: 2px;
}

.password-strength {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 6px;
}

.strength-bar {
  height: 5px;
  border-radius: 5px;
  transition: width 0.3s ease, background 0.3s ease;
}

.strength-bar.weak {
  background: var(--danger);
  width: 40px;
}

.strength-bar.medium {
  background: var(--warning);
  width: 70px;
}

.strength-bar.strong {
  background: var(--teal-500);
  width: 100px;
}

.strength-text {
  font-size: 12px;
  color: var(--text-muted);
}

/* ================= TERMS ================= */
.terms-checkbox {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 13px;
  color: var(--text-body);
  cursor: pointer;
  margin: 4px 0;
}

.terms-checkbox input {
  width: 17px;
  height: 17px;
  cursor: pointer;
  accent-color: var(--orange-500);
}

.terms-checkbox a {
  color: var(--orange-700);
  font-weight: 600;
  text-decoration: none;
}

.terms-checkbox a:hover {
  text-decoration: underline;
}

/* ================= BUTTON ================= */
.register-button {
  background: var(--orange-500);
  color: var(--navy-900);
  border: none;
  padding: 14px 24px;
  border-radius: 14px;
  font-size: 15px;
  font-weight: 700;
  font-family: inherit;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  transition: background 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease;
  box-shadow: 0 8px 18px -8px rgba(249, 115, 22, 0.7);
  margin-top: 4px;
}

.register-button:hover:not(:disabled) {
  background: var(--orange-400);
  transform: translateY(-1px);
  box-shadow: 0 12px 22px -8px rgba(249, 115, 22, 0.75);
}

.register-button:active:not(:disabled) {
  transform: translateY(0);
}

.register-button:focus-visible {
  outline: 3px solid var(--navy-800);
  outline-offset: 3px;
}

.register-button:disabled {
  opacity: 0.65;
  cursor: not-allowed;
  box-shadow: none;
}

.btn-icon {
  font-size: 16px;
}

.spinner {
  width: 18px;
  height: 18px;
  border: 2px solid var(--navy-900);
  border-top-color: transparent;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* ================= FOOTER ================= */
.form-footer {
  text-align: center;
  padding-top: 16px;
  border-top: 1px solid var(--line);
  margin-top: 4px;
}

.form-footer p {
  font-size: 13px;
  color: var(--text-muted);
}

.login-link {
  color: var(--orange-700);
  font-weight: 700;
  cursor: pointer;
  margin-left: 5px;
  transition: color 0.2s;
}

.login-link:hover {
  color: var(--navy-800);
  text-decoration: underline;
}

/* ================= RESPONSIVE ================= */
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

  .logo-wrapper,
  .brand-tagline {
    margin-bottom: 28px;
  }

  .tagline {
    font-size: 26px;
  }

  .brand-stats {
    margin-bottom: 0;
  }

  .testimonial {
    display: none;
  }

  .form-section {
    padding: 32px;
  }
}

@media (max-width: 640px) {
  .register-page {
    padding: 12px;
  }

  .register-container {
    border-radius: 22px;
  }

  .form-row {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .form-section {
    padding: 24px 20px;
  }

  .form-header h2 {
    font-size: 24px;
  }

  .brand-stats {
    justify-content: space-between;
    gap: 12px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .register-page *,
  .register-page *::before,
  .register-page *::after {
    transition: none !important;
    animation-duration: 0.01ms !important;
  }
}
</style>