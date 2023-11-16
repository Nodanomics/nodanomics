import {useEffect, useMemo, useRef, useState} from "react";
import {useGetProjectsQuery, useSessionUserDataQuery} from "../api";
import {useScrollToBottom} from "./usePageBottom";
import {IBaseProject} from "../interface";
import {projectDashboardAction, useAppDispatch, useProjectDashboardState} from "../redux";

export const useGetInfinityProjects = () => {
    const dispatch = useAppDispatch()
    const scrollRef = useRef<HTMLDivElement>(null);
    const [cursorId, setCursorId] = useState<string>();
    const prevProjectCursorId = useRef<string>();
    const {data: sessionUser} = useSessionUserDataQuery(undefined)
    const {deleteProjectIds} = useProjectDashboardState()
    const {data: resProjects, isLoading} = useGetProjectsQuery({
        userId: sessionUser?.id,
        cursorId: cursorId,
    }, {
        skip: !sessionUser?.id,
    })

    // filter deleted projects. Ofcourse we deleted them from the server, but we need to keep them in the cache
    const allProjects = useMemo(() => {
        return deleteProjectIds
            ? resProjects?.filter((project) => !deleteProjectIds.includes(project.id))
            : resProjects
    }, [resProjects, deleteProjectIds])

    const reachedBottom = useScrollToBottom(scrollRef)


    useEffect(() => {
        const lastProject = allProjects?.[allProjects.length - 1]
        if (reachedBottom && lastProject && lastProject.id !== prevProjectCursorId.current && !isLoading) {
            prevProjectCursorId.current = lastProject.id
            setCursorId(lastProject.id)
        }
    }, [reachedBottom])


    // get projects until fill the screen
    useEffect(() => {
        if (allProjects && !isLoading && reachedBottom) {
            const lastProject = allProjects?.[allProjects.length - 1]
            const lastProjectRef = scrollRef.current?.lastElementChild
            if (lastProjectRef && lastProject) {
                const lastProjectRefRect = lastProjectRef.getBoundingClientRect()
                if (lastProjectRefRect.y < window.innerHeight) {
                    prevProjectCursorId.current = lastProject.id
                    setCursorId(lastProject.id)
                }
            }

        }

    }, [allProjects, reachedBottom, isLoading])

    useEffect(() => {
        if (allProjects) {
            const sortedProjects: IBaseProject[] = allProjects.map((project) => ({
                name: project.name,
                id: project.id,
                createdBy: `${project.creator.firstName} ${project.creator.lastName}`,
                lastEditedBy: `${project.lastEditor.firstName} ${project.lastEditor.lastName}`,
                createdAt: project.createdAt,
                editedAt: project.updatedAt,
            }))
            dispatch(projectDashboardAction.setProjects({
                projects: sortedProjects
            }))
        }
    }, [allProjects])

    return {
        scrollRef,
    }
}
