const electron = require('electron');
const url= require('url');
const path = require('path');

const {app,BrowserWindow,Menu,ipcMain} = electron;
let mainWindow;
let addWindow;

// listen for app to be ready
app.on('ready', function(){
    // create new window
    mainWindow = new BrowserWindow({});
    // load html file into window
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'mainwindow.html'),
        protocol: 'file:',
        slashes: true
    }));
    mainWindow.on('closed', function(){
        app.quit();
    });
    const mainMenu=Menu.buildFromTemplate(mainMenuTemplate);
    // insert menu
    Menu.setApplicationMenu(mainMenu);
});

function createAddWindow(){
    // catch item :add

    ipcMain.on('item:add', function(e, item){
        console.log(item);
        mainWindow.webContents.send('item:add', item);
        addWindow.close();
    });
 // create new window
    addWindow = new BrowserWindow({
        width: 400,
        height: 300,
        title: 'Add Shopping List Item',
        webPreferences: {
            nodeIntegration: true
        }
    });
    // load html file into window
    addWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'addwindow.html'),
        protocol: 'file:',
        slashes: true
    }));
    // garbage collection handle
    addWindow.on('close', function(){
        addWindow = null;
    });
}

// create menu template
const mainMenuTemplate = [
    {
        label: 'File',
        submenu: [
            {
                label: 'Add Item',
                click(){
                createAddWindow();
                }
                
            },
            {
                label:"clear item",
            },
            {
                label: 'quit',
                accelerator: process.platform == 'darwin' ? 'Command+Q' : 'Ctrl+Q',
                click(){
                    app.quit();
                }
            }
            
             
        ]
        
    }
];

// if mac, add empty object to menu
if(process.platform == 'darwin'){
    mainMenuTemplate.unshift({});
}
// add developer tools item if not in production
if(process.env.NODE_ENV !== 'production'){
    mainMenuTemplate.push({
        label: 'Developer Tools',
        submenu: [
            {
                label: 'Toggle DevTools',
                accelerator: process.platform == 'darwin' ? 'Command+I' : 'Ctrl+I',
                click(item, focusedWindow){
                    focusedWindow.toggleDevTools();
                }
            },
            {
                role: 'reload'
            }
        ]
    });
}