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

    /*$.ajax({
        url: `https://localhost:44321/api/${objectType}`,
        method: "POST",
        contentType: "application/x-www-form-urlencoded",
        data: JSON.stringify(sendData),
        success: successCallback       
    });*/

    $.ajax({
        /*headers: { 
            Accept: "application/json",
            'Content-Type': "application/json" 
        },*/
        url: `https://localhost:44321/api/${objectType}`,
        method: 'post',
        contentType: 'application/json',       
        data: JSON.stringify(sendData),      //'{id: 6, title: \'Сказка\', price: 35, rest: 1, imgUrl: \'drink7.png\'}',
        'success': successCallback
    });
}


