/*function getAutomatData(objecttype, successCallback){
    $.ajax(`https://localhost:44321/api/${objecttype}`,
{ success: successCallback });
}*/

function getAutomatData(objectType, successCallback) {

    $.ajax({
        url: `https://localhost:44321/api/${objectType}`,
        method: 'get',
        dataType: 'json',
        success: successCallback
    });
}

function fetchAutomatData(sendData, objectType, successCallback) {

    $.ajax({
        url: `https://localhost:44321/api/${objectType}`,
        method: 'post',
        dataType: 'json',
        data: sendData,
        success: successCallback
    });
}