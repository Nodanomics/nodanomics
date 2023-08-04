import {GraphBaseEdge, GraphLogicEdge} from "../../GraphEdge";
import {INumberVariable, isIGetNodeExternalValue} from "../../../../interface";
import {GraphLoopNode} from "../abstracts";

export class GraphLogicManager {
    private readonly incomingEdges: GraphBaseEdge[]

    constructor(incomingEdges: GraphBaseEdge[]) {
        this.incomingEdges = incomingEdges
    }

    getVariables(): INumberVariable[] {
        const variables: INumberVariable[] = []
        this.getIncomingLogicEdge.forEach((edge) => {
            const source = edge.source
            if (isIGetNodeExternalValue(source)) {
                variables.push({
                    variableName: edge.variableName || 'unknown',
                    value: source.nodeExternalValue,
                })
            } else if (source instanceof GraphLoopNode) {
                const variableNames = edge.variableName?.trim().split(',')
                const values = variableNames?.map((variableName) => {
                    const value = source.incomingData?.variables?.find((variable) => {
                        return variable.variableName === variableName
                    })?.value
                    return {
                        variableName: variableName,
                        value: value,
                    }
                }).filter((variable) => variable !== undefined)

                if(values) {
                    variables.push(...values)
                }
            }
        })
        return variables
    }


    private get getIncomingLogicEdge(): GraphLogicEdge[] {
        return this.incomingEdges.filter((edge) => {
            if (edge instanceof GraphLogicEdge) {
                return edge
            }
        }) as GraphLogicEdge[]
    }
}
