import http from "@/http";
import router from "@/router";
import { Category } from "@/types/Category";
import { createStore, Store } from "vuex";
import {Courier} from '@/types/Courier'

interface State {
  categoriesName: Category[];
  allFoodsNames: string[];
}

const store: Store<State> = createStore({
  state: {
    categoriesName: [],
    allFoodsNames: [],
    allContainers: [],
    allFood:[],
    allCouriers:[]  as Courier[]
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

    async fetchAllFood({state}){
      try{
      const response = await http('foods/get-all-foods')
      if(response.status===200){
state.allFood=response.data;
console.log('response get all food',response)
      }  
      }catch(err){
        console.log(err)
      }
    },

    async fetchAllCouriers({state}){
      try{
        const response = await http('admin/get-all-couriers');
        console.log('fetch couriers response',response)
        if(response.status===200){
          state.allCouriers=response.data;
          console.log('state.allCouriers=response.data;',state.allCouriers)
        }

      }catch(err){
        console.log(err)
      }
    }
  },
  getters: {
    categoriesName(state: State): Category[] {
      return state.categoriesName;
    },
    allFoodsNames(state: State) {
      return state.allFoodsNames;
    },
    allFoodsNamesObj(state:State){
return state.allFoodsNames.map((item)=>{
  return {name:item}
})
    },

    allContainers(state) {
      return state.allContainers;
    },

    getFood(state){
      return state.allFood
    },
    getCouriers(state){
      return state.allCouriers
    }
    
  },
});

export default store;
