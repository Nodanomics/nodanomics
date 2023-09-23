import React, {useMemo} from "react";
import {Box} from "@mui/material";
import ReactApexChart from "react-apexcharts";
import {ApexOptions} from "apexcharts";
import {Parameter} from "../../../../base";
import {useWidthAndHeight} from "../../../../../hooks";
import {EColor} from "../../../../../constant";
import {useDiagramEditorState} from "../../../../../redux";


const options: ApexOptions = {
    xaxis: {
        labels: {
            show: false,
        },
    },
    yaxis: {
        show: false,
    },
    colors: [EColor.darkRed],
    legend: {
        show: true,
        position: 'top',
    },
    tooltip: {
        enabled: false
    },
    chart: {
        background: EColor.darkMarineLight,
        zoom: {
            enabled: false
        },
        parentHeightOffset: 0,
        toolbar: {
            show: false
        },
        redrawOnParentResize: true,
    },
    stroke: {
        show: true,
        lineCap: 'butt',
        colors: undefined,
        width: 2,
        dashArray: 0,
    },
    grid: {
        borderColor: EColor.black,
        padding: {
            top: -29,
            right: 1,
            bottom: -13,
            left: 1,
        },
        xaxis: {

            lines: {
                offsetX: 1,
                offsetY: 1,
                show: true
            }
        },
    }
}

export const VariableStatisticsParameter: React.FC<{
    resourcesCountHistory?: number[],
}> = ({resourcesCountHistory = []}) => {
    const {currentRunningDiagramStep} = useDiagramEditorState()
    const {series} = useMemo(() => {
        const arrayWithZero = Array.from({length: currentRunningDiagramStep - resourcesCountHistory.length}, () => 0)
        const formattedHistory = [...arrayWithZero, ...resourcesCountHistory]
        const chartData = [{
            name: 'Resources',
            data: formattedHistory || [],
        }]
        const isShowChart = formattedHistory.length > 0
        return {
            series: chartData,
            isShowChart,
        }
    }, [resourcesCountHistory])

    const {elementRef, elementSize} = useWidthAndHeight()

    const avg = resourcesCountHistory && resourcesCountHistory.reduce((acc, b) => acc + b, 0) / resourcesCountHistory.length

    const min = resourcesCountHistory && Math.min(...resourcesCountHistory)
    const max = resourcesCountHistory && Math.max(...resourcesCountHistory)

    const avgFormatted = avg && avg?.toFixed(2)
    const maxFormatted = max && max?.toFixed(2)
    const minFormatted = min && min?.toFixed(2)

    return (
        <Box>
            <Box
                sx={{
                    width: '100%',
                    height: 120,
                    overflow: 'hidden',
                    borderColor: EColor.black,
                    borderWidth: 1,
                    borderStyle: 'solid',
                    boxSizing: 'border-box',
                }}
                ref={elementRef}
            >
                <ReactApexChart
                    width={elementSize.width}
                    height={elementSize.height}
                    options={options}
                    series={series}
                    type="line"
                />
            </Box>
            <Box sx={{
                paddingTop: 1,
                display: 'flex',
                flexDirection: 'column'
            }}>
                <Parameter.Text>
                    Max. Val.
                    <Parameter.Text sx={{
                        color: EColor.white,
                        display: 'inline-block',
                    }}>
                        {maxFormatted}
                    </Parameter.Text>
                </Parameter.Text>
                <Parameter.Text>
                    Avg. Val.
                    <Parameter.Text sx={{
                        color: EColor.white,
                        display: 'inline-block',
                    }}>
                        {avgFormatted}
                    </Parameter.Text>
                </Parameter.Text>
                <Parameter.Text>
                    Min. Val.
                    <Parameter.Text sx={{
                        color: EColor.white,
                        display: 'inline-block',
                    }}>
                        {minFormatted}
                    </Parameter.Text>
                </Parameter.Text>
            </Box>

        </Box>
    )
}
