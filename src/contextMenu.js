const { ipcMain } = require('electron')

class ContextMenu {
  constructor() {
    ipcMain.on('show-context-menu', (evt) => {
      console.log('menu show')

    })
  }
}

_contextMenu = function(evt) {
  console.log('menu show')

}


module.exports = ContextMenu;