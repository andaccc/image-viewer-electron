const { ipcMain } = require('electron')
const { Menu } = require('electron')

class ContextMenu {
  constructor(BrowserWindow) {
    var self = this
    self.window = BrowserWindow

    ipcMain.on('show-context-menu', (evt) => {
      self.contextMenu(evt) 
    })
  }
}

ContextMenu.prototype.contextMenu = function(evt) {
  console.log('menu show')
  const template = [
    {
      label: 'Menu Item 1',
      click: () => { evt.sender.send('context-menu-command', 'menu-item-1') }
    },
    { type: 'separator' },
    { label: 'Menu Item 2', type: 'checkbox', checked: true }
  ]
  const menu = Menu.buildFromTemplate(template)
  menu.popup(this.window.fromWebContents(evt.sender))
}


module.exports = ContextMenu;