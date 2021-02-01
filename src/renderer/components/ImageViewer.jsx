import React from "react";
import Container from '@material-ui/core/Container';
import Box from '@material-ui/core/Box';


//https://www.smashingmagazine.com/2018/01/drag-drop-file-uploader-vanilla-js/


const defaultProps = {
  bgcolor: '#424242',
  borderColor: 'grey.500',
  m: 5,
  p: 5,
  border: 1,
  display: "flex",
  justifyContent: "center"
};

export default class ImageViewer extends React.Component {
  constructor() {
    super();
    this.state = {

    }
  }

  render() {
    return (
      <Container>
        <Box borderRadius="borderRadius" {...defaultProps} >
          Drag to here
        </Box>
      </Container>
    );
  }


}