<template>
  <div class="container">

    <!-- Header -->
    <div class="topbar">

      <h1>
        All Membership Plans
      </h1>

    </div>


    <!-- Membership Plans -->
    <div class="plans-grid">

      <div
        class="plan-card"

        v-for="plan in memberships"
        :key="plan._id"
      >

        <!-- Plan Name -->
        <h2>
          {{ plan.title }}
        </h2>


        <!-- Duration -->
        <p class="duration">

          {{ plan.durationValue }}
          {{ plan.durationType }}

        </p>


        <!-- Price -->
        <h3 class="price">

          ₹ {{ plan.price }}

        </h3>


        <!-- Description -->
        <p class="description">

          {{ plan.description }}

        </p>


        <!-- Buttons -->
        <div class="actions">

          <button
            class="edit-btn"
          >
            Edit
          </button>


          <button
            class="delete-btn"
            @click="
              deleteMembership(
                plan._id
              )
            "
          >
            Delete
          </button>

        </div>

      </div>

    </div>

  </div>
</template>

<script setup>
import {
  ref,
  onMounted,
} from "vue";

import axios
from "axios";


// ================= STATE =================
const memberships =
  ref([]);


// ================= GET MEMBERSHIPS =================
const getMemberships =
  async () => {

    try {

      const res =
        await axios.get(
          "http://localhost:5001/api/membership/all"
        );

      memberships.value =
        res.data.memberships;

    } catch (error) {

      console.log(
        error
      );
    }
  };


// ================= DELETE MEMBERSHIP =================
const deleteMembership =
  async (id) => {

    try {

      const confirmDelete =
        confirm(
          "Are you sure you want to delete this membership?"
        );

      if (
        !confirmDelete
      ) return;


      await axios.delete(
        `http://localhost:5001/api/membership/delete/${id}`
      );


      alert(
        "Membership Deleted"
      );


      getMemberships();

    } catch (error) {

      console.log(
        error
      );
    }
  };


// ================= LOAD DATA =================
onMounted(() => {

  getMemberships();
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
  background: #f4f6f9;
}


/* Container */
.container {
  padding: 30px;
}


/* Header */
.topbar {
  margin-bottom: 30px;
}

.topbar h1 {
  font-size: 32px;
  color: #111827;
}


/* Plans Grid */
.plans-grid {
  display: grid;

  grid-template-columns:
    repeat(
      auto-fit,
      minmax(280px, 1fr)
    );

  gap: 25px;
}


/* Plan Card */
.plan-card {
  background: white;

  padding: 25px;

  border-radius: 12px;

  box-shadow:
    0 0 10px rgba(0,0,0,0.08);

  transition: 0.3s;
}

.plan-card:hover {
  transform:
    translateY(-5px);
}


/* Title */
.plan-card h2 {
  margin-bottom: 10px;

  color: #111827;
}


/* Duration */
.duration {
  color: #2563eb;

  font-weight: bold;

  margin-bottom: 10px;
}


/* Price */
.price {
  font-size: 28px;

  margin-bottom: 15px;

  color: green;
}


/* Description */
.description {
  color: #555;

  margin-bottom: 20px;
}


/* Buttons */
.actions {
  display: flex;

  gap: 10px;
}

button {
  flex: 1;

  padding: 12px;

  border: none;

  border-radius: 6px;

  cursor: pointer;

  color: white;

  font-weight: bold;
}

.edit-btn {
  background: #2563eb;
}

.delete-btn {
  background: red;
}
</style>