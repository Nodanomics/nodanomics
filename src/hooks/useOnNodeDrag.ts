import {MouseEvent as ReactMouseEvent, useCallback} from "react";
import {IReactFlowNode, isINodeSize} from "../interface";
import {diagramEditorActions, useAppDispatch, useDiagramEditorState} from "../redux";
import {loopSize} from "../constant";
import {useGetFlatChildrenNodes} from "./useGetFlatChildrenNodes";
import {resizeParentOnDrag} from "../service";


export const useOnNodeDrag = () => {
    const dispatch = useAppDispatch()
    const {diagramNodes} = useDiagramEditorState()
    const getChildrenNodes = useGetFlatChildrenNodes()

    return useCallback((event: ReactMouseEvent, node: IReactFlowNode) => {
        const updateNodeSize = (params: {
            nodeId: string,
            size: { width: number, height: number }
        }) => {
            dispatch(diagramEditorActions.updateNodeSize(params))
        }
        resizeParentOnDrag({diagramNodes, node, event, updateNodeSize})
    }, [dispatch, diagramNodes])
}

// It is probably deprecated. I am faced with  problems splitting this code into smaller functions
// export const useDeprecatedOnNodeDrag = () => {
//     const dispatch = useAppDispatch()
//     const {diagramNodes} = useDiagramEditorState()
//     const getChildrenNodes = useGetFlatChildrenNodes()
//
//     return useCallback((event: ReactMouseEvent, node: IReactFlowNode) => {
//         const updateNodeSize = (params: {
//             nodeId: string,
//             size: { width: number, height: number }
//         })=>{
//             dispatch(diagramEditorActions.updateNodeSize(params))
//         }
//         // resizeParentOnDrag({diagramNodes, updateNodeSize, node, event})
//         if (!node.parentNode) return
//         const childrenNodes = getChildrenNodes({parentId: node.parentNode})
//
//
//         const parentNode = diagramNodes.find((diagramNode) => diagramNode.id === node.parentNode)
//         if (parentNode && isINodeSize(parentNode.data.style) && node.width && node.height) {
//             const parentSize = {
//                 width: parentNode.data.style.width,
//                 height: parentNode.data.style.height
//             }
//             const rightestChild = childrenNodes.reduce((prev, current) => {
//                 if (prev.width !== null && current.width !== null && prev.width && current.width) {
//                     return (prev.position.x + prev.width > current.position.x + current.width) ? prev : current
//                 }
//                 return current
//             }, node)
//
//             const mostBottomChild = childrenNodes.reduce((prev, current) => {
//                 const prevBottom = prev.position.y + (typeof prev.height === 'number' ? prev.height : 0)
//                 const currentBottom = current.position.y + (typeof current.height === 'number' ? current.height : 0)
//                 return prevBottom > currentBottom ? prev : current
//             }, node)
//
//             let updatedWidth: number | undefined
//             let updatedHeight: number | undefined
//
//             const isRightestChild = rightestChild?.id === node.id
//             const isMostBottomChild = mostBottomChild?.id === node.id
//
//             const preCalculatedWidth = parentNode.data.style.width + event.movementX
//             if (isRightestChild && preCalculatedWidth >= loopSize.minWidth && rightestChild.width) {
//                 const widthBetween = parentSize.width - rightestChild.position.x - rightestChild.width
//
//                 if (event.movementX < 0 && widthBetween > 20) {
//                     updatedWidth = preCalculatedWidth
//                 } else if (widthBetween < 40) {
//                     const additionalIncrease = widthBetween < 20 ? 10 : 0
//                     updatedWidth = preCalculatedWidth + additionalIncrease
//                 }
//
//             }
//
//             const preCalculatedHeight = parentNode.data.style.height + event.movementY
//             if (isMostBottomChild && preCalculatedHeight >= loopSize.minHeight && mostBottomChild.height) {
//                 const heightBetween = parentSize.height - mostBottomChild.position.y - mostBottomChild.height
//                 if (event.movementY < 0 && heightBetween > 20) {
//                     updatedHeight = preCalculatedHeight
//                 } else if (heightBetween < 40) {
//                     const additionalIncrease = heightBetween < 20 ? 10 : 0
//                     updatedHeight = preCalculatedHeight + additionalIncrease
//                 }
//             }
//
//             if (isRightestChild || isMostBottomChild) {
//                 dispatch(diagramEditorActions.updateNodeSize({
//                     nodeId: parentNode.id, size: {
//                         width: updatedWidth || parentSize.width,
//                         height: updatedHeight || parentSize.height
//                     }
//                 }))
//             }
//         }
//
//     }, [dispatch, diagramNodes])
// }
