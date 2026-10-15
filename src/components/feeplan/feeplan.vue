<template>
  <div class="fee-plan-container">
    <!-- Header Section with Stats -->
    <div class="page-header">
      <div class="header-content">
        <div class="title-section">
          <div class="icon-wrapper">
            <span class="header-icon">💰</span>
          </div>
          <div>
            <h1>Fee Plan Management</h1>
            <p>Create and manage your gym membership plans</p>
          </div>
        </div>
        <div class="stats-chip">
          <span class="stats-number">{{ plans.length }}</span>
          <span class="stats-label">Active Plans</span>
        </div>
      </div>
    </div>

    <!-- Create Plan Card - Modern Form -->
    <div class="create-plan-card">
      <div class="card-header">
        <span class="card-header-icon">✨</span>
        <h2>Create New Plan</h2>
      </div>

      <form @submit.prevent="createPlan" class="modern-form">
        <div class="form-row">
          <div class="form-group">
            <label>
              <span class="label-icon">📝</span>
              Plan Name
            </label>
            <input
              v-model="title"
              type="text"
              placeholder="e.g., Premium Yearly"
              class="form-input"
              :class="{ 'error': titleError }"
            />
            <span class="error-text" v-if="titleError">Plan name is required</span>
          </div>

          <div class="form-group">
            <label>
              <span class="label-icon">💰</span>
              Price (₹)
            </label>
            <input
              v-model="price"
              type="number"
              placeholder="Enter amount"
              class="form-input"
              :class="{ 'error': priceError }"
            />
            <span class="error-text" v-if="priceError">Valid price is required</span>
          </div>
        </div>

        <div class="form-group full-width">
          <label>
            <span class="label-icon">📋</span>
            Description
          </label>
          <textarea
            v-model="description"
            placeholder="Describe what makes this plan special..."
            class="form-textarea"
            rows="3"
          ></textarea>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label>
              <span class="label-icon">⏱️</span>
              Duration Type
            </label>
            <select v-model="durationType" class="form-select">
              <option value="">Select type</option>
              <option value="days">Days</option>
              <option value="months">Months</option>
              <option value="years">Years</option>
            </select>
          </div>

          <div class="form-group">
            <label>
              <span class="label-icon">🔢</span>
              Duration
            </label>
            <input
              v-model="duration"
              type="number"
              placeholder="Enter duration"
              class="form-input"
            />
          </div>
        </div>

        <!-- Features Section with better UI -->
        <div class="form-group full-width">
          <label>
            <span class="label-icon">⭐</span>
            Features
          </label>
          <div class="feature-input-group">
            <input
              v-model="featureInput"
              type="text"
              placeholder="Add a feature (e.g., 24/7 Access)"
              class="form-input"
              @keyup.enter="addFeature"
            />
            <button type="button" class="add-feature-btn" @click="addFeature">
              + Add
            </button>
          </div>
        </div>

        <!-- Features Tags -->
        <div class="features-tags" v-if="features.length > 0">
          <span
            v-for="(item, index) in features"
            :key="index"
            class="feature-tag"
          >
            {{ item }}
            <button type="button" class="remove-tag-btn" @click="removeFeature(index)">
              ×
            </button>
          </span>
        </div>
        <div class="empty-features" v-else>
          <span class="empty-icon">🏷️</span>
          <span>No features added yet. Add features to attract members!</span>
        </div>

        <!-- Submit Button -->
        <button type="submit" class="submit-plan-btn" :disabled="loading">
          <span v-if="loading" class="loader"></span>
          <span v-else class="btn-icon">🚀</span>
          {{ loading ? "Creating Plan..." : "Create Plan" }}
        </button>
      </form>
    </div>

    <!-- Plans Grid Section -->
    <div class="plans-section">
      <div class="section-header">
        <div class="section-title">
          <span class="title-icon">🏋️</span>
          <h2>Your Membership Plans</h2>
        </div>
        <div class="section-stats">
          <span class="stat-badge">{{ plans.length }} total plans</span>
        </div>
      </div>

      <div class="plans-grid" v-if="plans.length > 0">
        <div
          v-for="plan in plans"
          :key="plan._id"
          class="plan-card"
          :class="{ 'featured': plan.isFeatured }"
        >
          <div class="plan-badge" v-if="plan.isFeatured">🔥 Popular</div>
          <div class="plan-header">
            <h3 class="plan-title">{{ plan.title }}</h3>
            <div class="plan-price">
              <span class="currency">₹</span>
              <span class="amount">{{ formatPrice(plan.price) }}</span>
              <span class="period">/{{ plan.durationType }}</span>
            </div>
            <p class="plan-description">{{ plan.description || "No description provided" }}</p>
          </div>

          <div class="plan-duration">
            <span class="duration-icon">⏱️</span>
            <span>{{ plan.duration }} {{ plan.durationType }}</span>
          </div>

          <div class="plan-features">
            <div class="features-title">
              <span>✨ What's Included</span>
            </div>
            <ul>
              <li v-for="(item, index) in plan.features" :key="index">
                <span class="check-icon">✓</span>
                {{ item }}
              </li>
              <li v-if="!plan.features || plan.features.length === 0" class="no-features">
                No features listed
              </li>
            </ul>
          </div>

          <div class="plan-actions">
            <button class="delete-plan-btn" @click="deletePlan(plan._id)">
              <span>🗑️</span>
              Delete Plan
            </button>
          </div>
        </div>
      </div>

      <div class="empty-state" v-else>
        <div class="empty-state-icon">📋</div>
        <h3>No Plans Created Yet</h3>
        <p>Create your first membership plan using the form above</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import axios from "axios";

// ================= STATES =================
const title = ref("");
const description = ref("");
const price = ref("");
const durationType = ref("");
const duration = ref("");
const featureInput = ref("");
const features = ref([]);
const plans = ref([]);
const loading = ref(false);

// Error states
const titleError = ref(false);
const priceError = ref(false);

// ================= TOKEN =================
const token = localStorage.getItem("token");

// ================= HELPER FUNCTIONS =================
const formatPrice = (price) => {
  return Number(price).toLocaleString('en-IN');
};

// ================= ADD FEATURE =================
const addFeature = () => {
  if (featureInput.value && featureInput.value.trim()) {
    features.value.push(featureInput.value.trim());
    featureInput.value = "";
  }
};

// ================= REMOVE FEATURE =================
const removeFeature = (index) => {
  features.value.splice(index, 1);
};

// ================= VALIDATION =================
const validateForm = () => {
  let isValid = true;
  
  if (!title.value.trim()) {
    titleError.value = true;
    isValid = false;
  } else {
    titleError.value = false;
  }
  
  if (!price.value || Number(price.value) <= 0) {
    priceError.value = true;
    isValid = false;
  } else {
    priceError.value = false;
  }
  
  return isValid;
};

// ================= CREATE PLAN =================
const createPlan = async () => {
  if (!validateForm()) {
    alert("Please fill all required fields correctly");
    return;
  }

  try {
    loading.value = true;

    await axios.post(
      "http://localhost:5002/api/fee-plan/create",
      {
        title: title.value.trim(),
        description: description.value.trim(),
        price: Number(price.value),
        durationType: durationType.value,
        duration: Number(duration.value),
        features: features.value,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    // Show success message
    showNotification("Plan created successfully!", "success");

    // Reset form
    title.value = "";
    description.value = "";
    price.value = "";
    durationType.value = "";
    duration.value = "";
    features.value = [];
    featureInput.value = "";

    // Refresh plans
    await getPlans();

  } catch (error) {
    const errorMsg = error.response?.data?.message || "Failed to create plan";
    showNotification(errorMsg, "error");
  } finally {
    loading.value = false;
  }
};

// ================= GET PLANS =================
const getPlans = async () => {
  try {
    const res = await axios.get(
      "http://localhost:5002/api/fee-plan/all",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    plans.value = res.data.feePlans || [];
  } catch (error) {
    console.error("Error fetching plans:", error);
    showNotification("Failed to load plans", "error");
  }
};

// ================= DELETE PLAN =================
const deletePlan = async (id) => {
  if (confirm("Are you sure you want to delete this plan? This action cannot be undone.")) {
    try {
      await axios.delete(
        `http://localhost:5002/api/fee-plan/delete/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      showNotification("Plan deleted successfully", "success");
      await getPlans();
    } catch (error) {
      console.error("Error deleting plan:", error);
      showNotification("Failed to delete plan", "error");
    }
  }
};

// ================= NOTIFICATION HELPER =================
const showNotification = (message, type) => {
  // Simple alert for now - can be replaced with toast notification
  alert(message);
};

// ================= LOAD =================
onMounted(() => {
  getPlans();
});
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background: linear-gradient(135deg, #f5f7fa 0%, #f0f2f5 100%);
}

/* Main Container */
.fee-plan-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 32px 40px;
}

/* Page Header */
.page-header {
  margin-bottom: 32px;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 20px;
}

.title-section {
  display: flex;
  align-items: center;
  gap: 16px;
}

.icon-wrapper {
  width: 56px;
  height: 56px;
  background: linear-gradient(135deg, #facc15 0%, #f59e0b 100%);
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.header-icon {
  font-size: 32px;
}

.title-section h1 {
  font-size: 28px;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 6px;
}

.title-section p {
  color: #64748b;
  font-size: 14px;
}

.stats-chip {
  background: white;
  padding: 12px 24px;
  border-radius: 40px;
  display: flex;
  align-items: center;
  gap: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.stats-number {
  font-size: 28px;
  font-weight: 800;
  color: #f59e0b;
}

.stats-label {
  font-size: 14px;
  color: #64748b;
  font-weight: 500;
}

/* Create Plan Card */
.create-plan-card {
  background: white;
  border-radius: 28px;
  padding: 32px;
  margin-bottom: 48px;
  box-shadow: 0 20px 35px -12px rgba(0, 0, 0, 0.1);
}

.card-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 28px;
  padding-bottom: 16px;
  border-bottom: 2px solid #f1f5f9;
}

.card-header-icon {
  font-size: 28px;
}

.card-header h2 {
  font-size: 22px;
  font-weight: 600;
  color: #1e293b;
}

/* Modern Form */
.modern-form {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group.full-width {
  grid-column: span 2;
}

label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  color: #334155;
  font-size: 14px;
}

.label-icon {
  font-size: 16px;
}

.form-input,
.form-select,
.form-textarea {
  padding: 12px 16px;
  border: 2px solid #e2e8f0;
  border-radius: 14px;
  font-size: 14px;
  transition: all 0.2s ease;
  font-family: inherit;
}

.form-input:focus,
.form-select:focus,
.form-textarea:focus {
  outline: none;
  border-color: #facc15;
  box-shadow: 0 0 0 3px rgba(250, 204, 21, 0.1);
}

.form-input.error,
.form-select.error {
  border-color: #ef4444;
}

.error-text {
  font-size: 12px;
  color: #ef4444;
}

/* Feature Input */
.feature-input-group {
  display: flex;
  gap: 12px;
}

.feature-input-group .form-input {
  flex: 1;
}

.add-feature-btn {
  background: linear-gradient(135deg, #facc15, #f59e0b);
  border: none;
  padding: 0 20px;
  border-radius: 14px;
  color: white;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s;
}

.add-feature-btn:hover {
  transform: scale(1.02);
}

/* Features Tags */
.features-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 8px;
}

.feature-tag {
  background: #f1f5f9;
  padding: 6px 12px 6px 16px;
  border-radius: 40px;
  font-size: 13px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: #334155;
}

.remove-tag-btn {
  background: transparent;
  border: none;
  color: #94a3b8;
  font-size: 18px;
  cursor: pointer;
  padding: 0 4px;
  border-radius: 50%;
  transition: all 0.2s;
}

.remove-tag-btn:hover {
  color: #ef4444;
  background: transparent;
  transform: scale(1.1);
}

.empty-features {
  background: #f8fafc;
  padding: 16px;
  border-radius: 14px;
  text-align: center;
  color: #94a3b8;
  font-size: 13px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.empty-icon {
  font-size: 18px;
}

/* Submit Button */
.submit-plan-btn {
  background: linear-gradient(135deg, #1e293b, #0f172a);
  color: white;
  border: none;
  padding: 14px 28px;
  border-radius: 40px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  transition: all 0.3s ease;
  margin-top: 8px;
}

.submit-plan-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.2);
}

.submit-plan-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.btn-icon {
  font-size: 18px;
}

.loader {
  width: 20px;
  height: 20px;
  border: 2px solid #fff;
  border-top-color: transparent;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Plans Section */
.plans-section {
  margin-top: 32px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 28px;
  flex-wrap: wrap;
  gap: 16px;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 12px;
}

.title-icon {
  font-size: 28px;
}

.section-title h2 {
  font-size: 24px;
  font-weight: 600;
  color: #1e293b;
}

.stat-badge {
  background: white;
  padding: 6px 16px;
  border-radius: 40px;
  font-size: 13px;
  font-weight: 500;
  color: #f59e0b;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

/* Plans Grid */
.plans-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 28px;
}

.plan-card {
  background: white;
  border-radius: 28px;
  overflow: hidden;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  position: relative;
}

.plan-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 20px 35px -12px rgba(0, 0, 0, 0.15);
}

.plan-card.featured {
  border: 2px solid #facc15;
}

.plan-badge {
  position: absolute;
  top: 16px;
  right: 16px;
  background: linear-gradient(135deg, #facc15, #f59e0b);
  padding: 4px 12px;
  border-radius: 40px;
  font-size: 11px;
  font-weight: 700;
  color: #1e293b;
}

.plan-header {
  padding: 24px 24px 16px;
  background: linear-gradient(135deg, #fafbff 0%, #ffffff 100%);
}

.plan-title {
  font-size: 22px;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 12px;
}

.plan-price {
  margin-bottom: 12px;
}

.plan-price .currency {
  font-size: 20px;
  font-weight: 600;
  color: #f59e0b;
}

.plan-price .amount {
  font-size: 36px;
  font-weight: 800;
  color: #f59e0b;
}

.plan-price .period {
  font-size: 14px;
  color: #94a3b8;
}

.plan-description {
  color: #64748b;
  font-size: 13px;
  line-height: 1.5;
}

.plan-duration {
  padding: 12px 24px;
  background: #f8fafc;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: #475569;
  border-top: 1px solid #eef2ff;
  border-bottom: 1px solid #eef2ff;
}

.duration-icon {
  font-size: 14px;
}

.plan-features {
  padding: 20px 24px;
}

.features-title {
  font-weight: 600;
  font-size: 13px;
  color: #475569;
  margin-bottom: 12px;
}

.plan-features ul {
  list-style: none;
  padding: 0;
}

.plan-features li {
  padding: 8px 0;
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 13px;
  color: #334155;
  border-bottom: 1px solid #f1f5f9;
}

.plan-features li:last-child {
  border-bottom: none;
}

.check-icon {
  color: #10b981;
  font-weight: 700;
}

.no-features {
  color: #94a3b8;
  font-style: italic;
}

.plan-actions {
  padding: 16px 24px 24px;
  border-top: 1px solid #f1f5f9;
}

.delete-plan-btn {
  width: 100%;
  background: #fee2e2;
  border: none;
  padding: 12px;
  border-radius: 40px;
  color: #dc2626;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.2s;
}

.delete-plan-btn:hover {
  background: #fecaca;
  transform: scale(0.98);
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 80px 40px;
  background: white;
  border-radius: 28px;
}

.empty-state-icon {
  font-size: 64px;
  margin-bottom: 20px;
}

.empty-state h3 {
  font-size: 20px;
  color: #1e293b;
  margin-bottom: 8px;
}

.empty-state p {
  color: #94a3b8;
}

/* Responsive Design */
@media (max-width: 768px) {
  .fee-plan-container {
    padding: 20px;
  }
  
  .form-row {
    grid-template-columns: 1fr;
    gap: 16px;
  }
  
  .form-group.full-width {
    grid-column: span 1;
  }
  
  .plans-grid {
    grid-template-columns: 1fr;
  }
  
  .title-section {
    flex-direction: column;
    text-align: center;
  }
  
  .header-content {
    flex-direction: column;
    text-align: center;
  }
  
  .card-header {
    flex-direction: column;
    text-align: center;
  }
}

@media (max-width: 480px) {
  .plan-card {
    margin: 0;
  }
  
  .plan-price .amount {
    font-size: 28px;
  }
}
</style>