const express = require('express');
const app = express();

const port = 3302;

function runServerCallback() {
    console.log(`Сервер запущен и доступен по адресу: http://localhost:${port}`);
}

function onGetMainPage(request, response) {
    response.sendFile(__dirname + '/user-page/index.html');
}

function onGetAdminPage(request, response) {
    response.sendFile(__dirname + '/admin-panel/adm-index.html');
}


app.use(express.static('user-page'));
app.use(express.static('admin-panel'));
app.use(express.static('img'));
app.use(express.static('service'));

app.get('/', onGetMainPage);
app.get('/adm', onGetAdminPage);

app.listen(port, runServerCallback);