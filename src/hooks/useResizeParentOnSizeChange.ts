import {useEffect} from "react";
import {resizeParent} from "../service";
// eslint-disable-next-line import/named
import {NodeProps} from "reactflow";
import {IMicroLoopNodeData} from "../interface";
import {diagramEditorActions, useAppDispatch, useDiagramEditorState} from "../redux";

export const useResizeParentOnSizeChange = (params: NodeProps<IMicroLoopNodeData>) => {
    const dispatch = useAppDispatch()
    const {diagramNodes} = useDiagramEditorState()

    const updateNodeSize = (params: {
        nodeId: string,
        size: { width: number, height: number }
    }) => {
        dispatch(diagramEditorActions.updateNodeSize(params))
    }

    useEffect(() => {
        const node = diagramNodes.find(node => node.id === params.id)
        if (node?.parentNode) {
            console.log('useResizeParentOnSizeChange', node)
            resizeParent({
                node,
                addHeight: 200,
                addWidth: 200,
                diagramNodes,
                updateNodeSize
            })
        }
    }, [params.data.style.width, params.data.style.height]);
}
