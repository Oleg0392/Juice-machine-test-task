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

    dimRest(){
        if (this.rest == 0) {
            return NULLJUICES;
        }
        this.rest -= 1;
        return SUCCESSFULL;
    }
}

class JuiceGridCell {
    constructor(juiceId,GridElement){
        var juice = juices[juiceId];

        this.juiceCell = document.createElement("div");
        this.juiceCell.classList.add("cell");

        this.juiceImg = document.createElement("img");
        this.juiceImg.setAttribute("src",juice.imgUrl);
        this.juiceImg.setAttribute("onclick",`getJuiceInfo(${juice.id.toString()})`);
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
        var juice = juices[juiceId];
        if (this.juicePriceCount != undefined) {
            this.juicePriceCount.remove();
        }       
        this.juicePriceCount = document.createElement("p");
        this.juicePriceCount.classList.add("price");
        this.juicePriceCount.textContent = `Цена: ${juice.price.toFixed(2)}, Ост: ${juice.rest.toString()}`;
        this.juiceCell.append(this.juicePriceCount);
    }

    blockingJuiceCell() {
        this.juiceCell.classList.remove("cell");
        this.juiceCell.classList.add("bcell");
        this.juiceImg.classList.add("blocked");
        this.juiceBuyButton.classList.remove("buybutton");
        this.juiceBuyButton.classList.add("blockedbtn");
        this.juiceBuyButton.disabled = true;
    }
}

class JuiceGrid {
    constructor(GridElement){
        this.juiceGridCells = [];
        for (let i = 0; i < JUICE_COUNT; i++) {
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

const kassa = new Kassa();

const juices = [];
juices.push(new Juice(0, "Кленовый сауэр", 25, 15, "img/drink1.png"));
juices.push(new Juice(1, "Манхэттен", 15, 5, "img/drink2.png"));
juices.push(new Juice(2, "Карибское сокровище", 10, 10, "img/drink3.png"));
juices.push(new Juice(3, "Мохито", 30, 3, "img/drink4.png"));
juices.push(new Juice(4, "Кровавая Мэри", 20, 7, "img/drink5.png"));
juices.push(new Juice(5, "Японский урожай", 18, 9, "img/drink6.png"));
juices.push(new Juice(6, "Сказка", 35, 1, "img/drink7.png"));
juices.push(new Juice(7, "Пача Ибица", 40, 12, "img/drink8.png"));

const coins = [];
coins.push(new Coin(0,10,false));
coins.push(new Coin(1,5,false));
coins.push(new Coin(2,2,false));
coins.push(new Coin(3,1,false));

const juiceGrid = new JuiceGrid(document.getElementById("juices-grid"));
const coinList = new CoinList(document.getElementById("coins"));

function insertCoins(coinCount) {
    kassa.addCoins(coinCount);
    kassa.showBalance();
    //kassa.showStatus(DELSTATUSMSG);
}

function buyJuice(id) {
    let juiceRestControl = 0;
    if (juices[id].price > kassa.balance)
    {
        console.error("недостаточно средств");
        kassa.showStatus(INSUFFUCUENT);
        return;
    }
    juiceRestControl = juices[id].dimRest();
    if (juiceRestControl == NULLJUICES) {
        kassa.showStatus(NULLJUICES);
        return;
    }
    kassa.dimCoins(juices[id].price);
    kassa.showBalance();
    kassa.showStatus(SUCCESSFULL);
    
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
    //getUserData("OLEG0392",onDataRecieved);
}

function onDataRecieved(data) {
    imggit = document.createElement("img");
    imggit.src = data.avatar_url;
    document.getElementById("options").append(imggit);
}

