function getAutomatData(objecttype, successCallback){
    $.ajax(`https://localhost:44321/api/${objecttype}`,
{ success: successCallback });
}
