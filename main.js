const electron = require('electron');
const url = require('url');
const path = require('path');

const {app, BrowserWindow, Menu} = electron;

let mainWindow;
let addWindow;

//Listen for the app to be ready
app.on('ready', function(){
    const screenElectron = electron.screen;
    const display = screenElectron.getPrimaryDisplay();
    const dimensions = display.workAreaSize;
    //Create New Window
    mainWindow = new BrowserWindow({
        width: parseInt(1200),
        height: parseInt(720),
        minWidth: parseInt(800),
        minHeight: parseInt(490),
        //maxWidth: dimensions.width,
        //maxHeight: dimensions.height
    });
    //Load HTML into Window
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'userMode.html'),
        protocol: 'file:',
        slashes: true
    }));

    //Quit App when Closed
    mainWindow.on('close', function(){
        app.quit();
    });

    //Build menu from Template
    const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
    //Insert Menu
    Menu.setApplicationMenu(mainMenu);
});

//handle createAddWindow
function createAddWindow(){

    const screenElectron = electron.screen;
    const display = screenElectron.getPrimaryDisplay();
    const dimensions = display.workAreaSize;
    //Create New Window
    mainWindow = new BrowserWindow({
        width: parseInt(dimensions.width * 0.6),
        height: parseInt(dimensions.height * 0.8),
        minWidth: parseInt(dimensions.width * 0.6),
        minHeight: parseInt(dimensions.height * 0.8),
        //maxWidth: dimensions.width,
        //maxHeight: dimensions.height,
        title: 'New Voter Account'
    });
    //Load HTML into Window
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'newVoterWindow.html'),
        protocol: 'file:',
        slashes: true
    }));

    //Garbage Collection
    //addWindow.on('closed', function(){
    //    addWindow = null;
    //});
}

//Create Menu Template
const mainMenuTemplate = [
    {
        label: 'File',
        submenu: [
            {
                label: 'New Voter Account',
                click(){
                    createAddWindow();
                }
            },
            {
                label: 'Check Vote Account'
            },
            {
                label: 'Quit',
                accelerator: process.platform == 'darwin' ? 'Command+Q' : 'Ctrl+Q',
                click(){
                    app.quit();
                }
            }
        ]
    }
];

//If on MAC, Add empty Menu Item at the begining
if(process.platform == 'darwin'){
    mainMenuTemplate.unshift({});
}

//Add dev tols menu item if not in production
if(process.env.NODE_ENV != 'production'){
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