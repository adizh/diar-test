import http from "@/http";
import router from "@/router";
import { Category } from "@/types/Category";
import { createStore, Store } from "vuex";
import {Courier} from '@/types/Courier'
import { Food, OrderFood } from "@/types/Food";
import { AwaitingOrder } from "@/types/Order";

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
    allCouriers:[]  as Courier[],
    allFoods:[] as Food[],
   awaitingPickupOrders:[] as AwaitingOrder[],
   closedPickUpOrders:[]as AwaitingOrder[],
   cookedPickUpOrders:[] as AwaitingOrder[]
   
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
      if (!isRefreshToken) {
        localStorage.removeItem("accessToken");
        router.push("/");
     //   window.location.href='/'
      //  window.location.reload();
      } else {
        console.log("refresh token dispatch", isRefreshToken);
        try {
          const response = await http.post("/auth/refresh-token", {
            refreshToken: isRefreshToken,
          });

          console.log("response refreshToken", response);
          localStorage.setItem("accessToken", response.data.accessToken);
       //   window.location.href='/'
         // window.location.reload();
          
        } catch (err: any) {
          console.log(err);
        console.log("refresh token expired");
          if (
            err.response.data.code === "NP-000" &&
            err.response.data.developerMessage.includes("token is expired")
          ) {
            console.log("refresh token expired");
            localStorage.removeItem("accessToken");
           // window.location.reload();
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

        if(response.status===200){
          state.allCouriers=response.data?.filter((item:Courier)=>item?.active)
        
        }

      }catch(err){
        console.log(err)
      }
    },
    async fetchAllFoods({state}){
      try{
  const response = await http('foods/get-all-foods')
  if(response.status===200){
state.allFoods=response.data
  }
      }catch(err){
        console.log(err)
      }
    },
    async fetchAwaitingPickup({state}){
      try {
        const response = await http.get('admin/get-all-awaiting-pickup-orders') as any;
        console.log('response fetchAwaitingOrders', response)
if(response.status===200){
    state.awaitingPickupOrders=response.data?.pickUpOrders
}
    
    } catch (err) {
        console.log(err)
    }
    },
    async fetchClosedPickUp({state}){
try{
const response = await http('admin/get-all-closed-pickup-orders');
console.log('rresonse closed pickup',response)
}catch(err){
  console.log(err)
}
    },
    async fetchCookedPickUp({state}){
      try{
      const response = await http('admin/get-all-cooked-pickup-orders');
      if(response.status===200){
        state.cookedPickUpOrders=response.data.pickUpOrders;
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
    },
    getAllFoods(state){
      return state.allFoods
    },
    getAwaitingPickupOrders(state){
      return state.awaitingPickupOrders
    },
    getCookedPickupOrders(state){
      return state.cookedPickUpOrders
    }
    
  },
});

export default store;
