import http from "@/http";
import router from "@/router";
import {
  Category,
  CategoryWithFoods,
  CategoryWithFoodsUpdated,
} from "@/types/Category";
import { createStore, Store } from "vuex";
import { Courier } from "@/types/Courier";
import { Food, OrderFood } from "@/types/Food";
import { AwaitingOrder } from "@/types/Order";
import { useToast } from "primevue/usetoast";
import { Container } from "@/types/Container";

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
    categoriesWithFoods: [] as CategoryWithFoodsUpdated[],
    filterCategoriesWithFoods: [] as CategoryWithFoodsUpdated[],
    awaitingPickupOrders: [] as AwaitingOrder[],
    awaitingPickupOrdersFilter: [] as AwaitingOrder[],
    closedPickUpOrders: [] as AwaitingOrder[],
    cookedPickUpOrders: [] as AwaitingOrder[],
    filterCookedPickUpOrders: [] as AwaitingOrder[],

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
        if (response.status === 200) {
          state.categoriesWithFoods = response.data?.map(
            (item: CategoryWithFoods) => ({
              id: item.Category.id,
              name: item.Category.name,
              foods: item.Foods,
            }),
          );
        }
        state.filterCategoriesWithFoods = response.data?.map(
          (item: CategoryWithFoods) => ({
            id: item.Category.id,
            name: item.Category.name,
            foods: item.Foods,
          }),
        );
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
          state.awaitingPickupOrdersFilter = response.data?.pickUpOrders;
          state.stats.awatingOrdersPickupCount =
            response?.data?.pickUpOrders?.length || 0;
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

    filterKitchkenPickup(
      { state },
      payload: { filterType: "phone" | "orderNumber"; value: string },
    ) {
      if (payload.filterType === "orderNumber") {
        const results = state.filterCookedPickUpOrders?.filter((item) =>
          String(item?.orderNumber)?.includes(payload.value),
        );

        if (payload.value && payload.value?.length > 0) {
          state.cookedPickUpOrders = results;
        }
        if (payload.value === "null") {
          state.cookedPickUpOrders = state.filterCookedPickUpOrders;
        }
      } else {
        const normalizePhone = (phone: string) => {
          return phone.replace(/[^\d]/g, "");
        };

        const results = state.filterCookedPickUpOrders?.filter((item) => {
          const normalizedUserPhone = normalizePhone(item?.userPhone);
          return normalizedUserPhone.includes(payload.value);
        });

        if (payload.value?.length > 0) {
          state.cookedPickUpOrders = results;
        } else if (payload.filterType === "phone") {
          state.cookedPickUpOrders = state.filterCookedPickUpOrders;
        } else {
          state.cookedPickUpOrders = state.filterCookedPickUpOrders;
        }
      }
    },

    async fetchCookedPickUp({ state }) {
      try {
        const response = await http("admin/get-all-cooked-pickup-orders");
        if (response.status === 200) {
          state.cookedPickUpOrders = response.data.pickUpOrders;
          state.filterCookedPickUpOrders = response.data.pickUpOrders;
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

    filterAwaitingPickupOrderNumber({ state }, orderNumber: number) {
      const value = String(orderNumber);
      console.log("filter order by number", orderNumber);
      const results = state.awaitingPickupOrdersFilter?.filter((item) =>
        String(item?.orderNumber)?.includes(value),
      );
      state.awaitingPickupOrders = results;

      if (results?.length) {
        state.awaitingPickupOrders = results;
      } else if (!results.length && orderNumber === null) {
        state.awaitingPickupOrders = state.awaitingPickupOrdersFilter;
      }
    },
    filterAwaitingPickupOrderPhone({ state }, phone: string) {
      const normalizePhone = (phone: string) => {
        return phone.replace(/[^\d]/g, "");
      };
      const normalizedInput = normalizePhone(phone);
      const results = state.awaitingPickupOrdersFilter?.filter((item) => {
        const normalizedUserPhone = normalizePhone(item?.userPhone);
        return normalizedUserPhone.includes(normalizedInput);
      });

      if (phone?.length > 0) {
        state.awaitingPickupOrders = results;
      } else {
        state.awaitingPickupOrders = state.awaitingPickupOrdersFilter;
      }
    },

    resetAwaitingPickup({ state }) {
      state.awaitingPickupOrders = state.awaitingPickupOrdersFilter;
    },

    async fetchStats({ dispatch }) {
      await dispatch("fetchKitchenOrders");
      await dispatch("fetchAwaitingPickup");
      await dispatch("fetchAwaitingOrders");
      await dispatch("fetchCookedPickUp");
    },

    async sendFoodToStopList(
      { state },
      body: { foodName: string; status: boolean },
    ) {
      if (body.foodName) {
        try {
          const response = await http.post("/admin/change-of-stop-list", body);
          console.log("hide food response", response);
          return response.status;
        } catch (err) {
          console.log(err);
        }
      }
    },
    async deleteFood({ state }, foodName: string) {
      if (foodName?.length > 0) {
        try {
          const response = await http({
            method: "delete",
            url: `admin/delete-food`,
            data: { name: foodName },
          });
          console.log("response delete food", response);
          return response.status;
        } catch (err: any) {
          console.log(err);
        }
      }
    },

    filterCategoriesWithFoodsByFoodName({ state }, search) {
      console.log("search", search);
      if (search.length > 0) {
        const searchLower = search.toLowerCase();
        const result = state.filterCategoriesWithFoods
          .map((item) => {
            const filteredFoods = item.foods.filter((foodItem) => {
              const foodName = foodItem?.name?.toLowerCase();
              return foodName?.includes(searchLower);
            });
            return {
              ...item,
              foods: filteredFoods,
            };
          })
          .filter((category) => category.foods.length > 0);

        console.log("result", result);
        state.categoriesWithFoods = result;
      } else {
        state.categoriesWithFoods = state.filterCategoriesWithFoods;
      }
    },

    filterCategoriesWithFoodsByCategory({ state }, search) {
      if (search.length > 0) {
        const searchLower = search.toLowerCase()?.replace(/\s+/g, " ")?.trim();
        const result = state.filterCategoriesWithFoods?.filter(
          (item: CategoryWithFoodsUpdated) =>
            item.name?.toLowerCase().includes(searchLower),
        );
        state.categoriesWithFoods = result;
      } else {
        state.categoriesWithFoods = state.filterCategoriesWithFoods;
      }
    },
    filterCategoriesWithFoods({ state }, search) {
      if (search.length > 0) {
        const searchLower = search.toLowerCase();
        const result = state.filterCategoriesWithFoods
          .map((item) => {
            const filteredFoods = item.foods.filter((foodItem) => {
              const foodName = foodItem?.name?.toLowerCase();
              return (
                item?.name?.toLowerCase()?.includes(searchLower) ||
                foodName?.includes(searchLower)
              );
            });
            return {
              ...item,
              foods: filteredFoods,
            };
          })
          .filter((category) => category?.foods?.length > 0);

        state.categoriesWithFoods = result;
      } else {
        state.categoriesWithFoods = state.filterCategoriesWithFoods;
      }
    },

    async fetchCourierById({ state }, courierId: string) {
      try {
        const response = await http(
          `admin/get-courier-by-id?courierId=${courierId}`,
        );
        if (response.status === 200) {
          return response.data;
        }
      } catch (err) {
        console.log(err);
      }
    },
  },

  getters: {
    categoriesName(state: State): Category[] {
      return state.categoriesName;
    },
    stats(state: State) {
      return state.stats;
    },

    getCategoriesWithFoods(state) {
      return state.categoriesWithFoods;
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
