import {diagramEditorActions, useAppDispatch, useDiagramEditorState} from "../redux";
import {ICopiedElements} from "../interface";
import {geAllChildrenNodes, prepareCopiedNodesToPaste,} from "../service";
import {useCallback} from "react";
import {useReactFlowInstance} from "./useReactFlowInstance";
// eslint-disable-next-line import/named
import {useMousePosition} from "./useMousePosition";
import {useSetParentNode} from "./useSetParentNode";
import {useOffHistoryExecuted} from "./useOffHistoryExecuted";


export const useCopyPaste = () => {
    const {reactFlowWrapper, reactFlowInstance} = useReactFlowInstance().data
    const {diagramNodes, diagramEdges} = useDiagramEditorState()
    const dispatch = useAppDispatch()
    const {addManyNodes, addManyEdges} = diagramEditorActions
    const mousePosition = useMousePosition()
    const setParent = useSetParentNode()

    const offHistoryExecuted = useOffHistoryExecuted()

    const copy = useCallback(() => {
        const selectedNodes = diagramNodes.filter(node => node.selected)
        const children = selectedNodes.map(node => geAllChildrenNodes({nodes: diagramNodes, parentId: node.id})).flat()
        const selectedWithoutChildren = selectedNodes.filter(node => !children.some(child => child.id === node.id))
        const allNodes = [...selectedWithoutChildren, ...children]
        const edgesToCopy = diagramEdges.filter(edge => allNodes.some(node => node.id === edge.source || node.id === edge.target))
        const elementsToCopy = {
            nodes: allNodes,
            edges: edgesToCopy,
        }
        const selectedText = window.getSelection()?.toString().trim();

        if (elementsToCopy.nodes.length > 0 && !selectedText) {
            navigator.clipboard.writeText(JSON.stringify(elementsToCopy));
        }
    }, [diagramNodes])

    const paste = useCallback(async () => {
        const text = await navigator.clipboard.readText();
        const elements = JSON.parse(text) as ICopiedElements
        if (reactFlowInstance && reactFlowWrapper && reactFlowWrapper.current !== null) {
            const {nodes, edges} = elements
            const preparedToPaste = prepareCopiedNodesToPaste({
                elements: {nodes, edges},
                reactFlowInstance,
                reactFlowWrapper: reactFlowWrapper.current,
                mousePosition,
            })

            const topNodes = preparedToPaste.nodes.filter(node => node.parentNode === undefined)
            topNodes.forEach(candidateToBeChild => {
                setParent(candidateToBeChild, diagramNodes)
            })

            offHistoryExecuted('paste')

            dispatch(addManyNodes(preparedToPaste.nodes))
            dispatch(addManyEdges(preparedToPaste.edges))
        }
    }, [diagramNodes, dispatch, mousePosition, reactFlowInstance, reactFlowWrapper, setParent])

    return {copy, paste};
}