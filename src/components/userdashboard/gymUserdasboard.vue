<template>
  <div class="dashboard">

    <!-- Sidebar -->
    <aside class="sidebar">

      <h2 class="logo">
        Gym App
      </h2>

      <ul class="menu">
        <li>
          Dashboard
        </li>

        <li>
          Profile
        </li>

        <li>
          Membership
        </li>

        <li>
          Workout
        </li>

        <li @click="logout">
          Logout
        </li>
      </ul>

    </aside>


    <!-- Main Content -->
    <main class="main">

      <!-- Topbar -->
      <div class="topbar">

        <div>
          <h1>
            Welcome,
            {{ user?.name }}
          </h1>

          <p>
            {{ user?.email }}
          </p>
        </div>

      </div>


      <!-- Cards -->
      <div class="cards">

        <div class="card">
          <h3>
            Membership
          </h3>

          <p>
            Active
          </p>
        </div>


        <div class="card">
          <h3>
            Workout Days
          </h3>

          <p>
            5 Days / Week
          </p>
        </div>


        <div class="card">
          <h3>
            Calories Burned
          </h3>

          <p>
            1200 kcal
          </p>
        </div>

      </div>


      <!-- Profile Box -->
      <div class="profile-box">

        <h2>
          My Profile
        </h2>

        <div class="profile-info">

          <p>
            <strong>Name:</strong>
            {{ user?.name }}
          </p>

          <p>
            <strong>Email:</strong>
            {{ user?.email }}
          </p>

        </div>

      </div>

    </main>

  </div>
</template>

<script setup>
import { computed }
from "vue";

import { useRouter }
from "vue-router";

import { useStore }
from "vuex";


const store = useStore();

const router = useRouter();


// Get User
const user = computed(
  () =>
    store.getters.currentUser
);


// Logout
const logout = () => {

  store.dispatch(
    "logout"
  );

  router.push("/");
};
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: Arial;
  background: #f4f6f9;
}


/* Dashboard Layout */
.dashboard {
  display: flex;
  min-height: 100vh;
}


/* Sidebar */
.sidebar {
  width: 250px;
  background: #111827;
  color: white;
  padding: 30px 20px;
}

.logo {
  margin-bottom: 40px;
}

.menu {
  list-style: none;
}

.menu li {
  padding: 15px;
  margin-bottom: 10px;
  background: #1f2937;
  border-radius: 8px;
  cursor: pointer;
  transition: 0.3s;
}

.menu li:hover {
  background: #374151;
}


/* Main */
.main {
  flex: 1;
  padding: 30px;
}


/* Topbar */
.topbar {
  margin-bottom: 30px;
}


/* Cards */
.cards {
  display: grid;
  grid-template-columns:
    repeat(auto-fit, minmax(220px, 1fr));

  gap: 20px;

  margin-bottom: 30px;
}

.card {
  background: white;
  padding: 25px;
  border-radius: 10px;
  box-shadow:
    0 2px 10px rgba(0,0,0,0.1);
}

.card h3 {
  margin-bottom: 10px;
}


/* Profile */
.profile-box {
  background: white;
  padding: 25px;
  border-radius: 10px;
  box-shadow:
    0 2px 10px rgba(0,0,0,0.1);
}

.profile-info p {
  margin-top: 10px;
}


/* Responsive */
@media (max-width: 768px) {

  .dashboard {
    flex-direction: column;
  }

  .sidebar {
    width: 100%;
  }
}
</style>