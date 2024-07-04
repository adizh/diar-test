import http from "@/http";
import router from "@/router";
import { Category } from "@/types/Category";
import { createStore, Store } from "vuex";
import { Courier } from "@/types/Courier";
import { Food, OrderFood } from "@/types/Food";
import { AwaitingOrder } from "@/types/Order";

interface State {
  categoriesName: Category[];
  allFoodsNames: string[];
  stats: {
    awatingOrdersCount: number;
    awatingOrdersPickupCount: number;
    kitchenOrdersCount: number;
    kitchenOrdersPickupCount: number;
  };
}

const store: Store<State> = createStore({
  state: {
    categoriesName: [],
    allFoodsNames: [],
    allContainers: [],
    allFood: [],
    allCouriers: [] as Courier[],
    allFoods: [] as Food[],
    awaitingPickupOrders: [] as AwaitingOrder[],
    closedPickUpOrders: [] as AwaitingOrder[],
    cookedPickUpOrders: [] as AwaitingOrder[],
    stats: {
      awatingOrdersCount: 0,
      awatingOrdersPickupCount: 0,
      kitchenOrdersCount: 0,
      kitchenOrdersPickupCount: 0,
    },
  },
  actions: {
    async getAllCategoryNames({ state }) {
      try {
        const response = await http("categorys/get-all-category-with-foods");
        console.log("response category names", response.data);
        state.categoriesName = response.data.map((item: any) => item.Category);
        state.allFoodsNames = response.data
          .map((item: any) => item.Foods?.map((food: any) => food.name))
          .filter((eachFood: any) => Boolean(eachFood))
          .flat();
      } catch (err) {
        console.log(err);
      }
    },

    async refreshToken() {
      const isRefreshToken = localStorage.getItem("refreshToken");
      console.log("isRefreshToken", isRefreshToken);
      console.log("refresh token dispatch", isRefreshToken);
      try {
        const response = await http.post("/auth/refresh-token", {
          refreshToken: isRefreshToken,
        });
        console.log("response refreshToken", response);
        localStorage.setItem("accessToken", response.data.accessToken);
        window.location.reload();
      } catch (err: any) {
        console.log(err, "REFRESH TOKEN");
        console.log("refresh token expired");
        if (
          err.response.data.code === "NP-000" &&
          err.response.data.developerMessage.includes("token is expired")
        ) {
          console.log("refresh token expired");
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          window.location.reload();
        }
        //  }
      }
    },

    async fetchAllContainers({ state }) {
      try {
        const response = await http("containers/get-all-containers");
        console.log("response fetch all containers", response);
        if (response.status === 200) {
          state.allContainers = response.data;
        }
      } catch (err) {
        console.log(err);
      }
    },

    async fetchAllFood({ state }) {
      try {
        const response = await http("foods/get-all-foods");
        if (response.status === 200) {
          state.allFood = response.data;
          console.log("response get all food", response);
        }
      } catch (err) {
        console.log(err);
      }
    },

    async fetchAllCouriers({ state }) {
      try {
        const response = await http("admin/get-all-couriers");

        if (response.status === 200) {
          state.allCouriers = response.data?.filter(
            (item: Courier) => item?.active,
          );
        }
      } catch (err) {
        console.log(err);
      }
    },

    async fetchAllFoods({ state }) {
      try {
        const response = await http("foods/get-all-foods");
        if (response.status === 200) {
          state.allFoods = response.data;
        }
      } catch (err) {
        console.log(err);
      }
    },

    async fetchAwaitingPickup({ state }) {
      try {
        const response = (await http.get(
          "admin/get-all-awaiting-pickup-orders",
        )) as any;
        console.log("response fetchAwaitingOrders", response);
        if (response.status === 200) {
          state.awaitingPickupOrders = response.data?.pickUpOrders;
          state.stats.awatingOrdersPickupCount =
            response?.data?.pickUpOrders?.length || 0;
          console.log(
            "awatingOrdersPickupCount in vuex",
            state.stats.awatingOrdersPickupCount,
          );
        }
      } catch (err) {
        console.log(err);
      }
    },

    async fetchClosedPickUp({ state }) {
      try {
        const response = await http("admin/get-all-closed-pickup-orders");
        console.log("rresonse closed pickup", response);
      } catch (err) {
        console.log(err);
      }
    },

    async fetchCookedPickUp({ state }) {
      try {
        const response = await http("admin/get-all-cooked-pickup-orders");
        if (response.status === 200) {
          state.cookedPickUpOrders = response.data.pickUpOrders;
          state.stats.kitchenOrdersPickupCount =
            response.data?.pickUpOrders?.length || 0;
        }
        console.log("response fetchCookedPickUp", response);
      } catch (err) {
        console.log(err);
      }
    },

    async fetchAwaitingOrders({ state }) {
      try {
        const response = (await http.get(
          "admin/get-all-awaiting-orders",
        )) as any;
        console.log("response", response);
        if (response.status === 200) {
          state.stats.awatingOrdersCount = response.data.orders?.length || 0;
        }
      } catch (err) {
        console.log(err);
      }
    },

    async fetchKitchenOrders({ state }) {
      try {
        const response = await http("admin/get-all-cooked-orders");
        console.log("response");
        if (response.status === 200) {
          state.stats.kitchenOrdersCount = response.data.orders?.length || 0;
        }
      } catch (err) {
        console.log(err);
      }
    },

    async fetchStats({ dispatch }) {
      await dispatch("fetchKitchenOrders");
      await dispatch("fetchAwaitingPickup");
      await dispatch("fetchAwaitingOrders");
      await dispatch("fetchCookedPickUp");
    },
  },

  getters: {
    categoriesName(state: State): Category[] {
      return state.categoriesName;
    },
    stats(state: State) {
      return state.stats;
    },

    pickUpOrdersCount(state) {
      return state.stats.awatingOrdersPickupCount;
    },
    allFoodsNames(state: State) {
      return state.allFoodsNames;
    },
    allFoodsNamesObj(state: State) {
      return state.allFoodsNames.map((item) => {
        return { name: item };
      });
    },

    allContainers(state) {
      return state.allContainers;
    },

    getFood(state) {
      return state.allFood;
    },
    getCouriers(state) {
      return state.allCouriers;
    },
    getAllFoods(state) {
      return state.allFoods;
    },
    getAwaitingPickupOrders(state) {
      return state.awaitingPickupOrders;
    },
    getCookedPickupOrders(state) {
      return state.cookedPickUpOrders;
    },
  },
});

export default store;
