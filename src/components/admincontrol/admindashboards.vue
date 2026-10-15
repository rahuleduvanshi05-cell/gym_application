<template>
  <div class="dashboard">

    <!-- Sidebar -->
    <aside class="sidebar">

      <h2>
        Admin Panel
      </h2>

      <ul>

        <li>
          Dashboard
        </li>

        <li>
          Users
        </li>


        <!-- Membership Button -->
        <li
          @click="
            goToMembership
          "
        >
          Membership
        </li>

        <li
          @click="
            allMembershipPlans
          "
        >
          All Membership Plan
        </li>


        <li @click="logout">
          Logout
        </li>

      </ul>

    </aside>


    <!-- Main -->
    <main class="main">

      <div class="topbar">

        <h1>
          Gym Users
        </h1>

      </div>


      <!-- Table -->
      <div class="table-container">

        <table>

          <thead>

            <tr>

              <th>
                Name
              </th>

              <th>
                Email
              </th>

              <th>
                Status
              </th>

              <th>
                Actions
              </th>

            </tr>

          </thead>


          <tbody>

            <tr
              v-for="user in users"
              :key="user._id"
            >

              <td>
                {{ user.name }}
              </td>

              <td>
                {{ user.email }}
              </td>

              <td>

                <span
                  :class="
                    user.status
                  "
                >
                  {{ user.status }}
                </span>

              </td>

              <td>

                <button
                  class="active-btn"
                  @click="
                    activateUser(
                      user._id
                    )
                  "
                >
                  Active
                </button>


                <button
                  class="deactive-btn"
                  @click="
                    deactivateUser(
                      user._id
                    )
                  "
                >
                  Deactive
                </button>

              </td>

            </tr>

          </tbody>

        </table>

      </div>

    </main>

  </div>
</template>

<script setup>
import {
  ref,
  onMounted,
} from "vue";

import axios
from "axios";

import { useRouter }
from "vue-router";


const router = useRouter();

const users = ref([]);


// ================= GET USERS =================
const getUsers =
  async () => {

    try {

      const res =
        await axios.get(
          "http://localhost:5000/api/admin/users"
        );

      users.value =
        res.data.users;

    } catch (error) {

      console.log(
        error
      );
    }
  };


// ================= ACTIVATE USER =================
const activateUser =
  async (id) => {

    try {

      await axios.put(
        `http://localhost:5000/api/admin/user/active/${id}`
      );

      getUsers();

    } catch (error) {

      console.log(
        error
      );
    }
  };


// ================= DEACTIVATE USER =================
const deactivateUser =
  async (id) => {

    try {

      await axios.put(
        `http://localhost:5000/api/admin/user/deactive/${id}`
      );

      getUsers();

    } catch (error) {

      console.log(
        error
      );
    }
  };


// ================= MEMBERSHIP PAGE =================
const goToMembership =
  () => {

    router.push(
      "/adminmembership"
    );
  };

const allMembershipPlans =
  () => {

    router.push(
      "/allmembership"
    );
  };


// ================= LOGOUT =================
const logout = () => {

  localStorage.removeItem(
    "adminToken"
  );

  localStorage.removeItem(
    "admin"
  );

  router.push(
    "/admin"
  );
};


// Load Users
onMounted(() => {

  getUsers();
});
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: Arial;
}


/* Layout */
.dashboard {
  display: flex;
  min-height: 100vh;
}


/* Sidebar */
.sidebar {
  width: 250px;

  background: #111827;

  color: white;

  padding: 30px;
}

.sidebar ul {
  list-style: none;

  margin-top: 30px;
}

.sidebar li {
  padding: 15px;

  background: #1f2937;

  margin-bottom: 10px;

  border-radius: 8px;

  cursor: pointer;

  transition: 0.3s;
}

.sidebar li:hover {
  background: #374151;
}


/* Main */
.main {
  flex: 1;

  padding: 30px;

  background: #f4f6f9;
}


/* Table */
.table-container {
  background: white;

  padding: 20px;

  border-radius: 10px;

  margin-top: 20px;
}

table {
  width: 100%;

  border-collapse: collapse;
}

th,
td {
  padding: 15px;

  border-bottom:
    1px solid #ddd;

  text-align: left;
}


/* Status */
.active {
  color: green;

  font-weight: bold;
}

.deactive {
  color: red;

  font-weight: bold;
}


/* Buttons */
button {
  border: none;

  padding: 8px 12px;

  margin-right: 10px;

  cursor: pointer;

  border-radius: 5px;
}

.active-btn {
  background: green;

  color: white;
}

.deactive-btn {
  background: red;

  color: white;
}
</style>