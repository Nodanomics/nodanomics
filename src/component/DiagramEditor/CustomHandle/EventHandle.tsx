import React from 'react';
// eslint-disable-next-line import/named
import {Handle, HandleProps} from "reactflow";
import {EColor} from "../../../constant";
import {EConnection} from "../../../interface";

export const EventHandle: React.FC<Pick<HandleProps, 'isConnectable' | 'type' | 'position'> & {
    style?: React.CSSProperties
}> = ({
          isConnectable,
          type,
          style,
          position
      }) => {
    return (
        <Handle
            type={type}
            position={position}
            isConnectable={isConnectable}
            id={EConnection.EventConnection}
            style={{
                background: EColor.orange,
                width: '10px',
                height: '10px',
                ...style
            }}
        />
    );
};

