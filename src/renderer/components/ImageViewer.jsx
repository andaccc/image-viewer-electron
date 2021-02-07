import React from "react";
import Container from '@material-ui/core/Container';
import Box from '@material-ui/core/Box';
import ReactDOM from 'react-dom'

const { ipcRenderer } = require('electron')


//https://www.smashingmagazine.com/2018/01/drag-drop-file-uploader-vanilla-js/
//https://medium.com/@650egor/simple-drag-and-drop-file-upload-in-react-2cb409d88929

// image drag drop use native api instead !!!!
// https://www.electronjs.org/docs/tutorial/native-file-drag-drop

const defaultProps = {
  borderRadius: "borderRadius",
  bgcolor: '#424242',
  borderColor: 'grey.500',
  m: 5,
  p: 5,
  border: 1,
  display: "flex",
  justifyContent: "center"
};

function preventDefaults(e) {
  e.preventDefaults();
  e.stopPropagation();
}

function handleDropImage(e) {
  console.log(e)
  let reader = new FileReader()
  reader.readAsDataURL(e.dataTransfer.files)
  reader.onloadend = () => {
    let img = document.createElement('img');
    img.src = reader.result;
    this.viewZone.appendChild(img)
  }
}

export default class ImageViewer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

    }

    this.dropRef = React.createRef();
  }



  componentDidMount() {
    document.ondragover = function(e) {
      // need this for drop file to work
      e.preventDefault(); 
    };
    

    this.dropRef.current.addEventListener('drop', (events) => {
      console.log('dropped');

      //handleDropImage(events);
    });
  }

  render() {
    return (
      <Container>
        <Box ref={this.dropRef} id="dropZone" {...defaultProps} >
          Drag to here
        </Box>
        <div ref={this.viewZone}>
        </div>
      </Container>
    );
  }


}