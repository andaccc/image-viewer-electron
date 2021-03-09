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

/**
 * TODO: image use react state
 */

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

// pixel
const WIDTH_LIMIT = 500; 
const HEIGHT_LIMIT = 500;

export default class ImageViewer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      imgIndex: 0 
    }

    this.handleDropImage = this.handleDropImage.bind(this);
    this.handleZoom = this.handleZoom.bind(this);
    this.greyScaleImage = this.greyScaleImage.bind(this);

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
          let img = document.createElement('img')
          img.src = reader.result

          img.id = this.state.imgIndex
          this.state.imgIndex++

          this.viewRef.current.appendChild(img)

          img.onload = function() {
            // limit image size
            if (img.width > WIDTH_LIMIT) {
              img.height *= WIDTH_LIMIT / img.width
              img.width = WIDTH_LIMIT;
            }
            else if (img.height > HEIGHT_LIMIT) {
              img.width *= HEIGHT_LIMIT / img.height 
              img.height = HEIGHT_LIMIT;
            }
          };

          img.classList.add("img-zoomable");

          attachDrag(img);
        }
      }
    });
  }

  /**
   * grey scale image
   * for now just use css
   * - seem css method value becomes darker...
   * @param {*} imgId 
   */
  greyScaleImage = (imgId) => {
    // by css
    var img = document.getElementById(imgId);
    if (img.classList.contains("img-greyscale")) {
      img.classList.remove("img-greyscale")
    }
    else {
      img.classList.add("img-greyscale")
    }
  
  }

  /**
   * zoom resize
   *  - need to add scale limit
   * @param {*} e 
   */
  handleZoom = (e) => {
    e.preventDefault();
    var scale = e.deltaY * -0.001 + 1;

    var items = document.getElementsByClassName("img-zoomable");
    for (var i = 0; i < items.length; i++) {

      // if no round up, when value < 10, it cant scale up
      items[i].height = Math.round(items[i].height * scale);
      items[i].width = Math.round(items[i].width * scale);
      console.log(items[i].width)
    }

  }

  componentDidMount() {
    const that = this

    document.ondragover = function(e) {
      // need this for drop file to work
      e.preventDefault() 
    };
    
    // attach drag drop
    this.dropRef.current.addEventListener('drop', (events) => {

      this.handleDropImage(events);

      // no need to send to backend
      //ipcRenderer.send('ondropfile', events.dataTransfer.files);
    });

    // attach mousewheel
    this.dropRef.current.addEventListener('wheel', (evt) => {
      this.handleZoom(evt);
    })


    // context menu
    // separate it ?
    // https://www.electronjs.org/docs/api/menu
    window.addEventListener('contextmenu', (e) => {
      e.preventDefault();

      var isImg = (e.target.tagName == 'IMG')
      
      var imgId = isImg? e.target.id : null
      
      ipcRenderer.send('show-context-menu', [e.target.tagName, imgId])
    })

    ipcRenderer.on('context-menu-command', (e, command) => {
      if (command[0] === 'greyscale') {
        that.greyScaleImage(command[1])
      }
    })
  }

  render() {
    return (
      <Container ref={this.dropRef} id="main" 
      >
        {/*
        <Box ref={this.dropRef} id="dropZone" {...defaultProps} >
        </Box>
        */}
        <div ref={this.viewRef}>
        </div>
      </Container>
    );
  }
}