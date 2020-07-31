//SUCCESS METHODS

var successMethods = (function(){
    var getTop100ListSuccess = function(data) {
        let top100List = data;
        console.log(top100List);
        console.log("Test change");
    }

    return {
        getTop100ListSuccess
    }
})(successMethods);

//SERVICES

var services = (function() {

    //API Call main method

    var apiCall = function(type, url, dataType, successFunc){
        $.ajax({
            type: type,
            url: url,
            dataType: "json"
        }).then(function (data) {
            if(data){
                successFunc(data);
            }
        });
    }

    //Get top 100 coins

    var top100Endpoint = "https://min-api.cryptocompare.com/data/top/totaltoptiervolfull?limit=100&tsym=USD";

    var getTop100List = function(){
        apiCall("Get", top100Endpoint, "json", successMethods.getTop100ListSuccess);
    }

    return {
        getTop100List
    }
})(services);

//MAIN METHODS

var mainMethods = (function(){

    var getTop100List = function(){
        services.getTop100List();
    }();

    return {
        
    }
})(successMethods);

var eventListeners = (function(){

    return {

    }
})(eventListeners);