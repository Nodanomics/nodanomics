import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query'
import { baseApi } from '../../api'
import {diagramDashboardSlice} from "./diagramDashboard";
import {diagramEditorSlice} from "./diagramEditor";
import {projectDashboardSlice} from "./projectDashboard";
import {teamDashboardSlice} from "./teamDashboard";

const store = configureStore({
  reducer: combineReducers({
    [baseApi.reducerPath]: baseApi.reducer,
    [diagramDashboardSlice.name]: diagramDashboardSlice.reducer,
    [projectDashboardSlice.name]: projectDashboardSlice.reducer,
    [diagramEditorSlice.name]: diagramEditorSlice.reducer,
    [teamDashboardSlice.name]: teamDashboardSlice.reducer,
  }),
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(baseApi.middleware),
})

setupListeners(store.dispatch)

export default store

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch;

export * from './diagramDashboard'
export * from './diagramEditor'
export * from './projectDashboard'
export * from './teamDashboard'
