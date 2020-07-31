//SUCCESS METHODS

var successMethods = (function(){
    var getTop100ListSuccess = function(data) {
        let top100List = data;

        uiActions.loadCurrencyList($("#cryptoSymbolList"), data);
        uiActions.toggleElementState($("#toggleLbl"));
    }

    return {
        getTop100ListSuccess
    }
})(successMethods);

//SERVICES

var services = (function() {

    //API Call main method
    var apiCall = function(type, url, dataType, successFunc, errorFunc){
        $.ajax({
            type: type,
            url: url,
            dataType: "json"
        }).then(function (data) {
            if(data.Response != "Error"){
                successFunc(data);
            } else{
                errorFunc(data);
            }
        });
    }

    //Get top 100 coins
    var getTop100List = function(currency){
        let top100Endpoint = "https://min-api.cryptocompare.com/data/top/totaltoptiervolfull?limit=100&tsym=";

        apiCall("Get", top100Endpoint + currency, "json", successMethods.getTop100ListSuccess, requestError);
    }

    //Error func
    var requestError = function(response){
        console.log(response);
    }

    return {
        getTop100List
    }
})(services);

//MAIN METHODS

var mainMethods = (function(){

    var getTop100List = function(){
        services.getTop100List("ZAR");
    }();

    return {
        
    }
})(mainMethods);

//EVENT LISTENERS

var eventListeners = (function(){

    var clickEvent = function(element, callback) {
        element.click(function(){
            callback();
        });
    }
    //clickEvent($("#priceSym1"), uiActions.toggleElementState($("#coinCont")));

    //Top currency button event
    $("#priceSym1").click(function(){
        uiActions.toggleElementState($("#coinCont"));
    });

    $("#closeBtn").click(function(){
        uiActions.toggleElementState($("#coinCont"));
    });

    return {
        
    }
})(eventListeners);

//UI ACTIONS

var uiActions = (function(){

    //Toggle Loading
    var toggleElementState = function(elementToggle) {
        let loadingLbl = elementToggle;
        loadingLbl.toggleClass('active');
    }

    //Populate currencyList
    var loadCurrencyList = function(listElement, response) {
        let coinList = "";
        console.log(listElement, response);
        
        response.Data.forEach(function(item){
            coinList += "<li class='cyrpto-list-item'>" + item.CoinInfo.Name + "</li>";
        });
        
        listElement.html(coinList);
    }

    return {
        toggleElementState,
        loadCurrencyList
    }
})(uiActions);