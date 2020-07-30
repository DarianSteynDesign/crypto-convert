//SUCCESS METHODS

var successMethods = (function(){

    function getCryptosSuccess(data){
        var coinList = data.Data;
        coinList = $.map( coinList, function( value, index ) {
          return value;
        });
        console.log(coinList);
    };

    var getPriceSuccess = function(data){
        var price = data;
        console.log(price);
    };

    return {
        getCryptosSuccess,
        getPriceSuccess
    }
})(successMethods);

//SERVICES

var services = (function() {
    var endpoint = 'https://min-api.cryptocompare.com/data/',
        coinListEnd = 'all/coinlist',
        priceEnd = "price?fsym=";

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

    var getCryptos = function(){
        var url = endpoint + coinListEnd;
        apiCall("GET", url, "json", successMethods.getCryptosSuccess);
    };

    var getPrice = function(sym1, sym2){
        var priceEndpoint = endpoint + priceEnd + sym1 + "&tsyms=" + sym2;
        apiCall("GET", priceEndpoint, "json", successMethods.getPriceSuccess);
    }

    return {
        getCryptos,
        getPrice
    }
})(services);

//MAIN METHODS

var mainMethods = (function(){

    var getCryptoList = function (){
        services.getCryptos();
    }();

    var priceComparison = function(){
        services.getPrice("BTC", "USD");
    }();

    return {
        
    }
})(successMethods);

var eventListeners = (function(){

    return {

    }
})(eventListeners);