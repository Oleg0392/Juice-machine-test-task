function getUserData(username, successCallback){
    $.ajax(`https://api.github.com/users/${username}`,
{ success: successCallback });
}
