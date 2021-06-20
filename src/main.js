const { app, session, BrowserWindow } = require('electron');
const path = require('path')
const os = require('os')

const reactDevToolsPath = path.join(
  os.homedir(),
  '/AppData/Local/Google/Chrome/User Data/Default/Extensions/fmkadmapgofadopljbjfkapdkoienihi/4.10.1_0'
)

const ContextMenu = require('./contextMenu')

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    },
    backgroundColor: '#303030'
  });

  mainWindow.loadFile(`${__dirname}/public/index.html`);

  this.contextMenu = new ContextMenu(BrowserWindow)
}


// react debug tool
app.whenReady()
  .then(async () => {
    await session.defaultSession.loadExtension(
      reactDevToolsPath,
      { allowFileAccess: true }   
    )
  })
  .then(console.log('Loaded react-dev-tools'))
  .then(createWindow)
  .catch(console.log)


app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  } 
})
