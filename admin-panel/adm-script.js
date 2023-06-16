const EDIT_PRICE = 11;
const EDIT_REST = 12;
const EDIT_TITLE = 13;
const GRID_SIZE = 4;
const JUICE_COUNT = 8;

class Juice {
    constructor(juiceid, title, price, rest, imgurl){
        this.juiceid = juiceid;
        this.Title = title;
        this.Price = price;
        this.Rest = rest;
        this.ImgUrl = imgurl;
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
        //this.juiceImg.setAttribute("src", juice.imgUrl.toString());
        this.juiceImg.src = juice.imgUrl.toString();
        this.juiceImg.setAttribute("onclick",`getJuiceInfo(${juice.juiceid.toString()})`);
        this.juiceImg.classList.add("image");
        this.juiceCell.append(this.juiceImg);

        this.juiceTitle = document.createElement("p");
        this.juiceTitle.textContent = `Коктейль \"${juice.title}\"`;
        this.juiceCell.append(this.juiceTitle);

        this.juiceEdtButton = document.createElement("button");
        this.juiceEdtButton.classList.add("edtbutton");
        this.juiceEdtButton.setAttribute("onclick", `editJuice(13,${juice.juiceid.toString()})`);
        this.juiceEdtButton.textContent = "Изменить";
        this.juiceCell.append(this.juiceEdtButton);
        this.juiceCell.append(" ");

        /*this.juiceDelButton = document.createElement("button");
        this.juiceDelButton.classList.add("delbutton");
        this.juiceDelButton.setAttribute("onclick", `deleteJuice(${juice.juiceid.toString()})`);
        this.juiceDelButton.textContent = "Удалить";
        this.juiceCell.append(this.juiceDelButton);
        this.juiceCell.append(" ");*/

        this.juiceBlkButton = document.createElement("button");
        this.juiceBlkButton.classList.add("blkbutton");
        this.juiceBlkButton.setAttribute("onclick", `blockJuice(${juice.juiceid.toString()})`);
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

        this.juicePriceEditButton = document.createElement("button");
        this.juicePriceEditButton.className = "edtbutton";
        this.juicePriceEditButton.setAttribute("onclick",`editJuice(11,${juice.juiceid.toString()})`);
        this.juicePriceEditButton.textContent = `Цена: ${juice.price.toFixed(2)}`;

        this.juiceRestEditButton = document.createElement("button");
        this.juiceRestEditButton.className = "edtbutton";
        this.juiceRestEditButton.setAttribute("onclick",`editJuice(12,${juice.juiceid.toString()})`);
        this.juiceRestEditButton.textContent = `Ост: ${juice.rest.toString()}`;

        this.juicePriceCount.append(this.juicePriceEditButton);
        this.juicePriceCount.append(" ");
        this.juicePriceCount.append(this.juiceRestEditButton);
        this.juiceCell.append(this.juicePriceCount);
    }

    blockingJuiceCell() {
        this.juiceCell.classList.remove("cell");
        this.juiceCell.classList.add("bcell");
        this.juiceImg.classList.remove("image");
        this.juiceImg.classList.add("blocked");
    }

    updateJuicePrice(juiceId, value) {
        juices[juiceId].price = value;
        this.juicePriceEditButton.textContent = `Цена: ${Number(value).toFixed(2)}`;
    }

    updateJuiceRest(juiceId, value) {
        juices[juiceId].rest = value;
        this.juiceRestEditButton.textContent = `Ост: ${value.toString()}`;
    }

    updateJuiceTitle(juiceId, value) {
        juices[juiceId].title = value;
        this.juiceTitle.textContent = `Коктейль \"${value}\"`;
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

class Kassa {
    constructor() {
        this.balance = 0.00;
        this.display = document.getElementById("psum");
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

    setSelectedJuice(juice) {
        this.selectedJuice = juice
    }
}

class Coin {
    constructor(id, nominal, blocked) {
        this.coinid = id;
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
            this.CoinButton.setAttribute("onclick",`switchBlocking(${coinId})`);
        } 
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

let juices = undefined;
let coins = undefined;
let juiceGrid = undefined;
let coinList = undefined;

const kassa = new Kassa();

function onJuiceDataRecieved(data) {

    console.log(data);
    juices = JSON.parse(JSON.stringify(data));

    juiceGrid = new JuiceGrid(document.getElementById("juices-grid"));
}

function onCoinDataRecieved(data) {

    console.log(data);
    coins = JSON.parse(JSON.stringify(data));

    coinList = new CoinList(document.getElementById("coins"));
}

function switchBlocking(coinId) {
    if (coins[coinId].blocked) coins[coinId].blocked = false;
    else coins[coinId].blocked = true;
    coinList.checkBlocking(coinId);
}

function editJuice(editCode, juiceId) {
    switch (editCode) {
        case EDIT_PRICE: {  var value = prompt("Введите новую цену:",Number(juices[juiceId].price).toFixed(2));
                            juiceGrid.juiceGridCells[juiceId].updateJuicePrice(juiceId, value);
                            break; }
        case EDIT_REST : {  var value = prompt("Введите новое кол-во:",juices[juiceId].rest.toString());
                            juiceGrid.juiceGridCells[juiceId].updateJuiceRest(juiceId, value);
                            break; }
        case EDIT_TITLE: {  var value = prompt("Введите новое название:",juices[juiceId].title);
                            juiceGrid.juiceGridCells[juiceId].updateJuiceTitle(juiceId, value);
                            break; }
                default:    break;
    }
}

function deleteJuice(juiceId) {
    juiceGrid.juiceGridCells[juiceId].remove();
}

function blockJuice(juiceId) {
    juiceGrid.juiceGridCells[juiceId].blockingJuiceCell();
}

function goHomePage() {
    window.location.href = window.location.href.replace("adm","");
}

function saveChanges() {
    var sendData = JSON.stringify(juices);
    console.log(sendData);
    fetchAutomatData(sendData, "juices", onJuiceDataSended);
}

function onJuiceDataSended() {
    console.log("juices uploaded");
}
