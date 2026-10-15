<template>
  <div class="container">

    <div class="card">

      <h1>Register</h1>

      <form
        @submit.prevent="register"
      >

        <input
          v-model="name"
          type="text"
          placeholder="Name"
        />

        <input
          v-model="email"
          type="email"
          placeholder="Email"
        />

        <input
          v-model="password"
          type="password"
          placeholder="Password"
        />

        <button>
          Register
        </button>

      </form>

    </div>

  </div>
</template>

<script setup>
import { ref } from "vue";

import { useRouter }
from "vue-router";

import { useStore }
from "vuex";


const store = useStore();

const router = useRouter();

const name = ref("");

const email = ref("");

const password = ref("");


const register = async () => {

  try {

    await store.dispatch(
      "register",
      {
        name:
          name.value,

        email:
          email.value,

        password:
          password.value,
      }
    );

    alert(
      "Registration Successful"
    );

    router.push(
      "/dashboard"
    );

  } catch (error) {

    alert(
      error.response.data.message
    );
  }
};
</script>