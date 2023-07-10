// eslint-disable-next-line import/named
import {TypedUseSelectorHook, useDispatch, useSelector} from 'react-redux'
import {
    AppDispatch,
    IDiagramDashboardView,
    IDiagramDashboardViewsState,
    IDiagramEditorState,
    IProjectDashboardState, ITeamDashboardState,
    RootState
} from '../store'

export const useAppDispatch: () => AppDispatch = useDispatch
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector

export const useSelectedDashboardViewState = (dashboardViewId: string): IDiagramDashboardView | undefined => {
    const dashboardViews = useAppSelector(state => state.diagramDashboard.dashboardViews)
    return dashboardViews
        .find((dashboardView: IDiagramDashboardView) => dashboardView.dashboardViewId === dashboardViewId)
}

export const useDashboardViewsState = (): IDiagramDashboardViewsState => {
    return useAppSelector(state => state.diagramDashboard)
}

export const useDiagramEditorState = (): IDiagramEditorState => {
    return useAppSelector(state => state.diagramEditor)
}

export const useProjectDashboardState = (): IProjectDashboardState => {
    return useAppSelector(state => state.projectDashboard)
}

export const useTeamDashboardState = (): ITeamDashboardState => {
    return useAppSelector(state => state.teamDashboard)
}
