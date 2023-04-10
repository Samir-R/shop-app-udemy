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

const CustomAlert = ({ text, type = 'info', displayIcon = false}) => {
    
  return (
    <>
    {
        displayIcon ?
        <StyledAlert severity={type}>
            <Typography variant="h6" align='center'>
                {text}
            </Typography>
        </StyledAlert>
        :
        <StyledAlert icon={false} severity={type}>
            <Typography variant="h6" align='center'>
                {text}
            </Typography>
        </StyledAlert>
    }
    </>
  )
}

export default CustomAlert;