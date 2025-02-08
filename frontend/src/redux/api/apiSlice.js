import { BASE_URL } from "../constants";
import {fetchBaseQuery, createApi} from "@reduxjs/toolkit/query/react"

const baseQuery = fetchBaseQuery({ baseUrl: BASE_URL });

export const apiSlice = createApi({
  baseQuery,
  tagTypes: ["Product", "Order", "User", "Category","Cart","Wishlist"],
  endpoints: () => ({}),
});


