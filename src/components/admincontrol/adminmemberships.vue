<template>
  <div class="container">

    <!-- Create Membership -->
    <div class="card">

      <h1>
        Membership Plans
      </h1>


      <!-- Form -->
      <form
        @submit.prevent="createMembership"
      >

        <!-- Plan Name -->
        <input
          v-model="title"
          type="text"
          placeholder="Plan Name"
        />


        <!-- Duration Type -->
        <select
          v-model="durationType"
        >

          <option value="">
            Select Duration Type
          </option>

          <option value="days">
            Days
          </option>

          <option value="monthly">
            Monthly
          </option>

          <option value="yearly">
            Yearly
          </option>

        </select>


        <!-- Duration Value -->
        <input
          v-model="durationValue"
          type="number"
          placeholder="Enter Duration Value"
        />


        <!-- Price -->
        <input
          v-model="price"
          type="number"
          placeholder="Price"
        />


        <!-- Description -->
        <textarea
          v-model="description"
          placeholder="Description"
        ></textarea>


        <!-- Button -->
        <button>
          Create Plan
        </button>

      </form>

    </div>


    <!-- Membership List -->
    <div class="list">

      <div
        class="membership-card"
        v-for="item in memberships"
        :key="item._id"
      >

        <h2>
          {{ item.title }}
        </h2>


        <!-- Duration -->
        <p>

          <strong>
            Duration:
          </strong>

          {{ item.durationValue }}
          {{ item.durationType }}

        </p>


        <!-- Price -->
        <p>

          <strong>
            Price:
          </strong>

          ₹ {{ item.price }}

        </p>


        <!-- Description -->
        <p>
          {{ item.description }}
        </p>


        <!-- Delete -->
        <button
          class="delete-btn"
          @click="
            deleteMembership(
              item._id
            )
          "
        >
          Delete
        </button>

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


// ================= FORM DATA =================
const title =
  ref("");

const durationType =
  ref("");

const durationValue =
  ref("");

const price =
  ref("");

const description =
  ref("");


// ================= MEMBERSHIP LIST =================
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


// ================= CREATE MEMBERSHIP =================
const createMembership =
  async () => {

    try {

      await axios.post(
        "http://localhost:5001/api/membership/create",
        {
          title:
            title.value,

          durationType:
            durationType.value,

          durationValue:
            durationValue.value,

          price:
            price.value,

          description:
            description.value,
        }
      );


      alert(
        "Membership Created Successfully"
      );


      // Reset Form
      title.value = "";

      durationType.value = "";

      durationValue.value = "";

      price.value = "";

      description.value = "";


      // Reload Data
      getMemberships();

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

      await axios.delete(
        `http://localhost:5001/api/membership/delete/${id}`
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
  background: #f4f4f4;
}


/* Container */
.container {
  padding: 30px;
}


/* Form Card */
.card {
  background: white;

  padding: 30px;

  border-radius: 10px;

  margin-bottom: 30px;

  box-shadow:
    0 0 10px rgba(0,0,0,0.1);
}


/* Inputs */
input,
select,
textarea {
  width: 100%;

  padding: 12px;

  margin-bottom: 15px;

  border:
    1px solid #ddd;

  border-radius: 5px;
}


/* Buttons */
button {
  padding: 12px 20px;

  border: none;

  background: black;

  color: white;

  cursor: pointer;

  border-radius: 5px;
}


/* Membership Grid */
.list {
  display: grid;

  grid-template-columns:
    repeat(
      auto-fit,
      minmax(250px, 1fr)
    );

  gap: 20px;
}


/* Membership Card */
.membership-card {
  background: white;

  padding: 20px;

  border-radius: 10px;

  box-shadow:
    0 0 10px rgba(0,0,0,0.1);
}

.membership-card h2 {
  margin-bottom: 10px;
}

.membership-card p {
  margin-bottom: 10px;
}


/* Delete Button */
.delete-btn {
  margin-top: 10px;

  background: red;
}
</style>