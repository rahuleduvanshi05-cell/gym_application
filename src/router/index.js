import {
  createRouter,
  createWebHistory,
} from "vue-router";

import Login from "../views/gym_User_Login.vue";
import Register from "../views/gym_User_Register.vue";
import Dashboard from "../components/userdashboard/gymUserdashboard.vue";

import FeePlan from "../components/feeplan/feeplan.vue";


// admin controller section
import AdminLogin from "../components/admincontrol/adminlogin.vue";
import AdminDashboard from "../components/admincontrol/admindashboards.vue";
import AdminMembership from "../components/admincontrol/adminmemberships.vue";
import AllMembership from "../components/admincontrol/allmembership.vue";
// import Profile from "../views/Profile.vue"

// create folder routes
import DynamicFolder from "../components/filecreate.vue"
import MetaRead from "../components/metaread/metareadupload.vue"
import Uploadfolder from "../components/metaread/foldermetaread.vue"
import Metaupload from "@/components/metaread/metaupload.vue";

const routes = [
  {
    path: "/",
    component: Login,
  },

  {
    path: "/register",
    component: Register,
  },
   {
    path: "/dynamicfolder",
    component: DynamicFolder,
  },
   {
        path: "/metareadupload",
        component: MetaRead,
      },



      {
        path: "/metaupload",
        component: Metaupload,
      },
      {
        path: "/uploadfolder",
        component: Uploadfolder,
      },

      {
        path: "/dashboard",
        component: Dashboard,
      },

{
        path: "/adminlogin",
        component: AdminLogin,
      },

{
        path: "/AdminDashboard",
        component: AdminDashboard,
      },
{
        path: "/adminmembership",
        component: AdminMembership,
      },

{
        path: "/allmembership",
        component: AllMembership,
      },
{
        path: "/fee_plan",
        component: FeePlan,
      },

//   {
//     path: "/profile",
//     component: Profile,
//   },
];


const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;