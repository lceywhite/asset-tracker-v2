import { createRouter, createWebHashHistory } from "vue-router"
const routes = [
  { path: "/", redirect: "/home" },
  { path: "/home", name: "Home", component: () => import("@/views/HomeView.vue") },
  { path: "/bag/:id", name: "BagDetail", component: () => import("@/views/BagDetailView.vue") },
  { path: "/room/:id", name: "RoomDetail", component: () => import("@/views/RoomDetailView.vue") },
  { path: "/item/:id", name: "ItemDetail", component: () => import("@/views/ItemDetailView.vue") },
  { path: "/checklists", name: "Checklists", component: () => import("@/views/ChecklistsView.vue") },
  { path: "/checklists/:id", name: "ChecklistDetail", component: () => import("@/views/ChecklistDetailView.vue") },
  { path: "/trips", name: "Trips", component: () => import("@/views/TripsView.vue") },
  { path: "/trips/:id", name: "TripDetail", component: () => import("@/views/TripDetailView.vue") },
  { path: "/settings", name: "Settings", component: () => import("@/views/SettingsView.vue") }
]
export default createRouter({ history: createWebHashHistory(), routes })