import { Alert, Typography } from '@mui/material'
import { styled } from '@mui/material/styles';
import React from 'react'


const StyledAlert = styled(Alert)(({severity}) => {
        let style = {
            marginTop: "50px",
            ".MuiAlert-message": {
                margin: "auto",
            },
            "& .MuiSvgIcon-root": {
                fontSize: "33px"
            }
        };
        if ( severity === "info") {
            style = {
                ...style, 
                backgroundColor: "#ecf0f1",
                color: "#333",
                "& .MuiSvgIcon-root": {
                    ...style['& .MuiSvgIcon-root'],
                    color: "#333"
                },
            };
        }
        return style;
    }
)

const PreviousPrice = ({ price }) => {
    
  return (
    <span style={{ 
        textDecoration: "line-through",
        color: "red",
        margin: "0px 8px", 
        }}>
        {price}
    </span>
  )
}

export default PreviousPrice;