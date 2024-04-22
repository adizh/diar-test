import http from "@/http";
import router from "@/router";
import { Category } from "@/types/Category";
import { createStore, Store } from "vuex";

interface State {
  categoriesName: Category[];
  allFoodsNames: string[];
}

const store: Store<State> = createStore({
  state: {
    categoriesName: [],
    allFoodsNames: [],
    allContainers: [],
  },
  mutations: {},
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
      if (!isRefreshToken) {
        localStorage.removeItem("accessToken");
        router.push("/");
        window.location.reload();
      } else {
        console.log("refresh token dispatch", isRefreshToken);
        try {
          const response = await http.post("/auth/refresh-token", {
            refreshToken: isRefreshToken,
          });

          console.log("response refreshToken", response);
          localStorage.setItem("accessToken", response.data.accessToken);
        } catch (err: any) {
          console.log(err);
          // console.log("refresh token expired");
          if (
            err.response.data.code === "NP-000" &&
            err.response.data.developerMessage.includes("token is expired")
          ) {
            console.log("refresh token expired");
            localStorage.removeItem("accessToken");
            window.location.reload();
          }
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
  },
  getters: {
    categoriesName(state: State): Category[] {
      return state.categoriesName;
    },
    allFoodsNames(state: State) {
      return state.allFoodsNames;
    },

    allContainers(state) {
      return state.allContainers;
    },
  },
});

export default store;
