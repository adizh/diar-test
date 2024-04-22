import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "Home",

    component: () => import("@/pages/Home.vue"),
    children: [
      {
        path: "/",
        name: "Main",
        component: () => import("@/pages/Main.vue"),
      },
      {
        path: "/awaiting-orders",
        name: "Awaiting",
        component: () => import("@/pages/Orders/Awaiting.vue"),
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
        path: "/cooked-orders",
        name: "CookedOrdes",
        component: () => import("@/pages/Orders/Cooked.vue"),
      },
      {
        path: "/cooked-orders-pickup",
        name: "CookedOrderPickup",
        component: () => import("@/pages/Orders/CookedPickup.vue"),
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
