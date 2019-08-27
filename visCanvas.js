var dataArray = [];
var namePlayer = false;
changeData();

var saveSelectorValue = "";
var counter = 0;
var batchs = 40;
var batchsCounter = 1;

var c = document.getElementById("myCanvas");

var selectPlayerList = [];

function draw() {
    var maxTrade = 0;
    var minTrade = 1000000000;
    var nodeArray = [];
    var c = document.getElementById("myCanvas");
    var ctx = c.getContext("2d");

    c.width = window.innerWidth;
    c.height = window.innerHeight;
    c.width = c.width;
    var countDraws = 0;
    var radius = 5;
    var space = 3;
    var offsetX = 100;
    for (var i = 0; i < teamColor.length; i++) {
        var myNode = new Node();
        myNode.name = teamColor[i].from;
        myNode.x = offsetX + (radius + space) * i * 2;
        myNode.y = 575;
        myNode.color = teamColor[i].color;
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
        nodeArray.push(myNode);
    }
    console.log("Mintrade:" + minTrade);

    if (document.getElementById("connectionArrange").checked) {
        //Arrange Trade num Order
        nodeArray = nodeArray.sort((a, b) => (a.tradenum > b.tradenum) ? 1 : -1)


        for (var i = 0; i < nodeArray.length; i++) {
            nodeArray[i].x = offsetX + (radius + space) * i * 2;
        }
    }

    //Draw Node
    for (var i = 0; i < nodeArray.length; i++) {
        var node = nodeArray[i];
        countDraws++;
        ctx.beginPath();
        ctx.fillStyle = node.color;
        ctx.save();
        ctx.translate(node.x - 5, node.y + 25);
        ctx.rotate(Math.PI * 0.5);
        ctx.fillText(node.name, 0, 0);
        ctx.restore();
        ctx.arc(node.x, node.y, (node.radius + 20) * ((node.tradenum - minTrade) / maxTrade), 0, Math.PI * 2, true);
        ctx.fill();

    }


    for (var i = 0; i < dataArray.length; i++) {
        var countFT = 0;
        var saveFromX = 0;
        var saveToX = 0;
        var nodeRadius = 0;
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
                nodeRadius = nodeArray[j].radius;
                linewith = dataArray[i].connectionNum;
                break;
            }

        }
        if (saveToX != 0) {
            ctx.beginPath();
            var max = Math.max(saveFromX, saveToX);
            var min = Math.min(saveFromX, saveToX);
            var mid = Math.min(saveFromX, saveToX) + (Math.max(saveFromX, saveToX) - Math.min(saveFromX, saveToX)) / 2;
            /*
            if (linewith % 2) {
                ctx.arc(mid, 575, (max - min) / 2, 0, Math.PI * 1, true);
            } else {
                ctx.arc(mid, 575, (max - min) / 2, Math.PI * 1, Math.PI * 2, true);
            }*/

            ctx.arc(mid, 575, (max - min) / 2, 0, Math.PI * 1, true);
            //ctx.arc(mid, 575, (max - min) / 2, 0, Math.PI * 1, true);
            //ctx.moveTo(Math.min(saveFromX, saveToX), 400);
            //ctx.lineTo(Math.min(saveFromX, saveToX) + (Math.max(saveFromX, saveToX) - Math.min(saveFromX, saveToX)) / 2, (Math.max(saveFromX, saveToX) - Math.min(saveFromX, saveToX)));
            ctx.lineWidth = linewith * 0.5;
            //ctx.lineTo(Math.max(saveFromX, saveToX), 400);
            //ctx.strokeStyle = nodeColor;
            ctx.strokeStyle = nodeColor;
            ctx.textAlign = "center";
            ctx.stroke();
            ctx.fillStyle = "#000";
            if (namePlayer) {
                ctx.fillText(dataArray[i].playerName + " " + linewith, mid, 625 - (max - min) / 2);
            }


        }
        //ctx.closePath();
    }
}

function Node() {
    this.name = "NA";
    this.x = -1;
    this.y = -1;
    this.color = "";
    this.radius = 0;
    this.tradenum = 0;
}



function changeData() {
    dataArray = [];
    var firstAge = parseInt(document.getElementById('firstAge').value);
    var endAge = parseInt(document.getElementById('endAge').value);
    var playerSelector = document.getElementById('playerSelector').value;
    var colorPlayer = document.getElementById('colorPlayer').checked;
    namePlayer = document.getElementById('namePlayer').checked;
    saveSelectorValue = playerSelector;

    var playerFlag = true;
    if (playerSelector == "NA") {
        playerFlag = true;
    } else {
        playerFlag = false;
    }


    var dataRangesYear = getDataRanges();
    for (var ii = 0; ii < dataRangesYear.length; ii++) {
        dataRangeYear = dataRangesYear[ii];

        for (var i = 0; i < dataModelNames.length; i++) {
            var saveTeam = "";
            var connectionnum = 0;
            for (var j = 0; j < dataModel.length; j++) {
                if (playerSelector != "NA") {
                    if (playerSelector == dataModel[j].Player) {
                        playerFlag = true;
                    } else {
                        playerFlag = false;
                    }
                }


                if (dataModelNames[i].Name == dataModel[j].Player &&
                    dataModel[j].Year >= dataRangeYear.from && dataModel[j].Year <= dataRangeYear.to &&
                    dataModel[j].Age >= firstAge && dataModel[j].Age <= endAge) {
                    if (dataModel[j].Tm != "TOT" && playerFlag) {

                        firstYear = dataRangeYear.from;
                        endYear = dataRangeYear.to;
                        if (dataModel[j].Tm != saveTeam && saveTeam != "") {
                            var yearColor = "";

                            var color1 = getRGBArray(dataRangeYear.color_from);
                            var color2 = getRGBArray(dataRangeYear.color_to);

                            var yearRange = (endYear - firstYear);
                            var yearPos = parseInt(dataModel[j].Year) - firstYear;
                            var percent = (yearPos / yearRange);

                            var redColor;
                            var greenColor = 0;
                            var blueColor = 0;

                            if (color1[0] > color2[0]) {
                                redColor = color1[0] - percent * (color1[0] - color2[0]);
                            } else {
                                redColor = color1[0] + percent * (color2[0] - color1[0]);
                            }

                            if (color1[1] > color2[1]) {
                                greenColor = color1[1] - percent * (color1[1] - color2[1]);
                            } else {
                                greenColor = color1[1] + percent * (color2[1] - color1[1]);
                            }

                            if (color1[2] > color2[2]) {
                                blueColor = color1[2] - percent * (color1[2] - color2[2]);
                            } else {
                                blueColor = color1[2] + percent * (color2[2] - color1[2]);
                            }

                            yearColor = "rgba(" + Math.round(redColor) + "," + Math.round(greenColor) + "," + Math.round(blueColor) + ",0.5)";


                            if (colorPlayer) {
                                yearColor = dataModelNameDic[dataModel[j].Player].color;
                            }

                            var jsonStruc = {
                                "from": "X",
                                "to": "X",
                                "playerName": "",
                                "value": 1,
                                "color": yearColor,
                                "connectionNum": 0
                            }
                            connectionnum++;
                            jsonStruc.from = saveTeam;
                            jsonStruc.to = dataModel[j].Tm;
                            jsonStruc.playerName = dataModelNames[i].Name;
                            jsonStruc.connectionNum = connectionnum;
                            dataArray.push(jsonStruc);

                            saveTeam = dataModel[j].Tm;
                        } else {
                            saveTeam = dataModel[j].Tm;
                        }
                    }
                }
            }
            saveTeam = "";
        }
    }

    //ADD TEAM COLORS
    if (!colorPlayer) {
        for (var i = 0; i < teamColor.length; i++) {
            dataArray.unshift(teamColor[i]);
        }
    }
    console.log("End Process Json");

    dataArray = dataArray.sort((a, b) => (a.connectionNum > b.connectionNum) ? -1 : 1)
    selectPlayerNames();

    draw();
}

selectPlayerNames();

function getRGBArray(rgb) {
    var rgb = rgb.substring(4, rgb.length - 1)
        .replace(/ /g, '')
        .split(',');

    return rgb;
}


function selectPlayerNames() {
    counter = 1;
    if (batchsCounter * batchs > dataArray.length) {
        batchsCounter = 1;
    }

    var playerSelector = document.getElementById("playerSelector");
    playerSelector.innerHTML = "";
    playerSelector.innerHTML = '<option value="NA">NA</option>';
    console.log("BachCounter:" + batchsCounter + " counter:" + counter);
    for (var i = counter * batchsCounter; i < dataModelNames.length; i++) {
        for (var j = 0; j < dataArray.length; j++) {

            if (dataArray[j].playerName == dataModelNames[i].Name) {
                if (saveSelectorValue != "" && saveSelectorValue == dataModelNames[i].Name) {
                    var playerName = dataModelNames[i].Name;
                    playerSelector.innerHTML = playerSelector.innerHTML + '<option value="' +
                        playerName + '" selected>' + playerName + '</option>';
                    playerSelector = "";
                } else {
                    var playerName = dataModelNames[i].Name;
                    playerSelector.innerHTML = playerSelector.innerHTML + '<option value="' +
                        playerName + '">' + playerName + '</option>';
                    counter++;
                }
            }

        }

        if (counter > batchs) {
            console.log("End Process Selector");
            break;
        }
    }
}

$("#nextPage").click(function () {
    batchsCounter++;
    selectPlayerNames();
    console.log("Names");
});

$("#prevPage").click(function () {
    if (batchsCounter > 1) {
        batchsCounter--;
    }
    selectPlayerNames();
    console.log("Names");
});

$("#nextPage10").click(function () {
    batchsCounter += 10;
    selectPlayerNames();
    console.log("Names");
});

$("#prevtPage10").click(function () {
    if (batchsCounter > 10) {
        batchsCounter -= 10;
    }
    selectPlayerNames();
    console.log("Names");
});

$("#playerSelector").change(function () {

});



$(".nba-filter").change(function () {
    changeData();
});
