import {
  createStore
} from "vuex";

import API from "../components/api/axios";


export default createStore({

  // ================= STATE =================
  state: {
    token:
      localStorage.getItem(
        "token"
      ) || null,

    user:
      JSON.parse(
        localStorage.getItem(
          "user"
        )
      ) || null,
  },


  // ================= MUTATIONS =================
  mutations: {

    SET_AUTH(state, data) {

      state.token =
        data.token;

      state.user =
        data.user;
    },


    LOGOUT(state) {

      state.token = null;

      state.user = null;
    },
  },


  // ================= ACTIONS =================
  actions: {

    // Register
    async register(
      { commit },
      formData
    ) {

      const res =
        await API.post(
          "/auth/register",
          formData
        );


      localStorage.setItem(
        "token",
        res.data.token
      );

      localStorage.setItem(
        "user",
        JSON.stringify(
          res.data.user
        )
      );


      commit(
        "SET_AUTH",
        {
          token:
            res.data.token,

          user:
            res.data.user,
        }
      );
    },


    // Login
    async login(
      { commit },
      formData
    ) {

      const res =
        await API.post(
          "/auth/login",
          formData
        );


      localStorage.setItem(
        "token",
        res.data.token
      );

      localStorage.setItem(
        "user",
        JSON.stringify(
          res.data.user
        )
      );


      commit(
        "SET_AUTH",
        {
          token:
            res.data.token,

          user:
            res.data.user,
        }
      );
    },


    // Logout
    logout({ commit }) {

      localStorage.removeItem(
        "token"
      );

      localStorage.removeItem(
        "user"
      );

      commit("LOGOUT");
    },
  },


  // ================= GETTERS =================
  getters: {

    isAuthenticated:
      (state) =>
        !!state.token,

    currentUser:
      (state) =>
        state.user,
  },
});