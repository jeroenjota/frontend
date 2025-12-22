import Tours from "../components/Tours.vue";
import TourDetail from "../components/TourDetail.vue";
import { createRouter, createWebHistory } from "vue-router";

const routes = [
  { path: "/", component: Tours }, 
  { path: "/tour/:id", component: TourDetail }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;  