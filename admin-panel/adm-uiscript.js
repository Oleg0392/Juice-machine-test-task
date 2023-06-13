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

        this.juiceEdtButton = document.createElement("button");
        this.juiceEdtButton.classList.add("edtbutton");
        this.juiceEdtButton.setAttribute("onclick", `editJuice(${juice.id.toString()})`);
        this.juiceEdtButton.textContent = "Изменить";
        this.juiceCell.append(this.juiceEdtButton);
        this.juiceCell.append(" ");

        this.juiceDelButton = document.createElement("button");
        this.juiceDelButton.classList.add("delbutton");
        this.juiceDelButton.setAttribute("onclick", `buyJuice(${juice.id.toString()})`);
        this.juiceDelButton.textContent = "Удалить";
        this.juiceCell.append(this.juiceDelButton);
        this.juiceCell.append(" ");

        this.juiceBlkButton = document.createElement("button");
        this.juiceBlkButton.classList.add("blkbutton");
        this.juiceBlkButton.setAttribute("onclick", `buyJuice(${juice.id.toString()})`);
        this.juiceBlkButton.textContent = "Блокировка";
        this.juiceCell.append(this.juiceBlkButton);

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
        //this.juicePriceCount.classList.add("price");
        //this.juicePriceCount.textContent = `Цена: ${juice.price.toFixed(2)}, Ост: ${juice.rest.toString()}`;

        this.juicePriceEditButton = document.createElement("button");
        this.juicePriceEditButton.className = "edtbutton";
        this.juicePriceEditButton.setAttribute("onclick",`editJuice(11,${juice.id.toString()}`);
        this.juicePriceEditButton.textContent = `Цена: ${juice.price.toFixed(2)}`;

        this.juiceRestEditButton = document.createElement("button");
        this.juiceRestEditButton.className = "edtbutton";
        this.juiceRestEditButton.setAttribute("onclick",`editJuice(12,${juice.id.toString()}`);
        this.juiceRestEditButton.textContent = `Ост: ${juice.rest.toString()}`;

        this.juicePriceCount.append(this.juicePriceEditButton);
        this.juicePriceCount.append(" ");
        this.juicePriceCount.append(this.juiceRestEditButton);
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

class Kassa {
    constructor() {
        this.balance = 0.00;
        this.display = document.getElementById("psum");
        //this.status = document.getElementById("paystatus");
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

    setSelectedJuice(juice) {
        this.selectedJuice = juice
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
        this.CoinButton.setAttribute("onclick",`switchBlocking(${coins[coinId].id})`);
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

const kassa = new Kassa();

const juices = [];
juices.push(new Juice(0, "Кленовый сауэр", 25, 15, "../img/drink1.png"));
juices.push(new Juice(1, "Манхэттен", 15, 5, "../img/drink2.png"));
juices.push(new Juice(2, "Карибское сокровище", 10, 10, "../img/drink3.png"));
juices.push(new Juice(3, "Мохито", 30, 3, "../img/drink4.png"));
juices.push(new Juice(4, "Кровавая Мэри", 20, 7, "../img/drink5.png"));
juices.push(new Juice(5, "Японский урожай", 18, 9, "../img/drink6.png"));
juices.push(new Juice(6, "Сказка", 35, 1, "../img/drink7.png"));
juices.push(new Juice(7, "Пача Ибица", 40, 12, "../img/drink8.png"));

const coins = [];
coins.push(new Coin(0,10,false));
coins.push(new Coin(1,5,false));
coins.push(new Coin(2,2,false));
coins.push(new Coin(3,1,false));

const juiceGrid = new JuiceGrid(document.getElementById("juices-grid"));
const coinList = new CoinList(document.getElementById("coins"));

function onDataRecieved(data) {
    imggit = document.createElement("img");
    imggit.src = data.avatar_url;
    document.getElementById("options").append(imggit);
}

function switchBlocking(coinId) {
    if (coins[coinId].blocked) coins[coinId].blocked = false; else coins[coinId].blocked = true;
    coinList.checkBlocking(coinId);
}

function editJuice(juiceId) {
    var value = prompt("новое значение","");
}

function deleteJuice(juiceId) {

}

function blockJuice(juiceId) {

}
