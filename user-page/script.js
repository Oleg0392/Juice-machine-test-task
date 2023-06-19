//const { redirect } = require("express/lib/response");

const INSUFFUCUENT = 9;
const NULLBALANCE = 7;
const SUCCESSFULL = 5;
const ERRORTRANSN = 3;
const CHANGERECVD = 2;
const DELSTATUSMSG = 0;
const GETJUICEINFO = 6;
const NULLJUICES = 1;
const GRID_SIZE = 4;
const JUICE_COUNT = 8;

class Juice {
    constructor(juiceid, title, price, rest, imgurl){
        this.juiceId = juiceid;
        this.title = title;
        this.price = price;
        this.rest = rest;
        this.imgUrl = imgurl;
    }

    decRest(){
        if (this.rest > 0) this.rest -= 1;
    }
}

class JuiceGridCell {
    constructor(juiceId,GridElement){
        var juice = juices[juiceId];

        this.juiceCell = document.createElement("div");
        if (juice.rest == 0) {
            this.juiceCell.classList.add("bcell");
        }
        else {
            this.juiceCell.classList.add("cell");
        }
        

        this.juiceImg = document.createElement("img");
        this.juiceImg.setAttribute("src",juice.imgUrl.toString());
        this.juiceImg.setAttribute("onclick",`getJuiceInfo(${juice.juiceId.toString()})`);
        this.juiceImg.classList.add("image");
        this.juiceCell.append(this.juiceImg);

        this.juiceTitle = document.createElement("p");
        this.juiceTitle.textContent = `Коктейль \"${juice.title}\"`;
        this.juiceCell.append(this.juiceTitle);

        this.juiceBuyButton = document.createElement("button");
        this.juiceBuyButton.classList.add("buybutton");
        this.juiceBuyButton.setAttribute("onclick", `buyJuice(${juice.juiceId.toString()})`);
        this.juiceBuyButton.textContent = "Купить";
        this.juiceCell.append(this.juiceBuyButton);

        this.juicePriceCount = undefined;
        this.updateJuicePriceCount(juiceId);

        GridElement.append(this.juiceCell);
    }

    updateJuicePriceCount(juiceId) {
        if (this.juicePriceCount != undefined) {
            this.juicePriceCount.remove();
        }       
        this.juicePriceCount = document.createElement("p");
        this.juicePriceCount.classList.add("price");
        this.juicePriceCount.textContent = `Цена: ${juices[juiceId].price.toFixed(2)}, Ост: ${juices[juiceId].rest.toString()}`;
        this.juiceCell.append(this.juicePriceCount);
    }

    blockingJuiceCell() {
        this.juiceCell.classList.remove("cell");
        this.juiceCell.classList.add("bcell");
        this.juiceImg.classList.remove("image");
        this.juiceImg.classList.add("blocked");
        this.juiceBuyButton.classList.remove("buybutton");
        this.juiceBuyButton.classList.add("blockedbtn");
        this.juiceBuyButton.disabled = true;
    }
}

class JuiceGrid {
    constructor(){
        this.juiceGridCells = [];      
    }

    initJuiceGrid(GridElement) {
        for (let i = 0; i < juices.length; i++) {
            this.juiceGridCells.push(new JuiceGridCell(i,GridElement));            
        }
    }
}

class Coin {
    constructor(id, nominal, blocked) {
        this.coinId = id;
        this.nominal = nominal;
        this.blocked = blocked;
    }
}

class CoinListItem {
    constructor(coinId, divElement) {
        this.CoinButton = document.createElement("div");
        if (coins[coinId].blocked) {
            this.CoinButton.className = "bcoin";
        }
        else {
            this.CoinButton.className = "coin";
            this.CoinButton.setAttribute("onclick",`insertCoins(${coins[coinId].nominal})`);
        }      
        this.CoinButton.textContent = coins[coinId].nominal.toString();
        divElement.append(this.CoinButton);
    }
}

class CoinList {
    constructor(){
        this.coinList = [];
    }

    initCoinList(divElement){
        for (let i = 0; i < coins.length; i++) {
            this.coinList.push(new CoinListItem(i, divElement));
        }
    }
}

class Kassa {
    constructor() {
        this.balance = 0.00;
        this.display = document.getElementById("psum");
        this.status = document.getElementById("paystatus");
        this.selectedJuice = undefined;
        getAutomatData("juices", onJuiceDataRecieved);
        getAutomatData("coins", onCoinDataRecieved);   
    }

    addCoins(coins) {
        this.balance += coins;
    }

    dimCoins(coins) {
        this.balance -= coins;
    }

    showBalance() {
        this.display.textContent = this.balance.toFixed(2);
    }

    showStatus(statusCode) {
        let statusText = "";
        let colorName = "forestgreen";

        switch(statusCode) {
            case INSUFFUCUENT: statusText = "Недостаточно средств";
                               colorName = "red";
                               break;
            case SUCCESSFULL: statusText = "Успешно";
                              colorName = "forestgreen";
                              break;
            case ERRORTRANSN: statusText = "Неизвестная ошибка";
                              colorName = "red";
                              break;
            case NULLBALANCE: statusText = "Вы не вносили средств";
                              colorName = "red";
                              break;
            case CHANGERECVD: statusText = "Выдана сдача: " + this.balance.toFixed(2);
                              colorName = "forestgreen";
                              break;
            case GETJUICEINFO: statusText = this.selectedJuice.title + ", осталось: " + this.selectedJuice.rest;
                               colorName = "yellow";
                               break;
            case NULLJUICES:  statusText = "Данный коктейль закончился.";
                              colorName = "red";
                              break;
                     default: break;
        }
        this.status.textContent = statusText;
        this.status.style.setProperty("color",colorName);
    }

    setSelectedJuice(juice) {
        this.selectedJuice = juice
    }
}

const juices = [];
const coins = [];
const juiceGrid = new JuiceGrid();
const coinList = new CoinList();

const kassa = new Kassa();

function onJuiceDataRecieved(data) {

    console.log(data);
    var recieved = JSON.parse(JSON.stringify(data));
    recieved.forEach(element => {
        juices.push(element);
    });

    juiceGrid.initJuiceGrid(document.getElementById("juices-grid"));
}

function onCoinDataRecieved(data) {

    console.log(data);
    var recieved = JSON.parse(JSON.stringify(data));
    recieved.forEach(element => {
        coins.push(element);
    });

    coinList.initCoinList(document.getElementById("coins"));
}

function insertCoins(coinCount) {
    kassa.addCoins(coinCount);
    kassa.showBalance();
}

function buyJuice(id) {
    if (juices[id].price > kassa.balance)
    {
        kassa.showStatus(INSUFFUCUENT);
        return;
    }
    if (juices[id].rest == 0) {
        kassa.showStatus(NULLJUICES);
        return;
    }
    kassa.dimCoins(juices[id].price);
    kassa.showBalance();
    kassa.showStatus(SUCCESSFULL);
    juices[id].rest -= 1;
    
    juiceGrid.juiceGridCells[id].updateJuicePriceCount(id);

    if (juices[id].rest == 0) {
        juiceGrid.juiceGridCells[id].blockingJuiceCell();
    }
    sendNewRest();
}

function getChange() {
    if (kassa.balance <= 0) {
        kassa.showStatus(NULLBALANCE);
        return;
    }
    kassa.showStatus(CHANGERECVD);
    kassa.balance = 0;
    kassa.showBalance();
}

function getJuiceInfo(Id) {
    kassa.setSelectedJuice(juices[Id]);
    kassa.showStatus(GETJUICEINFO);
}

function goAdminPanel() {
    var adminKey = prompt("Введите ключ доступа:","");
    if (adminKey == null) return;
    window.location.href = window.location.href + "adm?key=" + adminKey;
}

function sendNewRest() {    
    var sendData = JSON.stringify(juices);
    console.log(sendData);
    fetchAutomatData(sendData, "juices", onJuiceDataSended);    
}

function onJuiceDataSended() {
    console.log("juices updated");
}

