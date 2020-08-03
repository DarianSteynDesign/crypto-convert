//SUCCESS METHODS

var successMethods = (function(){

    var getTop100ListSuccess = function(data) {
        uiActions.getTop100Data(data);

        uiActions.loadCurrencyList($("#cryptoSymbolList"));
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

    $("body").on("click", ".crypto-list-item", function(event){
        let selectedId = $(this).data('id');
        let name = $(this).data('name');
        let fullname = $(this).data('fullname');
        uiActions.loadSelectedItem(selectedId);
    });

    return {
        
    }
})(eventListeners);

//UI ACTIONS

var uiActions = (function(){
    var top100 = [];

    //Get Top 100 List
    var getTop100Data = function(response){
        top100 = response.Data;
    }

    //Toggle Loading
    var toggleElementState = function(elementToggle) {
        let loadingLbl = elementToggle;
        loadingLbl.toggleClass('active');
    }

    //Populate currencyList
    var loadCurrencyList = function(listElement) {
        let coinList = "";
        console.log(listElement, top100);
        
        top100.forEach(function(item){
            coinList += "<li class='crypto-list-item' data-id='" + item.CoinInfo.Id + 
                        "' data-name='" + item.CoinInfo.Name + 
                        "' data-fullname='" + item.CoinInfo.FullName + 
                        "' > <img class='crypto-item-img' src='https://www.cryptocompare.com/" + item.CoinInfo.ImageUrl + 
                        " ' /> <p class='crypto-item-text'>" + item.CoinInfo.Name + "</p></li>";
        });
        
        listElement.html(coinList);
    }

    var loadSelectedItem = function(selectedId) {
        selectedId = JSON.stringify(selectedId);
        top100.forEach(function(item){
            let topPrice = Object.values(item.RAW)[0].PRICE;
            let coinName = item.CoinInfo.Name;

            (item.CoinInfo["Id"] == selectedId) ? updateUiWithSelected(topPrice, coinName) : '' ;
        });

        function updateUiWithSelected(selectedPrice, selectedName){
            $("#sym1").val(selectedPrice);
            $("#priceSym1").text(selectedName);
            toggleElementState($("#coinCont"));
        }
    }

    return {
        getTop100Data,
        toggleElementState,
        loadCurrencyList,
        loadSelectedItem
    }
})(uiActions);