//SUCCESS METHODS

var successMethods = (function(){

    var getTop100ListSuccess = function(data) {
        uiActions.getTop100Data(data);

        uiActions.loadCurrencyList($("#cryptoList"));
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

    var loadFiatList = function(){
        var fiatList = JSON.parse(jsonFiatList);
        uiActions.loadFiatList(fiatList);
    };

    $(window).on('load', function() {
        loadFiatList();
    });

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
    $("#priceSym1").click(function(event) {
        let currType = event.target.dataset.currtype;

        uiActions.toggleElementState($('#coinCont'), currType);
        uiActions.toggleElementState($('#cryptoList'), currType);
    });

    $("#priceSym2").click(function(event) {
        let currType = event.target.dataset.currtype;

        uiActions.toggleElementState($('#coinCont'), currType);
        uiActions.toggleElementState($('#cryptoList'), currType);
    });

    $("#cryptoBtn").click(function() {
        uiActions.toggleElementState($('#fiatList'));
    });
    
    $("#fiatBtn").click(function() {
        uiActions.toggleElementState($('#fiatList'));
    });

    $("#closeBtn").click(function() {
        uiActions.toggleElementState($('#coinCont'));
        uiActions.toggleElementState($('#cryptoList'));
    });

    $("body").on("click", ".crypto-list-item", function(event) {
        let selectedId = $(this).data('id');
        let name = $(this).data('name');
        let fullname = $(this).data('fullname');
        uiActions.getSelectedCryptoData(selectedId);
        uiActions.toggleElementState($("#coinCont"));
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

    //Populate cryptoList
    var loadCurrencyList = function(listElement) {
        let coinList = "";
        
        top100.forEach(function(item){
            coinList += "<li class='crypto-list-item' data-id='" + item.CoinInfo.Id + 
                        "' data-name='" + item.CoinInfo.Name + 
                        "' data-fullname='" + item.CoinInfo.FullName + 
                        "' > <img class='crypto-item-img' src='https://www.cryptocompare.com/" + item.CoinInfo.ImageUrl + 
                        " ' /> <p class='crypto-item-text'>" + item.CoinInfo.Name + "</p></li>";
        });
        getSelectedCryptoData(1182);
        
        listElement.html(coinList);
    }

    //Populate fiatList
    var loadFiatList = function(list) {
        let fiatList = "";

        list.forEach((listItem) => {
            fiatList += "<li class='crypto-list-item' data-id='" + Object.keys(listItem)[0] + "'>" + Object.keys(listItem)[0] + "</li>";
        });

        $("#fiatList").html(fiatList);
    }

    //Toggle Loading
    var toggleElementState = function(element, currType) {

        if(currType == "crypto") {
            $('#cryptoList').addClass('active');
            $('#fiatList').removeClass('active');
        } else{
            $('#fiatList').addClass('active');
        }

        if($(element).hasClass("active")) {
            $(element).removeClass("active");
        } else {
            $(element).addClass("active");
        }
    }

    //Get selected data
    var getSelectedCryptoData = function(selectedId) {
        selectedId = JSON.stringify(selectedId);
        top100.forEach(function(item){
            let price1 = Object.values(item.RAW)[0].PRICE;
            let coinName1 = item.CoinInfo.Name;

            (item.CoinInfo["Id"] == selectedId) ? updateUiWithSelected(price1, coinName1, $("#sym1")) : '' ;
        });
    }

    //Update ui with selected value
    var updateUiWithSelected = function(selectedPrice, selectedName, elementToUpdate){
        elementToUpdate.val(selectedPrice);
        $("#priceSym1").text(selectedName);
    }

    return {
        getTop100Data,
        toggleElementState,
        loadCurrencyList,
        getSelectedCryptoData,
        updateUiWithSelected,
        loadFiatList
    }
})(uiActions);