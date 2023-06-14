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
    constructor(id, title, price, rest, imgurl){
        this.id = id;
        this.title = title;
        this.price = price;
        this.rest = rest;
        this.imgUrl = imgurl;
    }
}

class JuiceGridCell {
    constructor(juiceId,GridElement){
        var juice = juices[juiceId];

        this.juiceCell = document.createElement("div");
        this.juiceCell.classList.add("cell");

        this.juiceImg = document.createElement("img");
        this.juiceImg.setAttribute("src",juice.imgUrl.toString());
        this.juiceImg.setAttribute("onclick",`getJuiceInfo(${juice.id.toString()})`);
        this.juiceImg.classList.add("image");
        this.juiceCell.append(this.juiceImg);

        this.juiceTitle = document.createElement("p");
        this.juiceTitle.textContent = `Коктейль \"${juice.title}\"`;
        this.juiceCell.append(this.juiceTitle);

        this.juiceBuyButton = document.createElement("button");
        this.juiceBuyButton.classList.add("buybutton");
        this.juiceBuyButton.setAttribute("onclick", `buyJuice(${juice.id.toString()})`);
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
    constructor(GridElement){
        this.juiceGridCells = [];
        for (let i = 0; i < juices.length; i++) {
            this.juiceGridCells.push(new JuiceGridCell(i,GridElement));            
        }
    }
}

class Coin {
    constructor(id, nominal, blocked) {
        this.id = id;
        this.nominal = nominal;
        this.blocked = blocked;
    }
}

class CoinListItem {
    constructor(coinId, divElement) {
        this.CoinButton = document.createElement("div");
        this.CoinButton.className = "coin";
        this.CoinButton.setAttribute("onclick",`insertCoins(${coins[coinId].nominal})`);
        this.CoinButton.textContent = coins[coinId].nominal.toString();
        divElement.append(this.CoinButton);
    }
}

class CoinList {
    constructor(divElement){
        this.coinList = [];
        for (let i = 0; i < coins.length; i++) {
            this.coinList.push(new CoinListItem(i, divElement));
        }
    }

    checkBlocking(coinId){
        if (coins[coinId].blocked) {
            this.coinList[coinId].CoinButton.className = "bcoin";
        }
        else this.coinList[coinId].CoinButton.className = "coin";
    }
}

class Kassa {
    constructor() {
        this.balance = 0.00;
        this.display = document.getElementById("psum");
        this.status = document.getElementById("paystatus");
        this.selectedJuice = undefined;
        getAutomatData("juices", onDataRecieved);   
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

let juices = undefined;
let juiceGrid = undefined;
const kassa = new Kassa();

const coins = [];
coins.push(new Coin(0,10,false));
coins.push(new Coin(1,5,false));
coins.push(new Coin(2,2,false));
coins.push(new Coin(3,1,false));
const coinList = new CoinList(document.getElementById("coins"));

function onDataRecieved(data) {

    console.log(data);
    juices = JSON.parse(JSON.stringify(data));

    juiceGrid = new JuiceGrid(document.getElementById("juices-grid"));
}

function insertCoins(coinCount) {
    kassa.addCoins(coinCount);
    kassa.showBalance();
    //kassa.showStatus(DELSTATUSMSG);
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
    getUserData("OLEG0392",onDataRecieved);
}

