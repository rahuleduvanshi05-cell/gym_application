<template>
  <div class="container">

    <div class="login-card">

      <h1>
        Admin Login
      </h1>

      <form
        @submit.prevent="login"
      >

        <input
          v-model="email"
          type="email"
          placeholder="Admin Email"
        />

        <input
          v-model="password"
          type="password"
          placeholder="Password"
        />

        <button>
          Login
        </button>

      </form>

    </div>

  </div>
</template>

<script setup>
import { ref }
from "vue";

import axios
from "axios";

import { useRouter }
from "vue-router";


const router = useRouter();

const email = ref("");

const password = ref("");


const login = async () => {

  try {

    const res =
      await axios.post(
        "http://localhost:5001/api/admin/login",
        {
          email:
            email.value,

          password:
            password.value,
        }
      );


    localStorage.setItem(
      "adminToken",
      res.data.token
    );

    localStorage.setItem(
      "admin",
      JSON.stringify(
        res.data.admin
      )
    );


    alert(
      "Admin Login Success"
    );

    router.push(
      "/AdminDashboard"
    );

  } catch (error) {

    alert(
      error.response.data.message
    );
  }
};
</script>

<style>
body {
  margin: 0;
  font-family: Arial;
  background: #f4f4f4;
}

.container {
  height: 100vh;

  display: flex;

  justify-content: center;

  align-items: center;
}

.login-card {
  width: 350px;

  background: white;

  padding: 30px;

  border-radius: 10px;

  box-shadow:
    0 0 10px rgba(0,0,0,0.1);
}

input {
  width: 100%;

  padding: 12px;

  margin-bottom: 15px;
}

button {
  width: 100%;

  padding: 12px;

  border: none;

  background: black;

  color: white;

  cursor: pointer;
}
</style>