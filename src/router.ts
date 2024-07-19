import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import CourierOrder from "@/components/Courier/Order.vue";
const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "Home",

    component: () => import("@/pages/Home.vue"),
    children: [
      {
        path: "/",
        name: "Awaiting",
        component: () => import("@/pages/Orders/Awaiting.vue"),
      },
      {
        path: "/menu",
        name: "Menu",
        component: () => import("@/pages/Menu.vue"),
      },
      {
        path: "/sent-to-kitchen",
        name: "SentToKitchen",
        component: () => import("@/pages/Orders/SentKitchen.vue"),
      },
      {
        path: "/sent-to-kitchen-pickup",
        name: "SentToKitchenPicktup",
        component: () => import("@/pages/SentToKitchenPickup.vue"),
      },
      {
        path: "/news",
        name: "News",
        component: () => import("@/pages/News.vue"),
      },
      {
        path: "/sales",
        name: "Sales",
        component: () => import("@/pages/Sales.vue"),
      },
      {
        path: "/awaiting-orders-pickup",
        name: "AwaitinPickup",
        component: () => import("@/pages/Orders/AwaitingPickup.vue"),
      },
      {
        path: "/cancelled-orders-pickup",
        name: "CancelledPickupOrders",
        component: () => import("@/pages/Orders/CancelledPickup.vue"),
      },

      {
        path: "/cancelled-orders",
        name: "CancelledOrder",
        component: () => import("@/pages/Orders/Cancelled.vue"),
      },
      {
        path: "/closed-orders",
        name: "ClosedOrders",
        component: () => import("@/pages/Orders/Closed.vue"),
      },
      {
        path: "/closed-orders-pickup",
        name: "ClosedPickUp",
        component: () => import("@/pages/Orders/ClosedPickup.vue"),
      },
      {
        path: "/courier/:id",
        name: "CourierOrder",
        component: CourierOrder,
      },
      {
        path: "/delegated-orders",
        name: "DelegatedOrders",
        component: () => import("@/pages/Orders/Delegated.vue"),
      },
      {
        path: "/all-couriers",
        name: "AllCouriers",
        component: () => import("@/pages/Couriers/AllCouriers.vue"),
      },
      {
        path: "/add-items",
        name: "AddNewItems",
        component: () => import("@/pages/Items/AddNew.vue"),
      },
      {
        path: "/update-items",
        name: "UpdateItems",
        component: () => import("@/pages/UpdateItems/UpdateItems.vue"),
      },
      {
        path: "/delete-items",
        name: "Delete items",
        component: () => import("@/pages/Items/DeleteItems.vue"),
      },
    ],
  },

  {
    path: "/auth",
    name: "Auth",
    component: () => import("@/pages/Login.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem("accessToken");
  const isAuthenticated = token ? true : false;

  if (isAuthenticated && to.name === "Auth") {
    next({ name: "Main" });
  } else if (!isAuthenticated && to.name !== "Auth") {
    next({ name: "Auth" });
  } else {
    next();
  }
});

export default router;
