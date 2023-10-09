import {IChainItem} from "./ChainItem";
import {RunManager} from "./RunManager";
import {yieldToMain} from "../../../utils";

export class NodeExecutionManager {
    executionCount = 0
    current: IChainItem[]
    next: IChainItem[]
    runManager: RunManager

    constructor(runManager: RunManager, starters: IChainItem[]) {
        this.runManager = runManager
        this.current = []
        this.next = [...starters]
    }

    async invokeNodesToExecute() {
        this.current = [...this.next]
        this.executionCount = this.next.length
        this.next = []

        for (const argument of this.current) {
            this.executionCount--
            await this.runManager.executeNode(argument, this, {invoke: true})
        }

        // this.runManager.addCountOfExecuted()
    }


    async invokeAll() {
        while (true) {
            this.current = [...this.next];
            this.executionCount = this.next.length;
            this.next = [];

            if (this.executionCount > 0) {
                for (const argument of this.current) {
                    this.executionCount--;
                    await this.runManager.executeNode(argument, this, {invoke: true});

                }
            }
            // Break the loop if executionCount is 0 and there are no next items to process.
            if (this.executionCount === 0 && this.next.length === 0) {
                break;
            }
        }

    }

    addNodesToExecute(chainItems: IChainItem[]) {
        this.next.push(...chainItems)
    }

    addNodesToCurrent(chainItem: IChainItem[]) {
        this.current.push(...chainItem)
        this.executionCount += chainItem.length

    }
}
