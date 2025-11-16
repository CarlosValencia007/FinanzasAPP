import { createRouter, createWebHistory } from "vue-router";
import homepage from "../pages/homepage.vue";
import LoginPage from "../pages/LoginPage.vue";
import RegisterPage from "../pages/RegisterPage.vue";
import TransactionsPage from "../pages/TransactionsPage.vue";

const routes = [
  {
    path: "/",
    name: "Homepage",
    component: homepage,
    meta: { requiresAuth: false },
  },
  {
    path: "/login",
    name: "Login",
    component: LoginPage,
    meta: { requiresAuth: false },
  },
  {
    path: "/register",
    name: "Register",
    component: RegisterPage,
    meta: { requiresAuth: false },
  },
  {
    path: "/transactions",
    name: "Transactions",
    component: TransactionsPage,
    meta: { requiresAuth: true },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
