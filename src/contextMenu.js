const { ipcMain } = require('electron')
const { Menu } = require('electron')

class ContextMenu {
  constructor(BrowserWindow) {
    var self = this
    self.window = BrowserWindow

    ipcMain.on('show-context-menu', (evt, req) => {
      self.contextMenu(evt, req) 
    })
  }
}

/**
 * Core context menu communication logic
 * - any better protocol?
 * - jsonify object ?
 * @param {*} evt 
 * @param {*} req 
 */
ContextMenu.prototype.contextMenu = function(evt, req) {
  console.log(req)
  var isImg = (req[0] == 'IMG')

  // refractor
  const template = []

  // img specific items
  if (isImg) {
    template.push({
      label: 'Convert Greyscale',
      click: () => { 
        evt.sender.send('context-menu-command', ['greyscale', req[1]])
      }
    })
  } 
    /*
    //{ type: 'separator' },
    { 
      label: 'Menu Item 2',
      type: 'checkbox', 
      checked: true 
    }
    */


  const menu = Menu.buildFromTemplate(template)
  menu.popup(this.window.fromWebContents(evt.sender))
}


module.exports = ContextMenu;