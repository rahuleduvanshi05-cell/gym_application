<template>
  <div class="dashboard">
    <!-- Sidebar -->
    <aside class="sidebar">
      <div class="logo-area">
        <div class="logo-icon">🏋️</div>
        <h2>Gym<span>Flow</span></h2>
      </div>

      <ul class="nav-menu">
        <li :class="{ active: currentRoute === 'dashboard' }" @click="goToDashboard">
          <span class="nav-icon">📊</span>
          <span>Dashboard</span>
        </li>
        <li :class="{ active: currentRoute === 'membership' }" @click="goToMembership">
          <span class="nav-icon">👥</span>
          <span>Membership</span>
        </li>
        <li :class="{ active: currentRoute === 'feePlan' }" @click="goToFeePlan">
          <span class="nav-icon">💰</span>
          <span>Fee Plan</span>
        </li>
        <li class="logout-item" @click="logout">
          <span class="nav-icon">🚪</span>
          <span>Logout</span>
        </li>
      </ul>

      <div class="sidebar-footer">
        <div class="gym-version">v2.0 • Pro</div>
      </div>
    </aside>

    <!-- Main Content -->
    <main class="main">
      <!-- Topbar -->
      <div class="topbar">
        <div class="welcome-section">
          <div class="greeting-badge">
            <span class="wave">👋</span>
            <h1>Welcome back, <span class="user-name">{{ user.name }}</span></h1>
          </div>
          <div class="gym-info-card">
            <span class="gym-icon">🏢</span>
            <p>{{ user.gymName }}</p>
          </div>
        </div>
        <div class="topbar-actions">
          <div class="date-chip">
            <span class="date-icon">📅</span>
            <span>{{ currentDate }}</span>
          </div>
          <div class="notification-icon">
            <span>🔔</span>
            <span class="notification-badge">3</span>
          </div>
        </div>
      </div>

      <!-- Stats Cards -->
      <div class="stats-grid">
        <div class="stat-card" style="--card-accent: #3b82f6">
          <div class="stat-header">
            <span class="stat-icon">🧑‍🤝‍🧑</span>
            <span class="stat-label">Total Members</span>
          </div>
          <div class="stat-value">{{ totalMembers.toLocaleString() }}</div>
          <div class="stat-trend positive">
            <span>▲</span> +12 this month
          </div>
        </div>

        <div class="stat-card" style="--card-accent: #10b981">
          <div class="stat-header">
            <span class="stat-icon">📈</span>
            <span class="stat-label">Monthly Revenue</span>
          </div>
          <div class="stat-value">₹ {{ monthlyRevenue.toLocaleString('en-IN') }}</div>
          <div class="stat-trend positive">
            <span>▲</span> +8% vs last month
          </div>
        </div>

        <div class="stat-card" style="--card-accent: #f59e0b">
          <div class="stat-header">
            <span class="stat-icon">⚡</span>
            <span class="stat-label">Active Plans</span>
          </div>
          <div class="stat-value">{{ activePlans }}</div>
          <div class="stat-trend neutral">
            <span>●</span> including 2 premium
          </div>
        </div>
      </div>

      <!-- Recent Members Section -->
      <div class="recent-section">
        <div class="section-header">
          <div class="section-title">
            <span class="title-icon">🕒</span>
            <h2>Recent Members</h2>
          </div>
          <button class="view-all-btn" @click="goToMembership">
            View All
            <span>→</span>
          </button>
        </div>

        <div class="table-wrapper">
          <table class="members-table">
            <thead>
              <tr>
                <th>Member Name</th>
                <th>Membership Plan</th>
                <th>Join Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="member in recentMembers" :key="member.id">
                <td class="member-cell">
                  <div class="member-avatar" :style="{ background: getAvatarColor(member.name) }">
                    {{ member.name.charAt(0) }}
                  </div>
                  <div class="member-info">
                    <div class="member-name">{{ member.name }}</div>
                    <div class="member-email">{{ member.email }}</div>
                  </div>
                </td>
                <td>
                  <span class="plan-badge" :class="getPlanClass(member.plan)">
                    {{ member.plan }}
                  </span>
                </td>
                <td>{{ member.joinDate }}</td>
                <td>
                  <span class="status-badge" :class="member.status === 'Active' ? 'status-active' : 'status-inactive'">
                    {{ member.status }}
                  </span>
                </td>
                <td>
                  <button class="action-btn" @click="viewMember(member.id)" title="View Details">
                    👁️
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Quick Stats Footer -->
        <div class="table-footer">
          <div class="members-summary">
            <span class="dot"></span>
            {{ recentMembers.filter(m => m.status === 'Active').length }} active members
          </div>
          <div class="renewal-alert" v-if="pendingRenewals.length > 0">
            ⚠️ {{ pendingRenewals.length }} members need renewal this week
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { reactive, ref, computed, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";

// Router
const router = useRouter();
const route = useRoute();

// Current route name for active menu
const currentRoute = ref("dashboard");

// User data from localStorage
const user = reactive(
  JSON.parse(localStorage.getItem("user") || '{"name":"Coach","gymName":"IronForge Fitness"}')
);

// Stats Data
const totalMembers = ref(284);
const monthlyRevenue = ref(68500);
const activePlans = ref(6);

// Current Date
const currentDate = ref("");

// Recent Members Data
const recentMembers = ref([
  {
    id: 1,
    name: "Rahul Sharma",
    email: "rahul.sharma@example.com",
    plan: "Yearly Pro",
    joinDate: "2024-02-15",
    status: "Active"
  },
  {
    id: 2,
    name: "Aman Verma",
    email: "aman.verma@example.com",
    plan: "Monthly Plus",
    joinDate: "2024-03-01",
    status: "Active"
  },
  {
    id: 3,
    name: "Priya Kapoor",
    email: "priya.kapoor@example.com",
    plan: "Quarterly",
    joinDate: "2024-01-20",
    status: "Active"
  },
  {
    id: 4,
    name: "Vikram Singh",
    email: "vikram.singh@example.com",
    plan: "Monthly Basic",
    joinDate: "2023-12-10",
    status: "Inactive"
  },
  {
    id: 5,
    name: "Neha Gupta",
    email: "neha.gupta@example.com",
    plan: "Yearly",
    joinDate: "2024-02-28",
    status: "Active"
  },
  {
    id: 6,
    name: "Rohit Mehta",
    email: "rohit.mehta@example.com",
    plan: "Monthly Plus",
    joinDate: "2024-03-10",
    status: "Active"
  }
]);

// Pending renewals (members who joined ~1 year ago or need renewal)
const pendingRenewals = computed(() => {
  const today = new Date();
  return recentMembers.value.filter(member => {
    const joinDate = new Date(member.joinDate);
    const diffDays = (today - joinDate) / (1000 * 60 * 60 * 24);
    return member.status === "Active" && diffDays > 330 && diffDays < 365;
  });
});

// Helper functions
const getAvatarColor = (name) => {
  const colors = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899"];
  const index = name.length % colors.length;
  return colors[index];
};

const getPlanClass = (plan) => {
  if (plan.includes("Yearly")) return "plan-yearly";
  if (plan.includes("Monthly")) return "plan-monthly";
  return "plan-quarterly";
};

const setCurrentDate = () => {
  const now = new Date();
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  currentDate.value = now.toLocaleDateString('en-IN', options);
};

// Navigation Functions
const goToDashboard = () => {
  currentRoute.value = "dashboard";
  router.push("/dashboard");
};

const goToMembership = () => {
  currentRoute.value = "membership";
  router.push("/membership");
};

const goToFeePlan = () => {
  currentRoute.value = "feePlan";
  router.push("/fee_plan");
};

const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  router.push("/");
};

const viewMember = (id) => {
  console.log("View member details:", id);
  // Implement member detail view
};

// Lifecycle
onMounted(() => {
  setCurrentDate();
  // Update active menu based on current route
  if (route.path.includes("membership")) currentRoute.value = "membership";
  else if (route.path.includes("fee_plan")) currentRoute.value = "feePlan";
  else currentRoute.value = "dashboard";
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
  background: #f1f5f9;
  color: #0f172a;
}

/* Dashboard Layout */
.dashboard {
  display: flex;
  min-height: 100vh;
}

/* ========= SIDEBAR ========= */
.sidebar {
  width: 280px;
  background: linear-gradient(180deg, #0f172a 0%, #1e293b 100%);
  backdrop-filter: blur(10px);
  padding: 28px 20px;
  display: flex;
  flex-direction: column;
  position: sticky;
  top: 0;
  height: 100vh;
  transition: all 0.3s ease;
  box-shadow: 4px 0 20px rgba(0, 0, 0, 0.08);
}

.logo-area {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 48px;
  padding-left: 12px;
}

.logo-icon {
  font-size: 32px;
  filter: drop-shadow(0 2px 4px rgba(0,0,0,0.2));
}

.logo-area h2 {
  font-size: 1.8rem;
  font-weight: 700;
  background: linear-gradient(135deg, #facc15, #ffb347);
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
}

.logo-area h2 span {
  background: none;
  color: #facc15;
  -webkit-background-clip: unset;
}

.nav-menu {
  list-style: none;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.nav-menu li {
  padding: 12px 16px;
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.25s ease;
  display: flex;
  align-items: center;
  gap: 14px;
  font-weight: 500;
  color: #cbd5e1;
  font-size: 0.95rem;
}

.nav-icon {
  font-size: 1.2rem;
  width: 28px;
}

.nav-menu li:hover {
  background: rgba(250, 204, 21, 0.1);
  color: #facc15;
  transform: translateX(4px);
}

.nav-menu li.active {
  background: linear-gradient(135deg, rgba(250, 204, 21, 0.15), rgba(250, 204, 21, 0.05));
  color: #facc15;
  border-left: 3px solid #facc15;
}

.logout-item {
  margin-top: auto;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  margin-top: 20px;
  padding-top: 20px;
}

.sidebar-footer {
  margin-top: 20px;
  text-align: center;
  font-size: 0.7rem;
  color: #64748b;
}

/* ========= MAIN CONTENT ========= */
.main {
  flex: 1;
  padding: 28px 36px;
  overflow-y: auto;
  background: #f8fafc;
}

/* Topbar */
.topbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
  flex-wrap: wrap;
  gap: 20px;
  background: white;
  padding: 20px 28px;
  border-radius: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  border: 1px solid #eef2ff;
}

.welcome-section {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.greeting-badge {
  display: flex;
  align-items: center;
  gap: 10px;
}

.wave {
  font-size: 28px;
}

.greeting-badge h1 {
  font-size: 1.6rem;
  font-weight: 600;
  color: #1e293b;
}

.user-name {
  background: linear-gradient(135deg, #facc15, #f59e0b);
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
}

.gym-info-card {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: #f1f5f9;
  padding: 6px 16px;
  border-radius: 40px;
  width: fit-content;
}

.gym-icon {
  font-size: 16px;
}

.gym-info-card p {
  font-size: 0.85rem;
  font-weight: 500;
  color: #475569;
}

.topbar-actions {
  display: flex;
  align-items: center;
  gap: 16px;
}

.date-chip {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #f1f5f9;
  padding: 8px 16px;
  border-radius: 40px;
  font-size: 0.85rem;
  font-weight: 500;
  color: #334155;
}

.notification-icon {
  position: relative;
  cursor: pointer;
  font-size: 22px;
  padding: 6px;
  border-radius: 50%;
  background: #f1f5f9;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.notification-icon:hover {
  background: #e2e8f0;
}

.notification-badge {
  position: absolute;
  top: -4px;
  right: -4px;
  background: #ef4444;
  color: white;
  font-size: 10px;
  font-weight: bold;
  padding: 2px 6px;
  border-radius: 20px;
  min-width: 18px;
  text-align: center;
}

/* Stats Grid */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;
  margin-bottom: 40px;
}

.stat-card {
  background: white;
  padding: 24px;
  border-radius: 24px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.04);
  transition: all 0.3s ease;
  border: 1px solid #eef2ff;
  position: relative;
  overflow: hidden;
}

.stat-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: var(--card-accent, #3b82f6);
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
}

.stat-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 16px;
}

.stat-icon {
  font-size: 28px;
}

.stat-label {
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-weight: 600;
  color: #64748b;
}

.stat-value {
  font-size: 2.5rem;
  font-weight: 800;
  color: #0f172a;
  margin-bottom: 12px;
  letter-spacing: -1px;
}

.stat-trend {
  font-size: 0.75rem;
  display: flex;
  align-items: center;
  gap: 4px;
}

.stat-trend.positive {
  color: #10b981;
}

.stat-trend.neutral {
  color: #f59e0b;
}

/* Recent Section */
.recent-section {
  background: white;
  border-radius: 24px;
  padding: 28px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.04);
  border: 1px solid #eef2ff;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  flex-wrap: wrap;
  gap: 16px;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 10px;
}

.title-icon {
  font-size: 24px;
}

.section-title h2 {
  font-size: 1.4rem;
  font-weight: 600;
  color: #1e293b;
}

.view-all-btn {
  background: #f1f5f9;
  border: none;
  padding: 8px 20px;
  border-radius: 40px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 8px;
  color: #334155;
}

.view-all-btn:hover {
  background: #e2e8f0;
  transform: translateX(2px);
}

/* Table Styles */
.table-wrapper {
  overflow-x: auto;
  margin-bottom: 20px;
}

.members-table {
  width: 100%;
  border-collapse: collapse;
}

.members-table th {
  text-align: left;
  padding: 16px 12px;
  background: #f8fafc;
  font-weight: 600;
  color: #475569;
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.members-table td {
  padding: 16px 12px;
  border-bottom: 1px solid #e9eef3;
  vertical-align: middle;
}

.members-table tr:hover {
  background: #fefce8;
  transition: 0.2s;
}

.member-cell {
  display: flex;
  align-items: center;
  gap: 12px;
}

.member-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  color: white;
  font-size: 1rem;
}

.member-info {
  display: flex;
  flex-direction: column;
}

.member-name {
  font-weight: 600;
  color: #1e293b;
}

.member-email {
  font-size: 0.7rem;
  color: #94a3b8;
}

/* Badges */
.plan-badge {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 40px;
  font-size: 0.75rem;
  font-weight: 600;
}

.plan-yearly {
  background: #dcfce7;
  color: #15803d;
}

.plan-monthly {
  background: #e0f2fe;
  color: #0369a1;
}

.plan-quarterly {
  background: #fef3c7;
  color: #b45309;
}

.status-badge {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 40px;
  font-size: 0.7rem;
  font-weight: 700;
}

.status-active {
  background: #dcfce7;
  color: #15803d;
}

.status-inactive {
  background: #fee2e2;
  color: #b91c1c;
}

.action-btn {
  background: transparent;
  border: none;
  font-size: 18px;
  cursor: pointer;
  padding: 6px;
  border-radius: 8px;
  transition: all 0.2s;
}

.action-btn:hover {
  background: #f1f5f9;
  transform: scale(1.1);
}

/* Table Footer */
.table-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 20px;
  border-top: 1px solid #e9eef3;
  flex-wrap: wrap;
  gap: 16px;
}

.members-summary {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.8rem;
  color: #64748b;
}

.dot {
  width: 8px;
  height: 8px;
  background: #10b981;
  border-radius: 50%;
  display: inline-block;
}

.renewal-alert {
  background: #fef3c7;
  padding: 6px 14px;
  border-radius: 40px;
  font-size: 0.75rem;
  font-weight: 500;
  color: #b45309;
}

/* Responsive */
@media (max-width: 768px) {
  .dashboard {
    flex-direction: column;
  }

  .sidebar {
    width: 100%;
    height: auto;
    position: relative;
    padding: 20px;
  }

  .nav-menu {
    flex-direction: row;
    flex-wrap: wrap;
    gap: 12px;
  }

  .nav-menu li {
    padding: 8px 16px;
  }

  .logout-item {
    margin-top: 0;
    border-top: none;
  }

  .main {
    padding: 20px;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }

  .stat-value {
    font-size: 1.8rem;
  }
}

@media (max-width: 480px) {
  .greeting-badge h1 {
    font-size: 1.2rem;
  }

  .section-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .members-table th,
  .members-table td {
    padding: 12px 8px;
  }

  .member-avatar {
    width: 32px;
    height: 32px;
    font-size: 0.8rem;
  }
}
</style>