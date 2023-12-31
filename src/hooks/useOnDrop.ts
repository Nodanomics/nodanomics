import {DragEvent, useCallback} from "react";
import {createNodeOnDrag} from "../service";
// eslint-disable-next-line import/named
import {ReactFlowInstance} from "reactflow";
import {diagramEditorActions, useAppDispatch, useDiagramEditorState} from "../redux";
import {EDiagramNode} from "../interface";
import {useSetParentNode} from "./useSetParentNode";
import {useOffHistoryExecuted} from "./useOffHistoryExecuted";

export const useOnDrop = ({flowWrapper, flowInstance}: {
    flowWrapper?: HTMLDivElement
    flowInstance?: ReactFlowInstance
}) => {
    const dispatch = useAppDispatch()
    const {addNode} = diagramEditorActions
    const setParent = useSetParentNode()
    const offHistoryExecuted = useOffHistoryExecuted()
    const {layers} = useDiagramEditorState().settings


    return useCallback(
        (event: DragEvent<HTMLDivElement>) => {
            if (flowWrapper && flowInstance) {
                event.preventDefault();

                const type = event.dataTransfer.getData('application/reactflow') as EDiagramNode;

                // check if the dropped element is valid
                if (typeof type === 'undefined' || !Object.values(EDiagramNode).includes(type)) {
                    console.error(`Invalid element type: ${type}`)
                    return;
                }
                const selectedLayerId = layers?.find(layer => layer.isSelected)?.id
                if (selectedLayerId) {
                    const newNode = createNodeOnDrag({
                        layerId: selectedLayerId,
                        type,
                        flowInstance,
                        event,
                        wrapperNode: flowWrapper
                    })
                    if (newNode) {
                        offHistoryExecuted('onDrop')
                        dispatch(addNode(newNode))
                        setParent(newNode, flowInstance.getNodes())
                    }
                }

            }
        },
        [flowInstance, dispatch, layers]
    );
}
