let inVehicle = false
let phoneOpen = false
let updatedCashCount = 0

window.addEventListener('message', (event) => {
    if (event.data.type == "hudmenu" ){
        $(".hud-menu-container").css("display", "flex");
    } else if (event.data.type == "salty") {
        const state = event.data.state
        const element = $(".salty-error")
        if (state == 2) {
            element.fadeOut()
        } else if (state == -1) {
            element.fadeIn()
        } else if (state == 0) { 
            element.fadeIn()
        } else {
            element.fadeIn()
        }
    } else if (event.data.type == "phone") {
        //$('.voice').attr("style", "");
        phoneOpen = event.data.phoneOpen
        if (phoneOpen) {
            $(".voice").animate({
                bottom: "92%"
            }, 500);
        }

        if (inVehicle) {
            if (phoneOpen) {
                $(".cusalhud").fadeOut()
            } else {
                $(".cusalhud").fadeIn()
                $(".voice").animate({
                    right: "40px",
                    bottom: "15px"
                }, 500);
            }
        } else {
            if (!phoneOpen) {
                $(".voice").animate({
                    bottom: "2%"
                }, 500);
            }
        }
    } else if (event.data.type == "ui") {
        if (event.data.show) {
            $(".container").fadeIn();
            if (inVehicle && !phoneOpen) {
                $(".voice").animate({
                    left:"50px",
                    bottom: "235px"
                }, 500);
            }
        } else {
            $(".container").fadeOut();
            if (inVehicle && !phoneOpen) {
                $(".voice").animate({
                    bottom: "2%",
                    left:"50px",
                }, 500);
            }
        }
    } else if (event.data.type == 'updateStatus') {
        
        for(let prop in event.data.data){
            var val = event.data.data[prop]
            $("#"+prop).css("width", val+"%")
            if (prop == "yemek" || prop == "su" ) {
                $("#car-"+prop).css("width", val+"%")
            }
        }
    } else if (event.data.type == 'tick') {
        $("#heal").css("width", event.data.heal+"%")
        $("#armor").css("width", event.data.armor+"%")
        if (!inVehicle) {
            let oxyVal = event.data.oxy * 2.5
            if (oxyVal > 100 ) { oxyVal = 100 }
            if (oxyVal < 100) {
                $("#oxy").css("width", oxyVal+"%")
                $("#stamina-bar").fadeOut()
                $("#oxy-bar").fadeIn()
            } else {
                $("#stamina").css("width", event.data.stamina+"%")
                $("#stamina-bar").fadeIn()
                $("#oxy-bar").fadeOut()
            }    
        }
        
    } else if (event.data.type == "carHud") {
        $(".street-text-text").html(event.data.street)
        $(".street-text-compass").html(event.data.compass)
        $(".status-hud-clock-text").html(event.data.time)
        // $(".fuel-bar-inside").css("width", event.data.fuel+"%")
        // carHudMiniIconOnOff("doors", event.data.doors)
        // carHudMiniIconOnOff("engine", event.data.engine)
        // carHudMiniIconOnOff("light", event.data.light)
        // carHudMiniIconOnOff("belt", event.data.belt)
        // carHudMiniIconOnOff("trunk", event.data.trunk)
        // carHudMiniIconOnOff("cruise", event.data.cruise)
        // if (event.data.seatbeltmod) {
        //     $("#beltColor path").css("fill", "orange")
        // } else {
        //     $("#beltColor path").css("fill", "white")
        // }
        // if (event.data.engineHealth < 500) {
        //     $("#engineColor path").css("fill", "orange")
        // } else {
        //     $("#engineColor path").css("fill", "white")
        // }
    } else if (event.data.type == "vehSpeed") {
        $(".kmh-number").html(event.data.speed)
        $(".strela").css("transform", "rotate("+event.data.speed+"deg)")
    } else if (event.data.type == "inVeh") {
        if (event.data.data) {
            inVehicle = true
            $(".mapoutline").fadeIn(50);
            $("#stamina-bar").animate({"opacity":"0"},300)
            $("#oxy-bar").animate({"opacity":"0"},300)

            $(".status-hud").animate({
                left: "35vh",
                bottom: "25vh",
                width: "50vh"
            }, 0, function() {
                $(".short .icon").animate({"width":"2em","bottom":"0.65vh"},1)
                $("#armor-bar").animate({"bottom":"-3.6vh","left":"-1.2vh"},300)
                $("#hunger-bar").animate({"bottom":"-7.4vh","left":"-2.4vh"},300)
                $("#water-bar").animate({"bottom":"-11.8vh","left":"-7.8vh"},300)
                $("#stamina-bar").animate({"bottom":"1","left":"5","opacity":"0"},)
                $(".long").animate({"width":"30px","height":"30px"},300)
                $(".short").animate({"width":"30px","height":"30px"},300)
            });

            if (!phoneOpen) {
                $(".voice").animate({
                    bottom: "5px",
                    left:"%1",
                }, 500, function() {
                    $(".cusalhud").fadeIn()
                });
            }


            $(".street-text").animate({
                left: "28.5vh",
                bottom: ".6vh",
            }, 500);
            $(".street-text-compass").animate({"height":"25px"})
        } else {
            inVehicle = false
            $(".mapoutline").fadeOut(50);

            $(".icon").animate({"width":"1em"},300)
            $(".short .icon").animate({"width":"1em"},300)
            
        

            $(".long").animate({"width":"30px","height":"30px"},300)
            $(".short").animate({"width":"30px","height":"30px"},300, () => {
                $(".status-hud").animate({
                    left: "6vh",
                    bottom: "1vh",
                    width: "30vh"
                }, 500, () => $("#stamina-bar").animate({"bottom":"1","left":"5","opacity":"1"},300));
                $("#armor-bar").animate({"bottom":"1","left":"2"},300)
                $("#hunger-bar").animate({"bottom":"1","left":"3"},300)
                $("#water-bar").animate({"bottom":"1","left":"4"},300)
            })

            $("#hunger-bar").fadeIn()
            $("#water-bar").fadeIn()
            $("#stamina-bar").fadeIn()
            //$("#oxy-bar").fadeIn()
            if (!phoneOpen) {
                $(".cusalhud").fadeOut(500, function() {
                    $(".voice").animate({
                        bottom: "1vh"
                    }, 500);
                });
            }

            $(".street-text").animate({
                left: "1.8vh",
                bottom: "6vh"
            }, 500);
            $(".street-text-compass").animate({"height":"30px"})
         
        }
        $(".status-hud-clock-text").html(event.data.time)
    } else if (event.data.type == "clockStreet") {
        $(".status-hud-clock-text").html(event.data.time)
        $(".street-text-text").html(event.data.street)
        $(".street-text-compass").html(event.data.compass)
    } else if (event.data.type == "voice") {
        $(".voice-elipse").html(event.data.lvl)
    } else if (event.data.type == "money") {
        $("#cash").html(setCurrency(event.data.money))
        if (event.data.show) {
            $(".money-cash").animate({opacity: "1.0"}, 100);
        } else {
            $(".money-cash").animate({opacity: "0.0"}, 100);
        }
    } else if (event.data.type == "moneyUpdate") {
        updatedCashCount++
        $("#cash").html(setCurrency(event.data.newCashAmount))
        if (event.data.isMinus) {plusOrMinus = "-"} else {plusOrMinus = "+"}
        $(".money-cash").animate({opacity: "1.0"}, 100);
        if (updatedCashCount == 1) {
            $("#addCashValue").html(plusOrMinus+setCurrency(event.data.money))
            $("#addCash").animate({opacity: "1.0"}, 100);
        } else {
            $("#addCash").animate({opacity: "0.0"}, 100, function(){
                $("#addCashValue").html(plusOrMinus+setCurrency(event.data.money))
                $("#addCash").animate({opacity: "1.0"}, 100);
            });
        }
        setTimeout(() => {
            updatedCashCount--
            if (updatedCashCount == 0) {
                $(".money-cash").animate({opacity: "0.0"}, 100);
                $("#addCash").animate({opacity: "0.0"}, 100);
            }
        }, 2000);
    } else if (event.data.type == "speak") {
        if (event.data.active) {
            $(".circle-ripple").fadeIn(150)
        } else {
            $(".circle-ripple").fadeOut(150)
        }
    } else if (event.data.type == "CusalsetSpeedNumbers") {
        SetSpeedValue(event.data.speed)
    } else if (event.data.type == "CusalsetSpeedo") {
        SetSpeedo(event.data.speed * 0.5)
    } else if (event.data.type == "CusalsetFuel") {
        SetFuel(event.data.fuel)
    } else if (event.data.type == "CusalsetCarIcon") {
        SetCarIcon(event.data.iconName, event.data.iconColor)
    } else if (event.data.type == "CusalsetUI") {
        Show(event.data.state)
    }
});

function setCurrency(price) {
    return (price).toLocaleString('tr-TR', {style: 'decimal', currency: 'USD', maximumFractionDigits: 0, minimumFractionDigits: 0})
}

function carHudMiniIconOnOff(style, on) {
    if (on == "close") {
        $("#"+style).css("display", "none")
        $("#"+style+"-icon").css("display", "none")
    } else if (!on) {
        $("#"+style).css("display", "none")
        $("#"+style+"-icon").css("display", "block")
        $("#"+style+"-icon").css("opacity", "0.45")
    } else {
        $("#"+style).css("display", "block")
        $("#"+style+"-icon").css("display", "block")
        $("#"+style+"-icon").css("opacity", "1.0")
    }
}

// Hud Menu
$(".hud-menu-header-close").click(function() {
    $(".hud-menu-container").css("display", "none");
    $.post('https://hud/hudmenuclose');
});

$("#emotechat").on( "click", function(e) {
    $.post('https://hud/emotechat', JSON.stringify({onOff: e.currentTarget.checked}) );
});

$("#blackbar").on( "click", function(e) {
    if (e.currentTarget.checked) {
        $(".blackbar-container").css("display", "flex")
    } else {
        $(".blackbar-container").css("display", "none")
    };
});

$("#imenu").on( "click", function(e) {
    $.post('https://hud/imenu', JSON.stringify({status: e.currentTarget.checked}) );
});

$("#hudackapa").on( "click", function(e) {
    if (e.currentTarget.checked) {
        $.post('https://hud/hudkapa', JSON.stringify({status: e.currentTarget.checked}) );
    } else {
        $.post('https://hud/hudac', JSON.stringify({status: e.currentTarget.checked}) );
    };
});


/**
 * @param {Number} speed
 *  0-100 arası hız değeri alır, hız dairesini değiştirir.
 * ÖRN: SetSpeedo(50) <- Yarısını doldurur.
 */
const SetSpeedo = speed => {
    const Colors = {
        veryhigh: "#DE0022",
        high: "#3b88f9",
        low: "#7DBBF9"
    };
    // Renk değişimi için koşullu kontrol
    if (speed < 20) {
        $("#speed-real").css("stroke", Colors.low);
    } 
    else if (speed >= 20 && speed <= 80) {
        $("#speed-real").css("stroke", Colors.high);
    } else {
        $("#speed-real").css("stroke", Colors.veryhigh);
    }
    
    // Stroke-dashoffset animasyonu
    $("#speed-real").animate({"stroke-dashoffset": 300 * ((100 - speed) / 100)}, 31);
}

/**
/**
 * @param {Number} fuel 
 * 0-100 arası yakıt değeri alır, yakıt barını değiştirir.
 * ÖRN: SetFuel(50)
 */
const SetFuel = fuel => {
    const Colors = {
        high: "#499C4D",
        low: "#B30000"
    };
    
    let fuelBar = $(".cusalhud-fuel-bar-inside");
    let offset = 126 * ((100 - fuel) / 100);
    
    if (fuel >= 50) {
        fuelBar.css({"stroke": Colors.high});
    } else {
        fuelBar.css({"stroke": Colors.low});
    }
    
    fuelBar.animate({"stroke-dashoffset": offset}, 31);
};

// Örnek kullanımı
SetFuel(50);

// Örnek kullanımı
SetFuel(50);

/**
 * @param {Number} speed
 * Sayı olan hız değerini alır, hız sayılarını değiştirir
 * ÖRN: SetSpeedValue(50) 
 */
const SetSpeedValue = speed => {
    speed = speed.toString();

    $(".speedval").removeClass("othernum")
    $(".speedval").html("0")
    switch(speed.length) {
        case 1:
            $("#speed0").html(speed[0])
            $("#speed0").addClass("othernum")
            break;
        case 2:
            $("#speed0").html(speed[1])
            $("#speed0").addClass("othernum")
            $("#speed1").html(speed[0])
            $("#speed1").addClass("othernum")
            break;
        case 3:
            $("#speed0").html(speed[2])
            $("#speed0").addClass("othernum")
            $("#speed1").html(speed[1])
            $("#speed1").addClass("othernum")
            $("#speed2").html(speed[0])
            $("#speed2").addClass("othernum")
            break;
    }
 }


/**
 * @param {String} icon 
 * @param {String} color
 * Icon id'sini ve renk değerini (hex veya rgb) alır, verilen değerlere göre icon rengi değiştirir.
 * ÖRN: SetCarIcon("seatbelt", "#ff3030")
 * Icon ID'leri : 
 * - headlight <- Farlar
 * - cruise <- Hız sabitleme
 * - engine <- Motor
 * - doors <- Kapılar
 * - trunk <- Bagaj
 * - seatbelt <- Emniyet kemeri
 */
const SetCarIcon = (icon,color) => {
    $(`#${icon}`).css({"fill":`${color}`})
}

/**
 * @param {Boolean} state 
 * true veya false alır, verilen değere göre body elementini açıp kapatır.
 */
const Show = (state) => {
    if (state) {
        $(".cusalhud-wrapper").css({"display": "flex"})
        $(".cusalhud").css({"display": "flex"})
    } else {
        $(".cusalhud-wrapper").css({"display": "none"})
        $(".cusalhud").css({"display": "none"})
    }
}