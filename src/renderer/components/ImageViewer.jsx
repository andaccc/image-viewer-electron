import React from "react";
import Container from '@material-ui/core/Container';
import Box from '@material-ui/core/Box';
import ReactDOM from 'react-dom'

import './../style.css';

import { attachDrag } from './../tools/dragHandler'

// TODO: just import 
import * as d3 from "d3"; 

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

// https://phg1024.github.io/image/processing/2014/02/26/ImageProcJS4.html
function grayscaleFilter(imgData) {
    // each 4 places [0][1][2][3] = [r][g][b][a]
    var arr_r = imgData.filter( (data, index) => ((index + 4) % 4) === 0)
    var arr_g = imgData.filter( (data, index) => ((index + 3) % 4) === 0)
    var arr_b = imgData.filter( (data, index) => ((index + 2) % 4) === 0)
    var arr_a = imgData.filter( (data, index) => ((index + 1) % 4) === 0)

  // single brightness channel
  var l = arr_r.map( (data, index) => {
    Math.round(arr_r[index] * 0.299 + arr_g[index] * 0.587 + arr_b[index] * 0.114)
  })

    return l
}

export default class ImageViewer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      imgIndex: 0 
    }

    this.handleDropImage = this.handleDropImage.bind(this)
    this.handleZoom = this.handleZoom.bind(this)
    this.greyScaleImage = this.greyScaleImage.bind(this)
    this.triggerValueAnalyzer = this.triggerValueAnalyzer.bind(this)


    this.dropRef = React.createRef()
    this.viewRef = React.createRef()
    this.analyzerRef = React.createRef()
    this.histRef = React.createRef()
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

          // zoom single image
          img.addEventListener('wheel', (evt) => {
            evt.preventDefault();
            var scale = evt.deltaY * -0.001 + 1;
            img.height = Math.round(img.height * scale);
            img.width = Math.round(img.width * scale);
          })

          attachDrag(img);
        }
      }
    });
  }

  /**
   * grey scale image
   * for now just use css
   * - seem css method value becomes darker...
   * 
   * TODO: use this
   * https://phg1024.github.io/image/processing/2014/02/26/ImageProcJS4.html
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
   * Trigger the value analyzer  
   *  1. Histogram
   *  2. Simplify value image
   * @param {*} imgId target image id
   */
  triggerValueAnalyzer = (imgId) => {
    var img = document.getElementById(imgId)

    if (img.classList.contains("img-greyscale")) {
      img.classList.remove("img-greyscale")
    }

    var tmp = img.cloneNode(true)
    
    // how to convert to rgba?
    var ctx = this.analyzerRef.current.getContext('2d'); 

    // TODO: resize canvas
    // - fixed size css?
    // but how to handle different ratio
    ctx.canvas.width  = tmp.width;
    ctx.canvas.height = tmp.height;

    ctx.drawImage(tmp, 0, 0);

    var imgData = ctx.getImageData(0, 0, tmp.width, tmp.height).data;

    var grayData = grayscaleFilter(imgData)
    
    // TODO: draw hist
    // https://www.d3-graph-gallery.com/graph/histogram_basic.html
    var hist = [] 
    grayData.forEach( (data) => {
      let val = Math.floor(data / 255)
      hist.push(val)
    })


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
      
      //console.log(items[i].width)
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
    // resize whole region
    /*
    this.dropRef.current.addEventListener('wheel', (evt) => {
      this.handleZoom(evt);
    })
    */

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
      else if (command[0] === 'value_analyzer') {
        that.triggerValueAnalyzer(command[1])
      }
    })
  }

  render() {
    return (
      <Container ref={this.dropRef} id="main" >
        <div ref={this.viewRef}>
        </div>
        <canvas ref={this.analyzerRef} id="analyzer_canvas">
        </canvas>
        <canvas ref={this.histRef} id="hist_canvas">
        </canvas>
      </Container>
    );
  }
}