//SUCCESS METHODS

var successMethods = (function(){

    var getCryptoTop100ListSuccess = function(data) {
        uiActions.getCryptoTop100Data(data);

        uiActions.loadCurrencyList($("#cryptoList"));
        uiActions.toggleElementState($("#convertLbl"));
    }

    return {
        getCryptoTop100ListSuccess
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
    var getCryptoTop100List = function(currency){
        let top100Endpoint = "https://min-api.cryptocompare.com/data/top/totaltoptiervolfull?limit=100&tsym=";

        apiCall("Get", top100Endpoint + currency, "json", successMethods.getCryptoTop100ListSuccess, requestError);
    }

    //Error func
    var requestError = function(response){
        console.log(response);
    }

    return {
        getCryptoTop100List
    }
})(services);

//MAIN METHODS

var mainMethods = (function(){

    var getCryptoTop100List = function(){
        services.getCryptoTop100List("ZAR");
    }();

    var loadFiatList = function(){
        var fiatList = JSON.parse(jsonFiatList);
        uiActions.loadFiatList(fiatList);
    };

    $(window).on('load', function() {
        loadFiatList();
    });

    var convertValues = function(val1, val2){
        let total = 0;
        total += val1 * val2;
        return total.toFixed(2);
    }

    return {
        convertValues
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

        uiActions.selectedPriceInput.inputText = "#sym1";
        uiActions.selectedPriceInput.input = "#priceSym1";
        uiActions.toggleElementState($('#coinCont'), currType);
    });

    $("#priceSym2").click(function(event) {
        let currType = event.target.dataset.currtype;

        uiActions.selectedPriceInput.inputText = "#sym2";
        uiActions.selectedPriceInput.input = "#priceSym2";
        uiActions.toggleElementState($('#coinCont'), currType);
    });

    $("#cryptoBtn").click(function(event) {
        let currType = event.target.dataset.currtype;

        uiActions.toggleElementState(null, currType);
    });
    
    $("#fiatBtn").click(function(event) {
        let currType = event.target.dataset.currtype;

        uiActions.toggleElementState($('#cryptoList'), currType);
    });

    $("#closeBtn").click(function() {
        uiActions.toggleElementState($('#coinCont'));
        uiActions.toggleElementState($('#cryptoList'));
    });

    $("body").on("click", ".crypto-list-item", function(event) {
        let selectedId = $(this).data('id');
        let name = $(this).data('name');
        let fullname = $(this).data('fullname');
        let selectedType = $(this).data('type');

        uiActions.getSelectedCryptoData(selectedId, name, selectedType);
        uiActions.toggleElementState($("#coinCont"));
    });

    $("#convertLbl").click(function(){
        console.log($("#sym1")[0].dataset.price);
        uiActions.getInputValues($("#sym1")[0].dataset.price, $("#sym2"));
    });

    return {
        
    }
})(eventListeners);

//UI ACTIONS

var uiActions = (function(){
    var crytpoTop100 = [];
    var selectedPriceInput = {"input" : "", "inputText" : ""};

    //Get Top 100 List
    var getCryptoTop100Data = function(response){
        crytpoTop100 = response.Data;
    }

    //Populate cryptoList
    var loadCurrencyList = function(listElement) {
        let coinList = "";
        
        crytpoTop100.forEach(function(item){
            coinList += "<li class='crypto-list-item' data-type='crypto'" + 
                        "data-id='" + item.CoinInfo.Id + 
                        "' data-name='" + item.CoinInfo.Name + 
                        "' data-fullname='" + item.CoinInfo.FullName + 
                        "' > <img class='crypto-item-img' src='https://www.cryptocompare.com/" + item.CoinInfo.ImageUrl + 
                        " ' /> <p class='crypto-item-text'>" + item.CoinInfo.Name + "</p></li>";
        });
        uiActions.selectedPriceInput.inputText = "#sym1";
        uiActions.selectedPriceInput.input = "#priceSym1";
        getSelectedCryptoData(1182, "BTC" ,"crypto");
        
        listElement.html(coinList);
    }

    //Populate fiatList
    var loadFiatList = function(list) {
        let fiatList = "";

        list.forEach((listItem) => {
            fiatList += "<li class='crypto-list-item' data-type='fiat' data-name='" + Object.keys(listItem)[0] + "'" 
            + "data-id='" + Object.keys(listItem)[0] + "'>" + Object.keys(listItem)[0] + "</li>";
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
    var getSelectedCryptoData = function(selectedId, selectedName, selectedType) {
        selectedId = JSON.stringify(selectedId);

        //console.log(selectedId, selectedName, selectedType, selectedPriceInput);

        if(selectedType != undefined){
            if(selectedType === "crypto"){
                crytpoTop100.forEach(function(item){
                    let cryptoPrice = Object.values(item.RAW)[0].PRICE;
        
                    if(item.CoinInfo["Id"] == selectedId){
                        $("#sym1").attr("data-price", cryptoPrice);
                        updateUiWithSelected(cryptoPrice, selectedName, selectedPriceInput.inputText, selectedPriceInput.input)
                    }
                });
            } else{
                let fiatPrice = 1;
                updateUiWithSelected(fiatPrice, selectedName, selectedPriceInput.inputText, selectedPriceInput.input)
            }
        }
    }

    //Update ui with selected value
    var updateUiWithSelected = function(selectedPrice, selectedName, inputToUpdate, textToUpdate){
        $(inputToUpdate).val(selectedPrice);
        $(textToUpdate).text(selectedName);
    }

    var getInputValues = function(inputVal1, inputVal2){
        inputVal1 = parseFloat(inputVal1).toFixed(2);
        inputVal2 = parseFloat(inputVal2[0].value).toFixed(2);

        //updateUiWithSelected(mainMethods.convertValues(inputVal1, inputVal2), $("#priceSym1")[0].innerText, $("#sym1"));
    }

    return {
        getCryptoTop100Data,
        toggleElementState,
        loadCurrencyList,
        getSelectedCryptoData,
        updateUiWithSelected,
        loadFiatList,
        getInputValues,

        selectedPriceInput
    }
})(uiActions);