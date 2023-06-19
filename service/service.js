
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
        contentType: 'application/json',       
        data: JSON.stringify(sendData),      //'{id: 6, title: \'Сказка\', price: 35, rest: 1, imgUrl: \'drink7.png\'}',
        'success': successCallback
    });
}


