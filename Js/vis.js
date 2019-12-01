var c = document.getElementById("myCanvas");
var ctx = c.getContext("2d");

c.width = window.innerWidth;
c.height = window.innerHeight;
// SaveCanvas
var imgData;

//Data Vars
var dataArray = [];
var teamsArray = [];
var teamsDictionary = [];
var playerInRange = [];
var playersNotTraded = [];
var playersNotTradedInfo = [];
var playerSelected = [];

//Mouse
var mousePosX = 0;
var mousePosY = 0;
var mouseDown = false;
var mouseUp = false;

//UI Vars
var animateTeams = false;
var namePlayer = false;
var connectionTeams = false;
var fillConnection = false;
var colorPlayer = false;
var neverTraded = false;
var onlyDrawSelected = false;
var selectPlayerMouse = false;
var deSelectPlayerMouse = false;
var teamFullName = false;
var connectionsOverTeams = false;

//Drawing and Animation Vars
var speedAnimation = 100;
var milisecondsSpeed = 50;
//Store Interval Object
var animate;
//Number of connections to animate at the same time
var numberConnections = 500;
var zoom = 0;

//This variable tracks how many connections are animated at the same time
var countDrawInterval = numberConnections;
var yearData = document.getElementById('yearData');
var counterTotalConnections = 0;
var finishFlag = false;
//CanvasDrawing vars
var offsetX = 200;
var posNodesY = window.innerHeight * 0.875;

//Initialize Functions
changeData();
addOptionSelectors();
getPlayersNeverTraded();

//Function that retrieves the data and create and fills the dataArray with the data for the specific query
function changeDataAndSelector() {
    changeData();
    drawAnimate();
    addOptionSelectors();
}

//Function Callers when the drawing multiselect changes
function setValuesMultiSelect() {
    var valuesMultiSelect = $('#multiselect1').val();
    fillConnection = false;
    namePlayer = false;
    colorPlayer = false;
    animateTeams = false;
    connectionTeams = false;
    neverTraded = false;
    onlyDrawSelected = false;
    selectPlayerMouse = false;
    deSelectPlayerMouse = false;
    teamFullName = false;
    connectionsOverTeams = false;
    if (valuesMultiSelect != null) {
        for (var i = 0; i < valuesMultiSelect.length; i++) {
            var value = valuesMultiSelect[i];
            if (value == "connectionTeams") {
                connectionTeams = true;
            }
            if (value == "fillConnection") {
                fillConnection = true;
            }
            if (value == "namePlayer") {
                namePlayer = true;
            }
            if (value == "colorPlayer") {
                colorPlayer = true;
            }
            if (value == "animateTeams") {
                clearInterval(animate);
                animate = setInterval(drawAnimate, milisecondsSpeed);
                animateTeams = true;
            }
            if (value == "neverTraded") {
                neverTraded = true;
            }
            if (value == "onlyDrawSelected") {
                onlyDrawSelected = true;
            }
            if (value == "deSelectPlayerMouse") {
                deSelectPlayerMouse = true;
            }
            if (value == "selectPlayerMouse") {
                selectPlayerMouse = true;
            }
            if (value == "teamFullName") {
                teamFullName = true;
            }
            if (value == "connectionsOverTeams") {
                connectionsOverTeams = true;
            }
        }
    }
}

function changeData() {
    //Set Vars Values
    counterTotalConnections = 0;
    dataArray = [];
    teamsDictionary = [];
    //Stores player in range for Select
    playerInRange = [];
    var dataRangesYear = getDataRanges();

    var firstAge = parseInt(document.getElementById('firstAge').value);
    var endAge = parseInt(document.getElementById('endAge').value);
    var opacityLine = parseInt(document.getElementById('opacityLine').value);
    numberConnections = parseInt(document.getElementById('numberConnections').value);
    speedAnimation = parseInt(document.getElementById('speedAnimation').value);

    setValuesMultiSelect();

    console.log("Debug Begin");
    for (var i = 0; i < dataRangesYear.length; i++) {
        dataRangeYear = dataRangesYear[i];
        var firstYear = dataRangeYear.from;
        var endYear = dataRangeYear.to;
        console.log("D-Year F:" + firstYear + " Year E:" + endYear);

        //Filter to track Player Info at a time
        var nameCounter = 0;
        for (var j = nameCounter; j < dataModelNames.length; j++) {
            //Record the name of the player, the team is set empty and the connection 
            //is set to 0
            var name = dataModelNames[j].playerName;
            var saveTeam = "";
            var connectionNum = 0;
            if (nameCounter < dataModelNames.length) {
                nameCounter++;
            } else {
                break;
            }
            for (var k = 0; k < dataModel.length; k++) {

            }

        }
    }

    console.log("Debug End");

    //Get Years Range Selection
    for (var yearCount = 0; yearCount < dataRangesYear.length; yearCount++) {
        dataRangeYear = dataRangesYear[yearCount];
        var firstYear = dataRangeYear.from;
        var endYear = dataRangeYear.to;
        console.log("Year F:" + firstYear + " Year E:" + endYear);
        //Filter to track Player Info at a time
        var nameCounter = 0;
        for (var j = 0; j < dataModelNames.length; j++) {
            var name = dataModelNames[j].playerName;
            var saveTeam = "";
            var connectionNum = 0;

            for (var i = nameCounter; i < dataModel.length; i++) {
                nameCounter++;
                //Cover the list of seasons 
                var dataM = dataModel[nameCounter];
                //Filter by parameters
                //Skip TOT because is not a team, is the average of a player when play in two or more teams in one season
                if (dataM.tm == "TOT") {
                    continue;
                }

                if (!(name == dataM.playerName)) {
                    //Data Models are sorted By Names
                    break;
                }

                if (!(dataM.year >= dataRangeYear.from && dataM.year <= dataRangeYear.to)) {
                    continue;
                }

                pushToNamesRange(name);

                if ((dataM.age >= firstAge && dataM.age <= endAge)) {

                    if (dataM.tm != saveTeam && saveTeam != "") {

                        var yearColor = "";

                        var valuesRGB = getGradientColor(dataRangeYear.color_from, dataRangeYear.color_to, endYear, firstYear, parseInt(dataM.year), opacityLine, dataM.playerName);

                        yearColor = valuesRGB;

                        if (colorPlayer) {
                            yearColor = dataModelNameDic[dataM.playerName].color;
                        }

                        var jsonStruc = {
                            "from": saveTeam,
                            "to": dataM.tm,
                            "playerName": dataM.playerName,
                            "year": dataM.year,
                            "value": 1,
                            "color": yearColor,
                            "connectionNum": connectionNum,
                            "age": dataM.age,
                            "radDraw": 0,
                            "finishDraw": false,
                            "increaseSpeedDraw": (0.01 + (0.05 * Math.random())),
                            "directionCharLeft": "<",
                            "directionCharRight": ">",
                            "mouseSelected": false
                        }

                        if (playerSelected.includes(jsonStruc.playerName) && onlyDrawSelected) {
                            dataArray.push(jsonStruc);
                            nameCounter++;
                            connectionNum++;
                            counterTotalConnections++;
                        }

                        if (!onlyDrawSelected) {

                            dataArray.push(jsonStruc);
                            nameCounter++;
                            connectionNum++;
                            counterTotalConnections++;
                        }
                    }
                    saveTeam = dataM.tm;
                } else {
                    saveTeam = dataM.tm;
                }

            }
            saveTeam = "";
        }
    }

    //Set Variable from Drawing in case the amount pick is larger than the length
    if (numberConnections > dataArray.length) {
        numberConnections = dataArray.length;
    }
    createNode();
    drawAnimate();
    $("#connectionNum").html(counterTotalConnections);
}

function pushToNamesRange(name) {
    if (!playerInRange.includes(name)) {
        playerInRange.push(name);
    }
}

function createNode() {
    createNodes();
    dataArray = dataArray.sort((a, b) => (a.year > b.year) ? 1 : -1);
    countDrawInterval = numberConnections;
}

function createNodes() {
    teamsArray = [];
    var maxTrade = 0;
    var minTrade = 1000000000;
    var radius = 5;
    //Arrange in canvas space
    var totalSpace = window.innerWidth - offsetX * 2;
    var sumSpace = offsetX;
    var nodeSpace = 10;
    totalSpace = totalSpace - nodeSpace * teamsData.length;

    for (var i = 0; i < teamsData.length; i++) {
        var team = teamsData[i];
        team.trade_num = 0;
    }

    for (var i = 0; i < teamsData.length; i++) {
        var team = teamsData[i];

        //Count Trades in the team
        for (var j = 0; j < dataArray.length; j++) {
            if (team.id == dataArray[j].from || team.id == dataArray[j].to) {
                team.trade_num = team.trade_num + 1;
            }
        }

        team.y = posNodesY;
        team.radius = radius;

        if (minTrade > team.trade_num) {
            minTrade = team.trade_num;
        }

        if (maxTrade < team.trade_num) {
            maxTrade = team.trade_num;
        }

        if (connectionTeams && team.trade_num <= 0) {
            continue;
        }
        team.order = i;
    }
    if (connectionTeams) {
        for (var i = 0; i < teamsData.length; i++) {
            var team = teamsData[i];
            if (team.trade_num > 0) {
                teamsArray.push(team);
                teamsDictionary[team.id] = team;
            }
        }
    } else {
        for (var i = 0; i < teamsData.length; i++) {
            if (teamsData[i].id != "TOT") {
                var team = teamsData[i];
                teamsArray.push(team);
                teamsDictionary[team.id] = team;
            }
        }
    }
    sortNodes();
    totalSpace = window.innerWidth - offsetX * 2;
    sumSpace = offsetX;
    nodeSpace = 10;
    totalSpace = totalSpace - nodeSpace * teamsArray.length;
    for (var i = 0; i < teamsArray.length; i++) {
        var team = teamsArray[i];
        team.width = nodeSpace + (totalSpace * ((team.trade_num / 2) / counterTotalConnections));
        var diff = team.width / 2;
        team.x = sumSpace;
        sumSpace += team.width;
    }
}

function drawAnimate() {
    //c.width = c.width;
    finishFlag = true;
    drawClearRect();
    //Draw connections
    drawConnections();
    drawPlayersNeverTraded();
    drawFillLine();
    drawNodes();
    if (!animateTeams) {
        drawConnectionOverTeams();
    }
    if (finishFlag) {
        clearInterval(animate);
    }
    imgData = ctx.getImageData(0, 0, c.width, c.height);
}

function drawClearRect() {

    ctx.fillStyle = "rgba(255,255,255,1)";
    ctx.rect(0, 0, window.innerWidth, window.innerHeight);
    ctx.fill();
}

function putSaveImage() {
    ctx.putImageData(imgData, 0, 0);
}

function drawConnections() {
    for (var i = 0; i < countDrawInterval; i++) {
        var countFT = 0;
        var saveFrom = 0;
        var saveTo = 0;
        var nodeColor = "";
        var linewith = 0;
        //Check the data from and to and save Values
        saveFrom = teamsDictionary[dataArray[i].from];
        saveTo = teamsDictionary[dataArray[i].to];
        nodeColor = dataArray[i].color;
        linewith = dataArray[i].connectionNum;

        var max = Math.max(saveFrom.x + saveFrom.width / 2, saveTo.x + saveTo.width / 2);
        var min = Math.min(saveFrom.x + saveFrom.width / 2, saveTo.x + saveTo.width / 2);
        var mid = min + (max - min) / 2;

        //Team Ratio Connection offset
        var teamRCOffset = 0;
        //Direction Char

        if (saveFrom.x > saveTo.x) {
            //Draw Arc to the Left
            dataArray[i].directionCharRight = "";
            dataArray[i].directionCharLeft = ">";
        } else {
            dataArray[i].directionCharRight = "<";
            dataArray[i].directionCharLeft = "";
        }
        if (animateTeams) {

            if (saveFrom.x > saveTo.x) {
                //Draw Arc to the Left
                ctx.beginPath();
                ctx.arc(mid - teamRCOffset, saveFrom.y, (max - min) / 2, Math.PI * (1 + dataArray[i].radDraw), Math.PI, true);
                ctx.strokeStyle = nodeColor;
                ctx.stroke();
                ctx.lineWidth = linewith * 0.5;
                ctx.closePath();

            } else {
                //Draw Arc to the Rigth
                ctx.beginPath();
                ctx.arc(mid - teamRCOffset, saveFrom.y, (max - min) / 2, -dataArray[i].radDraw * Math.PI, 0, 0);
                ctx.strokeStyle = nodeColor;
                ctx.stroke();
                ctx.lineWidth = linewith * 0.5;
                ctx.closePath();

            }
            if (dataArray[i].radDraw < 1) {
                dataArray[i].radDraw += dataArray[i].increaseSpeedDraw / (100 / speedAnimation);

            }
            if (dataArray[i].radDraw > 1) {
                dataArray[i].radDraw = 1;
                dataArray[i].finishDraw = true;
                if (countDrawInterval + 1 <= dataArray.length) {
                    countDrawInterval++;
                    $(yearData).html("Year " + dataArray[i].year);
                }
            }

        } else {
            countDrawInterval = dataArray.length;
            ctx.beginPath();
            ctx.arc(mid - teamRCOffset, saveTo.y, (max - min) / 2, 0, Math.PI * 1, true);
            ctx.strokeStyle = nodeColor;
            ctx.stroke();
            ctx.lineWidth = linewith * 0.5;
            dataArray[i].finishDraw = true;
            finishFlag = true;
        }

        if (fillConnection) {
            ctx.fillStyle = nodeColor;
            ctx.fill();
        }

        if (playerSelected.includes(dataArray[i].playerName) || namePlayer || dataArray[i].mouseSelected) {
            ctx.beginPath();
            ctx.textAlign = "center";
            ctx.fillStyle = "#000000";
            ctx.fillText(dataArray[i].directionCharRight + " " + dataArray[i].playerName + " " + dataArray[i].directionCharLeft + " " + dataArray[i].age + " / " + (dataArray[i].connectionNum + 1 + " " + dataArray[i].year), mid, saveFrom.y - (max - min) / 2 - 4);
            ctx.closePath();
        }
        if (!dataArray[i].finishDraw) {
            finishFlag = false;
        }

    }
}

function drawNodes() {
    //Draw Node
    for (var i = 0; i < teamsArray.length; i++) {
        var team = teamsArray[i];
        ctx.beginPath();
        ctx.fillStyle = "#" + team.color_1;
        ctx.rect(team.x, team.y, team.width, 20);
        ctx.save();
        ctx.translate(team.x - 5 + team.width / 2, team.y + 30);
        if (teamFullName) {
            ctx.rotate(Math.PI * 0.25);
        } else {
            ctx.rotate(Math.PI * 0.5);
        }
        ctx.textAlign = "left"
        var name = ""
        if (teamFullName) {
            name = teamsDictionary[team.id].team_name;
        } else {
            name = team.id;
        }
        ctx.fillText(name, 0, 0);
        ctx.restore();
        ctx.fill();
        ctx.closePath();
    }
}

function drawFillLine() {
    //Draw reference line for fill once
    if (fillConnection) {
        var radiusMark = (teamsArray[teamsArray.length - 1].x - teamsArray[0].x) / 2;
        var posX = teamsArray[0].x + radiusMark + (teamsArray[0].width / 2) + (teamsArray[teamsArray.length - 1].width / 2) - (teamsArray[0].width / 2);
        var posY = teamsArray[0].y;
        ctx.beginPath();
        ctx.strokeStyle = "#CCC";
        ctx.strokeWidth = 0.1;
        ctx.arc(posX, posY, radiusMark, 0, 1 * Math.PI, true);
        ctx.stroke();
        ctx.closePath();
    }
}

function drawPlayersNeverTraded() {
    for (var i = 0; i < playersNotTradedInfo.length; i++) {
        if (playerSelected.includes(playersNotTraded[i])) {
            var data = playersNotTradedInfo[i].from;
            var teamSelect = teamsDictionary[data];
            var x = teamSelect.x + teamSelect.width / 2;
            var y = teamSelect.y;

            ctx.beginPath();
            ctx.strokeWidth = 1;
            ctx.moveTo(x, y);
            ctx.lineTo(x, y - 20);
            ctx.strokeStyle = "#000000";
            ctx.stroke();
            ctx.closePath();
            ctx.fillStyle = "#000000";
            ctx.fillText(playersNotTraded[i], x, y - 25);
            //ctx.arc(100, 100, 3, 0, Math.PI * 2, true)
            ctx.fill();
        }
    }


}

function getGradientColor(color1, color2, endYear, firstYear, currentYear, opacityLine, playerName) {
    color1 = getRGBArray(color1);
    color2 = getRGBArray(color2);

    var valuesRGB = [0, 0, 0];
    var yearRange = (endYear - firstYear);
    var yearPos = currentYear - firstYear;
    var percent = (yearPos / yearRange);
    //Calculate gradients
    for (var colorNum = 0; colorNum < valuesRGB.length; colorNum++) {
        if (color1[colorNum] > color2[colorNum]) {
            valuesRGB[colorNum] = color1[colorNum] - percent * (color1[colorNum] - color2[colorNum]);
        } else {
            valuesRGB[colorNum] = color1[colorNum] + percent * (color2[colorNum] - color1[colorNum]);
        }
    }

    if (yearRange == 0) {
        valuesRGB = [color1[0], color1[1], color1[2]];
    }

    if (fillConnection) {
        var treshOpacity = ((0.01 + (1 / counterTotalConnections)) / (100 / opacityLine));

        if (treshOpacity == Infinity) {
            treshOpacity = 0.01;
        }
        var rgbaColor = "rgba(" + Math.round(valuesRGB[0]) + "," + Math.round(valuesRGB[1]) + "," + Math.round(valuesRGB[2]) + "," + treshOpacity + ")";
    } else {

        if (playerSelected.includes(playerName)) {
            opacityLine = 100;
        }

        var rgbaColor = "rgba(" + Math.round(valuesRGB[0]) + "," + Math.round(valuesRGB[1]) + "," + Math.round(valuesRGB[2]) + "," + (opacityLine / 100) + ")";
    }
    return rgbaColor;
}

function getRGBArray(rgb) {
    var rgb = rgb.substring(4, rgb.length - 1)
        .replace(/ /g, '')
        .split(',');

    return rgb;
}

$(".nba-filter").change(function () {
    changeData();
});

function sortNodes() {
    var key = $('#sortSelector').val();
    switch (key) {
        case "old_new":
            teamsArray = teamsArray.sort((a, b) => (a.year_1 > b.year_1) ? 1 : -1);
            break;

        case "trade_num":
            teamsArray = teamsArray.sort((a, b) => (a.trade_num > b.trade_num) ? 1 : -1);
            break;

        case "min_temp":
            teamsArray = teamsArray.sort((a, b) => (a.min_temp > b.min_temp) ? 1 : -1);
            break;

        case "max_temp":
            teamsArray = teamsArray.sort((a, b) => (a.max_temp > b.max_temp) ? 1 : -1);
            break;

        case "avg_temp":
            teamsArray = teamsArray.sort((a, b) => (a.avg_temp > b.avg_temp) ? 1 : -1);
            break;

        case "champ_wins":
            teamsArray = teamsArray.sort((a, b) => (a.champ_wins > b.champ_wins) ? 1 : -1);
            break;
    }
}

function addOptionSelectors() {

    var options = [];

    for (var i = 0; i < playerInRange.length; i++) {
        var option = "";
        if (playerSelected.includes(playerInRange[i])) {
            option = '<option value="' + playerInRange[i] + '" selected>' + playerInRange[i] + '</option>';
        } else {
            option = '<option value="' + playerInRange[i] + '">' + playerInRange[i] + '</option>';
        }
        options.push(option);
    }
    _options = options.join('');
    $('#playerSelect').html(_options);
    $('#playerSelect').selectpicker('refresh');
}

$('#playerSelect').change(function () {
    $('#playerSelect').selectpicker('refresh');
    var playerSelectedHtml = $('#playerSelect').val();
    playerSelected = playerSelectedHtml;
    if (playerSelected == null) {
        playerSelected = [];
    }
    changeData();
});

function getPlayersNeverTraded() {
    var nameCounter = 0;
    for (var i = 0; i < dataModelNames.length; i++) {
        var name = dataModelNames[i].Name;
        var saveTeam = "";
        var connectionNum = 0;
        var flagNoConnection = false;
        //Cover the list of seasons 
        while (nameCounter < dataModel.length - 1) {
            nameCounter++;
            if (saveTeam == "") {
                saveTeam = dataModel[nameCounter].tm;
                continue;
            }
            if (saveTeam != dataModel[nameCounter].tm) {
                connectionNum++;
            }
            if (name != dataModel[nameCounter].playerName) {
                break
            }
        }
        if (connectionNum <= 1) {
            var info = {
                "from": saveTeam,
                "name": name
            }
            playersNotTradedInfo.push(info);
            playersNotTraded.push(name);
        }
    }
}

$("#numberConnections").change(function () {
    numberConnections = parseInt($("#numberConnections").val());
    if ((countDrawInterval + numberConnections) < dataArray.length) {
        countDrawInterval += numberConnections;
    } else {
        countDrawInterval = dataArray.length;
    }
});

$("#speedAnimation").change(function () {
    speedAnimation = parseInt($("#speedAnimation").val());
});

setInterval(drawSelectorSquare, 30);

var saveMousePosX = 0;
var saveMousePosY = 0;

function drawSelectorSquare() {

}

$("#myCanvas").mousedown(function () {
    mouseDown = true;
    mouseUp = false;
});

$("#myCanvas").mouseup(function () {
    mouseDown = false;
    mouseUp = true;

    for (var i = 0; i < dataArray.length; i++) {
        var data = dataArray[i];
        var dataFrom = teamsDictionary[dataArray[i].from];
        var dataTo = teamsDictionary[dataArray[i].to];
        var dataX = dataFrom.x + Math.abs(dataTo.x - dataFrom.x) / 2;
        var dataW = Math.abs(dataTo.x - dataFrom.x) / 2;

        var catOne = Math.pow(dataX - saveMousePosX, 2);
        var catTwo = Math.pow(dataFrom.y - saveMousePosY, 2);
        var distance = Math.sqrt(catTwo + catOne);

        var mouseW = Math.sqrt(Math.pow((mousePosX - saveMousePosX), 2) + Math.pow((mousePosY - saveMousePosY), 2));

        if ((distance - dataW - mouseW) < 0 && distance + mouseW > dataW) {

            if (!selectPlayerMouse && !deSelectPlayerMouse) {
                data.mouseSelected = true;
            }

            if (selectPlayerMouse && !deSelectPlayerMouse && !playerSelected.includes(data.playerName)) {
                playerSelected.push(data.playerName);
            }

            if (deSelectPlayerMouse && playerSelected.includes(data.playerName)) {
                playerSelected = playerSelected.filter(e => e !== data.playerName);
            }
        } else {
            data.mouseSelected = false;
        }
    }
    if (deSelectPlayerMouse || selectPlayerMouse) {
        changeDataAndSelector();
    }

    drawAnimate();
});

$("#myCanvas").mousemove(function (event) {
    mousePosX = event.pageX;
    mousePosY = event.pageY;

    if (mouseDown) {
        putSaveImage();
        ctx.beginPath()
        ctx.strokeStyle = "#FF0000";
        ctx.strokeWidth = 5;
        ctx.arc(saveMousePosX, saveMousePosY, Math.sqrt(Math.pow((mousePosX - saveMousePosX), 2) + Math.pow((mousePosY - saveMousePosY), 2)), 0, Math.PI * 2, false);
        ctx.stroke();
    } else {
        saveMousePosX = mousePosX;
        saveMousePosY = mousePosY;
    }
});

$("#rangeZoom").change(function () {
    var zoom = $("#rangeZoom").val();
    offsetX = 200 - zoom * 10;
    changeData();
});

function drawConnectionOverTeams() {
    var dataTeamsConnections = [];
    var dataTeamsTrades = [];
    var playersDic = [];
    var countTotalConnections = 0;


    for (var i = 0; i < dataModelNames.length; i++) {
        var dic = {
            "tradeNum": 0

        }
        playersDic[dataModelNames[i].playerName] = dic;
    }

    for (var i = 0; i < teamsArray.length; i++) {
        var dic = {
            "tradeNum": 0

        }
        dataTeamsTrades[teamsArray[i].id] = dic;
        for (var j = 0; j < teamsArray.length; j++) {
            var dicConnection = {
                "tradeNum": 0
            }
            dataTeamsConnections[teamsArray[i].id + teamsArray[j].id] = dicConnection;
        }
    }

    var max = 0;
    var playerName = 0;
    for (var i = 0; i < dataArray.length; i++) {
        var con = dataTeamsConnections[dataArray[i].from + dataArray[i].to];
        con.tradeNum = con.tradeNum + 1;
        var team = dataTeamsTrades[dataArray[i].from];
        team.tradeNum = team.tradeNum + 1;
        var player = playersDic[dataArray[i].playerName];
        player.tradeNum = player.tradeNum + 1;
        if (max < player.tradeNum) {
            playerName = dataArray[i].playerName;
            max = player.tradeNum;
        }
        countTotalConnections++;
    }

    var playerCounter = 0;
    for (var key in playersDic) {
        if (playersDic[key].tradeNum > 0) {
            playerCounter++;
        }
    }

    var yearStatsArray = [];
    var sumCheck = 0;
    for (var i = 18; i < 44; i++) {
        yearStatsArray[i] = 0;
        for (var ii = 0; ii < dataArray.length; ii++) {
            if (dataArray[ii].age == i && !playersNotTraded.includes(dataArray[ii].playerName)) {
                yearStatsArray[i] = yearStatsArray[i] + 1;
                sumCheck++;
            }
        }

    }

    var avg = Math.round(countTotalConnections / playerCounter * 100) / 100;
    var x = offsetX;
    var y = 300;
    var offSetText = 15;
    ctx.textAlign = "left";
    ctx.fillStyle = "#000000";
    ctx.fillText("Max Trades:" + max, x, y);
    ctx.fillText("Player:" + playerName, x, y + offSetText);
    ctx.fillText("Avg trades:" + avg, x, y + offSetText * 2);
}



/*var firstTeam = teamsArray[i];
 var lastTeam = teamsArray[teamsArray.length - i - 1];
 drawfromTo(firstTeam, lastTeam);*/

function drawfromTo(firstTeam, lastTeam) {

    var c1X = firstTeam.x + ((lastTeam.x - firstTeam.x) + lastTeam.width) / 2;
    var c1Y = firstTeam.y;
    var c1W = (lastTeam.x - firstTeam.x + lastTeam.width) / 2;

    var c2X = (firstTeam.x + firstTeam.width) + (lastTeam.x - (firstTeam.x + firstTeam.width)) / 2;
    var c2Y = firstTeam.y;
    var c2W = lastTeam.x - (firstTeam.x + firstTeam.width);

    ctx.beginPath();
    ctx.arc(c1X, c1Y, c1W, 0, 1 * Math.PI, true);
    ctx.arc(c2X, c2Y, c2W / 2, Math.PI, 2 * Math.PI, false);
    ctx.fillStyle = "#" + firstTeam.color_1;
    ctx.fill();
    ctx.closePath();
}
