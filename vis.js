var c = document.getElementById("myCanvas");
var ctx = c.getContext("2d");

//Data Vars
var dataArray = [];
var teamsArray = [];
//UI Vars
var animateTeams = false;
var namePlayer = false;
var connectionTeams = false;
var fillConnection = false;
//Drawing and Animation Vars
var speedAnimate = 100;
var milisecondsSpeed = 50;
var animate = setInterval(drawAnimate, milisecondsSpeed);
var countDrawIncrease = 500;
var countDrawInterval = countDrawIncrease;
var numberConnections = 0;
var finishFlag = false;
var yearData = document.getElementById('yearData');
//Debug vars
var counterTotalConnections = 0;
var connectionNum = document.getElementById('connectionNum')
var offsetX = 130;
var posNodesY = window.innerHeight * 0.875;
//Charge the data for UI
changeData();

//Function that retrieves the data and create and fills the dataArray with the data for the specific query
function changeData() {
    counterTotalConnections = 0;
    console.log("Change Data Begins");
    dataArray = [];
    var dataRangesYear = getDataRanges();
    var firstAge = parseInt(document.getElementById('firstAge').value);
    var endAge = parseInt(document.getElementById('endAge').value);
    var colorPlayer = document.getElementById('colorPlayer').checked;
    var opacityLine = parseInt(document.getElementById('opacityLine').value);
    numberConnections = parseInt(document.getElementById('numberConnections').value);
    speedAnimate = parseInt(document.getElementById('speedAnimate').value);
    connectionTeams = document.getElementById('connectionTeams').checked;
    animateTeams = document.getElementById('animateTeams').checked;
    namePlayer = document.getElementById('namePlayer').checked;
    fillConnection
    fillConnection = document.getElementById('fillConnection').checked;

    countDrawIncrease = numberConnections;

    //Get Years Range Selection
    for (var ii = 0; ii < dataRangesYear.length; ii++) {
        console.log("Data Year Range " + ii);

        dataRangeYear = dataRangesYear[ii];
        var firstYear = dataRangeYear.from;
        var endYear = dataRangeYear.to;
        //Filter to track Player Info at a time
        var nameCounter = 0;
        for (var i = 0; i < dataModelNames.length; i++) {
            var saveTeam = "";
            var connectionnum = 0;

            //Cover the list of seasons 
            for (var j = nameCounter; j < dataModel.length; j++) {
                nameCounter++;
                //console.log("Data Model Season " + dataModel[j].Player);
                //Filter by parameters

                //Skip TOT because is not a team, is the average of a player when play in two or more teams in one season
                if (dataModel[j].Tm == "TOT") {
                    continue;
                }

                if (!(dataModelNames[i].Name == dataModel[j].Player)) {
                    //Data Models are sorted By Names
                    break;
                }

                if (!(dataModel[j].Year >= dataRangeYear.from && dataModel[j].Year <= dataRangeYear.to)) {
                    continue;
                }

                if (!(dataModel[j].Age >= firstAge && dataModel[j].Age <= endAge)) {
                    continue;
                }

                if (dataModel[j].Tm != saveTeam && saveTeam != "") {

                    var yearColor = "";

                    var valuesRGB = getGradientColor(dataRangeYear.color_from, dataRangeYear.color_to, endYear, firstYear, parseInt(dataModel[j].Year), opacityLine);

                    yearColor = valuesRGB;

                    if (colorPlayer) {
                        yearColor = dataModelNameDic[dataModel[j].Player].color;
                    }

                    var jsonStruc = {
                        "from": saveTeam,
                        "to": dataModel[j].Tm,
                        "playerName": dataModel[j].Player,
                        "year": dataModel[j].Year,
                        "value": 1,
                        "color": yearColor,
                        "connectionNum": connectionnum,
                        "radDraw": 0,
                        "finishDraw": false,
                        "increaseSpeedDraw": (0.01 + (0.05 * Math.random()))
                    }
                    connectionnum++;
                    counterTotalConnections++;
                    dataArray.push(jsonStruc);

                    saveTeam = dataModel[j].Tm;
                } else {
                    saveTeam = dataModel[j].Tm;
                }

            }
            saveTeam = "";
        }
    }
    $(connectionNum).html(counterTotalConnections);
    //Set Variable from Drawing in case the amount pick is larger than the length
    if (countDrawIncrease > dataArray.length) {
        countDrawIncrease = dataArray.length;
    }

    console.log("End Process Json");
    createNode();
}

function createNode() {
    createNodes();
    dataArray = dataArray.sort((a, b) => (a.year > b.year) ? 1 : -1)

    c.width = window.innerWidth;
    c.height = window.innerHeight;
    countDrawInterval = countDrawIncrease;
    clearInterval(animate);
    animate = setInterval(drawAnimate, milisecondsSpeed);
}

function createNodes() {
    teamsArray = [];
    console.log("Total Connections:" + counterTotalConnections);
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

        team.radius = (team.radius + 20) * ((team.trade_num - minTrade) / maxTrade);

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
            }
        }
    } else {
        for (var i = 0; i < teamsData.length; i++) {
            var team = teamsData[i];
            teamsArray.push(team);
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
    console.log("Drawing");
    c.width = c.width;
    finishFlag = true;

    //Draw connections
    for (var i = 0; i < countDrawInterval; i++) {
        var countFT = 0;
        var saveFrom = 0;
        var saveTo = 0;
        var nodeColor = "";
        var linewith = 0;
        for (var j = 0; j < teamsArray.length; j++) {
            var team = teamsArray[j];
            if (dataArray[i].from == team.id) {
                saveFrom = team;
                countFT++;
            }

            if (dataArray[i].to == team.id) {
                saveTo = team;
                countFT++;
            }

            if (countFT == 2) {
                nodeColor = dataArray[i].color;
                linewith = dataArray[i].connectionNum;
                break;
            }
        }
        ctx.save();
        ctx.beginPath();
        var max = Math.max(saveFrom.x + saveFrom.width / 2, saveTo.x + saveTo.width / 2);
        var min = Math.min(saveFrom.x + saveFrom.width / 2, saveTo.x + saveTo.width / 2);
        var mid = min + (max - min) / 2;
        //Team Ratio Connection offset
        var teamRCOffset = 0;
        if (animateTeams) {
            if (saveFrom.x > saveTo.x) {
                ctx.arc(mid - teamRCOffset, saveFrom.y, (max - min) / 2, Math.PI * (1 + dataArray[i].radDraw), Math.PI, true);
            } else {
                ctx.arc(mid - teamRCOffset, saveFrom.y, (max - min) / 2, -dataArray[i].radDraw * Math.PI, 0, 0);
            }

            if (dataArray[i].radDraw < 1) {
                dataArray[i].radDraw += dataArray[i].increaseSpeedDraw / (100 / speedAnimate);
                if (dataArray[i].radDraw > 1) {
                    dataArray[i].radDraw = 1;
                    dataArray[i].finishDraw = true;
                    if (countDrawInterval + 1 <= dataArray.length) {
                        countDrawInterval++;
                        $(yearData).html("Year " + dataArray[i].year);
                    }
                }
            }
        } else {
            countDrawInterval = dataArray.length;
            ctx.arc(mid - teamRCOffset, saveTo.y, (max - min) / 2, 0, Math.PI * 1, true);
            dataArray[i].finishDraw = true;
            finishFlag = true;
        }

        ctx.lineWidth = linewith * 0.5;
        ctx.strokeStyle = nodeColor;
        ctx.textAlign = "center";
        ctx.stroke();
        ctx.closePath();
        if (fillConnection) {
            ctx.fillStyle = nodeColor;
            ctx.fill();
            //Draw Border Line For comparizon
        }
        if (namePlayer) {
            ctx.fillText(dataArray[i].playerName + " " + (linewith + 1), mid, saveFrom.y - (max - min) / 2 - 4);
        }

        if (!dataArray[i].finishDraw) {
            finishFlag = false;
        }
        ctx.restore();
    }

    //DrawLine


    //Draw Node
    for (var i = 0; i < teamsArray.length; i++) {
        ctx.save();
        var team = teamsArray[i];
        ctx.beginPath();
        ctx.fillStyle = "#" + team.color_1;
        ctx.rect(team.x, team.y, team.width, 20);
        //ctx.arc(node.x + node.width / 2, node.y, node.width / 2, 0, Math.PI * 2, 0);
        ctx.save();
        //ctx.translate(node.x - 5 + node.width / 2, node.y + node.width / 2 + 20);
        ctx.translate(team.x - 5 + team.width / 2, team.y + 30);
        ctx.rotate(Math.PI * 0.5);
        ctx.textAlign = "left"
        ctx.fillText(team.id, 0, 0);
        ctx.restore();
        ctx.fill();
        ctx.closePath();
        ctx.restore();
    }

    //Draw reference line for fill once
    if (fillConnection) {
        ctx.save();
        var radiusMark = (teamsArray[teamsArray.length - 1].x - teamsArray[0].x) / 2;
        var posX = teamsArray[0].x + radiusMark + (teamsArray[0].width / 2) + (teamsArray[teamsArray.length - 1].width / 2) - (teamsArray[0].width / 2);
        var posY = teamsArray[0].y;
        ctx.beginPath();
        ctx.strokeStyle = "#CCC";
        ctx.strokeWidth = 0.1;
        ctx.arc(posX, posY, radiusMark, 0, 1 * Math.PI, true);
        ctx.stroke();
        ctx.closePath();
        ctx.restore();
    }

    if (finishFlag) {
        clearInterval(animate);
        console.log("End Draw");
    }
}


function getGradientColor(color1, color2, endYear, firstYear, currentYear, opacityLine) {
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

    if (fillConnection) {
        var rgbaColor = "rgba(" + Math.round(valuesRGB[0]) + "," + Math.round(valuesRGB[1]) + "," + Math.round(valuesRGB[2]) + "," + (0.01 + (1 / counterTotalConnections * 3)) + ")";
    } else {
        var rgbaColor = "rgba(" + Math.round(valuesRGB[0]) + "," + Math.round(valuesRGB[1]) + "," + Math.round(valuesRGB[2]) + "," + (opacityLine / 100) + ")";
    }


    console.log("Total Connections:" + counterTotalConnections);
    console.log("RGBA:" + rgbaColor);
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
    var key = document.getElementById('sortSelector').value;
    switch (key) {
        case "old_new":
            teamsArray = teamsArray.sort((a, b) => (a.order > b.order) ? 1 : -1);
            break;

        case "trade_num":
            console.log(key);
            teamsArray = teamsArray.sort((a, b) => (a.trade_num > b.trade_num) ? 1 : -1);
            break;

        case "min_temp":
            console.log(key);
            teamsArray = teamsArray.sort((a, b) => (a.min_temp > b.min_temp) ? 1 : -1);
            break;

        case "max_temp":
            console.log(key);
            teamsArray = teamsArray.sort((a, b) => (a.max_temp > b.max_temp) ? 1 : -1);
            break;

        case "avg_temp":
            console.log(key);
            teamsArray = teamsArray.sort((a, b) => (a.avg_temp > b.avg_temp) ? 1 : -1);
            break;

        case "champ_wins":
            console.log(key);
            teamsArray = teamsArray.sort((a, b) => (a.champ_wins > b.champ_wins) ? 1 : -1);
            break;
    }
}
