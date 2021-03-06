import { configureStore } from "@reduxjs/toolkit";
import dateReducer from "./slicers/datePickerSlice";
import messengerReducer from "./slicers/messengerSlice";
import userReducer from "./slicers/userSlice";
import petReducer from "./slicers/petSlice";
import filterOptionReducer from "./slicers/filterOptionSlice";
import tagReducer from "./slicers/tagSlice";

const store = configureStore({
  reducer: {
    user: userReducer,
    pet: petReducer,
    messenger: messengerReducer,
    datePicker: dateReducer,
    filterOptions: filterOptionReducer,
    tag: tagReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;
