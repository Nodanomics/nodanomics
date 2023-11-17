import React from 'react';
import {Box, Typography} from "@mui/material";
import {EColor, EFontColor} from "../../../../constant";
import {
    EDiagramNode,
    EElementType,
    isINodeDatasetReader,
    isINodeDatasetRecorder,
    nodeSetupToolbarNames
} from "../../../../interface";
import {useCurrentEditElement} from "../../../../hooks";
import {CommentSection, NodeStatisticSection, PropertiesSection, RecordToDataset} from "./section";
import {StyleSection} from "./section/StyleSection";
import {NodeDeleteButton} from "./NodeDeleteButton";
import {ReadFromDataset} from "./section/ReadFromDataset";


export const ElementSetupToolbar = () => {
    const selectedElementData = useCurrentEditElement()?.data

    return (
        <Box
            sx={{
                display: 'flex',
                pointerEvents: 'auto',
                borderColor: EColor.lightMarine3,
                borderStyle: 'solid',
                borderRadius: 4,
                borderWidth: '1px',
                maxWidth: 320,
                height: '100%',
                boxSizing: 'border-box',
                overflowY: 'auto',
                overflowX: 'hidden',
                backgroundColor: EColor.darkMarine3,

            }}
        >
            <Box sx={{
                px: 2,
                py: 1,
            }}>
                {selectedElementData ?
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                            flex: 1,
                        }}
                    >
                        <Box sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 2,
                        }}>
                            <Typography sx={{
                                color: EFontColor.lightMarine4,
                            }}>
                                {nodeSetupToolbarNames[selectedElementData.type]}
                            </Typography>
                            <PropertiesSection selectedElementData={selectedElementData}/>

                            <StyleSection element={selectedElementData}/>
                            {selectedElementData?.elementType === EElementType.Node &&
                                <NodeStatisticSection nodeData={selectedElementData}/>}
                            {selectedElementData?.elementType === EElementType.Node
                                && isINodeDatasetRecorder(selectedElementData) &&
                                <RecordToDataset nodeData={selectedElementData}/>
                            }
                            {selectedElementData?.elementType === EElementType.Node
                                && isINodeDatasetReader(selectedElementData) &&
                                <ReadFromDataset nodeData={selectedElementData}/>
                            }
                            <CommentSection element={selectedElementData}/>

                        </Box>

                        {selectedElementData.elementType === EElementType.Node && <Box
                            sx={{
                                mt: 2,
                                display: 'flex',
                                justifyContent: 'flex-end',
                            }}
                        >
                            {selectedElementData.type !== EDiagramNode.Start &&
                                <NodeDeleteButton nodeId={selectedElementData.id}/>}
                        </Box>}
                    </Box>
                    : <Typography sx={{
                        color: EFontColor.lightMarine4,

                    }}>
                        Please select an element to edit
                    </Typography>
                }
            </Box>
        </Box>
    );
};
