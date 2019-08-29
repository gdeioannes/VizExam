var c = document.getElementById("myCanvas");
var ctx = c.getContext("2d");

var dataArray = [];
var namePlayer = false;
var upDown = false;
var connectionTeams = false;
var nodeArray = [];
var milisecondsSpeed = 50;
var animate = setInterval(drawAnimate, milisecondsSpeed);
var countDrawIncrease = 500;
var countDrawInterval = countDrawIncrease;
var finishFlag = false;
var animateTeams = false;
var speedAnimate = 100;
var numberConnections = 0;
var yearData = document.getElementById('yearData');

//Charge the data for UI
changeData();

//Object Structure for nodes
function Node() {
    this.name = "NA";
    this.x = -1;
    this.y = -1;
    this.color = "";
    this.radius = 0;
    this.tradenum = 0;
    this.width = 0;
}


//Function that retrieves the data and create and fills the dataArray with the data for the specific query
function changeData() {
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
    upDown = document.getElementById('upDown').checked;
    animateTeams
    animateTeams = document.getElementById('animateTeams').checked;
    namePlayer = document.getElementById('namePlayer').checked;

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
                    dataArray.push(jsonStruc);

                    saveTeam = dataModel[j].Tm;
                } else {
                    saveTeam = dataModel[j].Tm;
                }

            }
            saveTeam = "";
        }
    }

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
    nodeArray = [];
    var maxTrade = 0;
    var minTrade = 1000000000;
    var radius = 5;
    var space = 3;
    var offsetX = 100;
    var totalSpace = window.innerWidth - offsetX * 2;

    for (var i = 0; i < teamColor.length; i++) {
        var team = teamColor[i];
        var myNode = new Node();
        myNode.name = team.from;
        //myNode.x = offsetX + (radius + space) * i * 2;
        myNode.y = 575;
        myNode.color = team.color;
        myNode.radius = radius;

        for (var j = 0; j < dataArray.length; j++) {
            if (myNode.name == dataArray[j].from || myNode.name == dataArray[j].to) {
                myNode.tradenum++;
            }
        }

        if (minTrade > myNode.tradenum) {
            minTrade = myNode.tradenum;
        }

        if (maxTrade < myNode.tradenum) {
            maxTrade = myNode.tradenum;
        }

        myNode.width = totalSpace * (maxTrade / dataArray.length);

        myNode.radius = (myNode.radius + 20) * ((myNode.tradenum - minTrade) / maxTrade);
        if (connectionTeams) {
            if (myNode.tradenum > 0) {
                nodeArray.push(myNode);
            }
        } else {
            nodeArray.push(myNode);
        }
    }

    for (var i = 0; i < nodeArray.length; i++) {
        nodeArray[i].x = offsetX + i * (totalSpace / nodeArray.length);
    }

    if (document.getElementById("connectionArrange").checked) {
        //Arrange Trade num Order
        nodeArray = nodeArray.sort((a, b) => (a.tradenum < b.tradenum) ? 1 : -1);

        for (var i = 0; i < nodeArray.length; i++) {
            nodeArray[i].x = offsetX + i * (totalSpace / nodeArray.length);
        }
    }
}

function drawAnimate() {
    c.width = c.width;
    finishFlag = true;
    //Draw connections
    for (var i = 0; i < countDrawInterval; i++) {
        var countFT = 0;
        var saveFromX = 0;
        var saveToX = 0;
        var nodeColor = "";
        var linewith = "";
        for (var j = 0; j < nodeArray.length; j++) {

            if (dataArray[i].from == nodeArray[j].name) {
                saveFromX = nodeArray[j].x;
                countFT++;
            }

            if (dataArray[i].to == nodeArray[j].name) {
                saveToX = nodeArray[j].x;
                countFT++;
            }

            if (countFT == 2) {
                nodeColor = dataArray[i].color;
                linewith = dataArray[i].connectionNum;
                break;
            }
        }

        ctx.beginPath();
        var max = Math.max(saveFromX, saveToX);
        var min = Math.min(saveFromX, saveToX);
        var mid = Math.min(saveFromX, saveToX) + (Math.max(saveFromX, saveToX) - Math.min(saveFromX, saveToX)) / 2;
        if (animateTeams) {
            if (upDown) {
                if (linewith % 2) {
                    ctx.arc(mid, 575, (max - min) / 2, 0, Math.PI * 1, true);
                } else {
                    ctx.arc(mid, 575, (max - min) / 2, Math.PI * 1, Math.PI * 2, true);
                }
            }
            if (saveFromX > saveToX) {
                ctx.arc(mid, 575, (max - min) / 2, Math.PI * (1 + dataArray[i].radDraw), Math.PI, true);
            } else {
                ctx.arc(mid, 575, (max - min) / 2, -dataArray[i].radDraw * Math.PI, 0, 0);
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
            countDrawInterval = dataArray.length - 1;
            ctx.arc(mid, 575, (max - min) / 2, 0, Math.PI * 1, true);
        }

        ctx.lineWidth = linewith * 0.5;
        ctx.strokeStyle = nodeColor;
        ctx.textAlign = "center";
        ctx.stroke();
        ctx.fillStyle = "#000";
        if (namePlayer) {
            ctx.fillText(dataArray[i].playerName + " " + (linewith + 1), mid, 625 - (max - min) / 2);
        }

        if (!dataArray[i].finishDraw) {
            finishFlag = false;
        }
    }

    //Draw Node
    for (var i = 0; i < nodeArray.length; i++) {
        var node = nodeArray[i];
        ctx.beginPath();
        ctx.fillStyle = node.color;
        ctx.save();
        ctx.translate(node.x - 5, node.y + 45);
        ctx.rotate(Math.PI * 0.5);
        ctx.fillText(node.name, 0, 0);
        ctx.restore();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2, true);
        ctx.fill();
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

    return "rgba(" + Math.round(valuesRGB[0]) + "," + Math.round(valuesRGB[1]) + "," + Math.round(valuesRGB[2]) + "," + (opacityLine / 100) + ")";
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
