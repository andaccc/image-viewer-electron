import React from "react";
import Container from '@material-ui/core/Container';
import Box from '@material-ui/core/Box';
import ReactDOM from 'react-dom'

import './../style.css';

import { attachDrag } from './../tools/dragHandler'

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

export default class ImageViewer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

    }

    this.handleDropImage = this.handleDropImage.bind(this);

    this.dropRef = React.createRef();
    this.viewRef = React.createRef();
  }

  handleDropImage = (e) => {
    let reader = new FileReader()
    console.log(e.dataTransfer)

    let files = e.dataTransfer.files;

    Array.from(files).forEach( (file) => {
      if ( /\.(jpe?g|png|gif)$/i.test(file.name) ) {
        // for image only
        reader.readAsDataURL(e.dataTransfer.files[0])
        reader.onloadend = () => {
          let img = document.createElement('img');
          img.src = reader.result;

          this.viewRef.current.appendChild(img)
          
          attachDrag(img)
        }
      }
    });

  }

  componentDidMount() {
    document.ondragover = function(e) {
      // need this for drop file to work
      e.preventDefault(); 
    };
    

    this.dropRef.current.addEventListener('drop', (events) => {
      console.log('dropped');


      this.handleDropImage(events);

      // no need to send to backend
      //ipcRenderer.send('ondropfile', events.dataTransfer.files);
    });
  }

  render() {
    return (
      <Container ref={this.dropRef} id="main" 
      >
        {/*
        <Box ref={this.dropRef} id="dropZone" {...defaultProps} >
        </Box>
        */}
        <div>
          <div ref={this.viewRef}>
          </div>
        </div>
      </Container>
    );
  }


}