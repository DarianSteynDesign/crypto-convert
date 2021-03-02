//SUCCESS METHODS

var successMethods = (function(){

    //Get top 100 cryptoList
    var getCryptoTop100ListSuccess = function(data) {
        uiActions.getCryptoTop100Data(data);

        //Load crypto list items and toggle loading
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

        setTimeout(() =>{
            uiActions.toggleElementState($("#convertLbl"));
        }, 500)
        
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
        services.getCryptoTop100List("USD");
    }();

    var loadFiatList = function(){
        var fiatList = JSON.parse(jsonFiatList);
        uiActions.loadFiatList(fiatList);
    };

    $(window).on('load', function() {
        loadFiatList();
    });

    //Convert input values
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

    //Top currency button event
    $("#priceSym1").click(function(event) {
        uiActions.selectedPriceInput.inputText = "#sym1";
        uiActions.selectedPriceInput.input = "#priceSym1";

        toggleCryptoList();
    });
    //Bottom currency button event
    $("#priceSym2").click(function() {
        uiActions.selectedPriceInput.inputText = "#sym2";
        uiActions.selectedPriceInput.input = "#priceSym2";

        toggleFiatList();
    });

    //Display crypto list
    $("#cryptoBtn").click(function() {
        toggleCryptoList();
    });
    
    //Display fiat list
    $("#fiatBtn").click(function() {
        toggleFiatList();
    });

    //Close currency lists
    $("#closeBtn").click(function() {
        closeCurrencyList();
    });

    //Select a crypto list item
    $("body").on("click", ".crypto-list-item", function() {
        let selectedId = $(this).data('id');
        let name = $(this).data('name');
        let fullname = $(this).data('fullname');
        let selectedType = $(this).data('type');

        //Get data for selected crypto value
        uiActions.getSelectedCryptoData(selectedId, name, selectedType);
        closeCurrencyList();
    });

    //Begin conversion event
    $("#convertLbl").click(function(){
        uiActions.getInputValues($("#sym1")[0].dataset.price, $("#sym2"));
    });

    //Search crypto list event
    $("#searchInput").keyup(function(event){
        uiActions.currencySearch(event.target.value);
    });

    //Specific list toggle functions
    var closeCurrencyList = function() {
        var lists = [{"element": $('#fiatList'), state: true}, {"element": $('#cryptoList'), state: true}];
        uiActions.toggleElementState($('.coinNav'), true);
        toggleLists(lists);
    }

    var toggleCryptoList = function() {
        var lists = [{"element": $('#fiatList'), state: true}, {"element": $('#cryptoList'), state: false}];
        uiActions.toggleElementState($('.coinNav'), false);
        toggleLists(lists);
    }

    var toggleFiatList = function() {
        var lists = [{"element": $('#cryptoList'), state: true}, {"element": $('#fiatList'), state: false}];
        uiActions.toggleElementState($('.coinNav'), false);
        toggleLists(lists);
    }

    //Toggle list func
    var toggleLists = function(listsToToggle) {
        listsToToggle.forEach(function(listItem){
            uiActions.toggleElementState(listItem.element, listItem.state);
        });

        function emptySearch(){
            uiActions.currencySearch("");
            $("#searchInput").val("");
        }
        emptySearch();
    }

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
        
        //Populate data into html string
        crytpoTop100.forEach(function(item){
            coinList += "<li class='crypto-list-item' data-type='crypto'" + 
                        "data-id='" + item.CoinInfo.Id + 
                        "' data-name='" + item.CoinInfo.Name + 
                        "' data-fullname='" + item.CoinInfo.FullName + 
                        "' > <img class='crypto-item-img' src='https://www.cryptocompare.com/" + item.CoinInfo.ImageUrl + 
                        " ' /> <p class='crypto-item-text'>" + item.CoinInfo.Name + "</p></li>";
        });

        //Load crypto values to default inputs
        uiActions.selectedPriceInput.inputText = "#sym2";
        uiActions.selectedPriceInput.input = "#priceSym2";
        //Select default input
        let defaultInput = $(uiActions.selectedPriceInput.input);

        //Wait 500ms for Dom Load
        setTimeout(() => {
            //Check if default input has had a user selection, the data-id will be set if a user has selected
            if(defaultInput[0].dataset.id){
                //Load user selected crypto
                getSelectedCryptoData(parseInt(defaultInput[0].dataset.id), defaultInput[0].dataset.name ,"crypto");
            } else {
                //If its not a user selection, then load the default crypto
                getSelectedCryptoData(1182, "BTC" ,"crypto");
            }
        }, 500);
        
        //Poplate coinList in the html. 
        listElement.html(coinList);
    }

    //Populate fiatList
    var loadFiatList = function(list) {
        let fiatList = "";

        list.forEach((listItem) => {
            let fiatSymbol = Object.keys(listItem)[0];
            fiatList += "<li class='crypto-list-item' data-type='fiat' data-name='" + fiatSymbol + "'" 
            + "data-id='" + fiatSymbol + "'> <p class='item-text'>"  + fiatSymbol +  "</p> <p class='item-sub-text'>"  + listItem[fiatSymbol] +  "</p> </li>";
        });
        
        //Once fiat list is loaded, load default price for top input
        updateUiWithSelected(1, "BTC", $("#sym1"), $("#priceSym1"))

        $("#fiatList").html(fiatList);
    }

    //Toggle html elements active state
    var toggleElementState = function(element, closeElement) {
        if(closeElement){
            $(element).removeClass("active");
        } else{
            if($(element).hasClass("active")) {
                $(element).removeClass("active");
            } else {
                $(element).addClass("active");
            }
        }
    }

    //Use Top100 Crypto list response and load the crypto & fiat values to their respective input
    var getSelectedCryptoData = function(selectedId, selectedName, selectedType) {
        selectedId = JSON.stringify(selectedId);

        console.log(selectedId, selectedName, selectedType, selectedPriceInput);

        if(selectedType != undefined){
            if(selectedType === "crypto"){
                
                $(selectedPriceInput.input).attr("data-currtype", selectedType);
                $(selectedPriceInput.input).attr("data-id", selectedId);
                $(selectedPriceInput.input).attr("data-name", selectedName);

                crytpoTop100.forEach(function(top100Item){
                    //Check for object that contains price
                    if(top100Item.RAW){
                        let cryptoPrice = Object.values(top100Item.RAW)[0].PRICE;
                        
                        //Make sure the selected cryptoId is in the top100 list
                        if(top100Item.CoinInfo["Id"] == selectedId){
                            //Set price in input
                            $("#sym1").attr("data-price", cryptoPrice);
                            updateUiWithSelected(cryptoPrice, selectedName, selectedPriceInput.inputText, selectedPriceInput.input)
                        }
                    }
                });
            } else {
                let fiatPrice = 1;

                //Set fiat data-currtype for conversion
                $(selectedPriceInput.input).attr("data-currtype", selectedType);
                $("#sym2").attr("data-price", fiatPrice);

                updateUiWithSelected(1, selectedName, selectedPriceInput.inputText, selectedPriceInput.input);
                //Get latest crypto prices with selected fiatId
                services.getCryptoTop100List(JSON.parse(selectedId));
            }
        }
    }

    //Update ui with selected value
    var updateUiWithSelected = function(selectedPrice, selectedName, inputToUpdate, textToUpdate){
        let formattedString = parseFloat(selectedPrice).toLocaleString('en-US', {maximumFractionDigits:2});
        $(inputToUpdate).val(formattedString);
        $(textToUpdate).text(selectedName);
    }

    var getInputValues = function(inputVal1, inputVal2){
        inputVal1 = parseFloat(inputVal1).toFixed(2);
        inputVal2 = parseFloat(inputVal2[0].value).toFixed(2);

        console.log(inputVal1, inputVal2);
        updateUiWithSelected(mainMethods.convertValues(inputVal1, inputVal2), $("#priceSym2")[0].innerText, $("#sym2"));
    }

    var currencySearch = function(inputText) {
        var filter, listItems, listItem, txtValue;
        filter = inputText.toUpperCase();

        listItems = document.querySelectorAll(".crypto-list-item");

        for (var i = 0; i < listItems.length; i++) {
            listItem = listItems[i];
            txtValue = listItem.textContent || listItem.innerText;
            if (txtValue.toUpperCase().indexOf(filter) > -1) {
                listItems[i].style.display = "";
            } else {
                listItems[i].style.display = "none";
            }
        }
    }

    return {
        getCryptoTop100Data,
        toggleElementState,
        loadCurrencyList,
        getSelectedCryptoData,
        updateUiWithSelected,
        loadFiatList,
        getInputValues,
        currencySearch
    }
})(uiActions);