var dataArray = [];
changeData();

var saveSelectorValue = "";

var c = document.getElementById("myCanvas");



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
        myNode.y = 625;
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
                break;
            }

        }
        ctx.beginPath();
        var max = Math.max(saveFromX, saveToX);
        var min = Math.min(saveFromX, saveToX);
        var mid = Math.min(saveFromX, saveToX) + (Math.max(saveFromX, saveToX) - Math.min(saveFromX, saveToX)) / 2;
        ctx.arc(mid, 625, (max - min) / 2, 0, Math.PI * 1, true);

        //ctx.moveTo(Math.min(saveFromX, saveToX), 400);
        //ctx.lineTo(Math.min(saveFromX, saveToX) + (Math.max(saveFromX, saveToX) - Math.min(saveFromX, saveToX)) / 2, (Math.max(saveFromX, saveToX) - Math.min(saveFromX, saveToX)));
        ctx.lineWidth = 0.1;
        //ctx.lineTo(Math.max(saveFromX, saveToX), 400);
        ctx.strokeStyle = nodeColor;
        ctx.stroke();

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
    var firstYear = parseInt(document.getElementById('firstYear').value);
    var endYear = parseInt(document.getElementById('endYear').value);
    var firstAge = parseInt(document.getElementById('firstAge').value);
    var endAge = parseInt(document.getElementById('endAge').value);
    var playerSelector = document.getElementById('playerSelector').value;
    var colorYear = document.getElementById('colorYear').checked;
    var colorPlayer = document.getElementById('colorPlayer').checked;
    saveSelectorValue = playerSelector;

    var playerFlag = true;
    if (playerSelector == "NA") {
        playerFlag = true;
    } else {
        playerFlag = false;
    }



    for (var i = 0; i < dataModelNames.length; i++) {
        var saveTeam = "";
        for (var j = 0; j < dataModel.length; j++) {
            if (playerSelector != "NA") {
                if (playerSelector == dataModel[j].Player) {
                    playerFlag = true;
                } else {
                    playerFlag = false;
                }
            }


            if (dataModelNames[i].Name == dataModel[j].Player &&
                dataModel[j].Year >= firstYear && dataModel[j].Year <= endYear &&
                dataModel[j].Age >= firstAge && dataModel[j].Age <= endAge) {
                if (dataModel[j].Tm != "TOT" && playerFlag) {



                    if (dataModel[j].Tm != saveTeam && saveTeam != "") {
                        var yearColor = "";
                        if (colorYear) {
                            var yearRange = (endYear - firstYear);
                            var yearPos = parseInt(dataModel[j].Year) - firstYear;
                            var redColor = Math.round(255 - 255 * (yearPos / yearRange));
                            var blueColor = Math.round(255 * (yearPos / yearRange));
                            var yearColor = "rgba(" + blueColor + ",0," + redColor + ",1)";
                        } else {
                            yearColor = "#000"
                        }
                        if (colorPlayer) {
                            yearColor = dataModelNameDic[dataModel[j].Player].color;
                        }

                        var jsonStruc = {
                            "from": "X",
                            "to": "X",
                            "playerName": "",
                            "value": 1,
                            "color": yearColor
                        }
                        jsonStruc.from = saveTeam;
                        jsonStruc.to = dataModel[j].Tm;
                        jsonStruc.playerName = dataModelNames[i].Name;
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

    //ADD TEAM COLORS
    if (!colorYear && !colorPlayer) {
        for (var i = 0; i < teamColor.length; i++) {
            dataArray.unshift(teamColor[i]);
        }
    }
    console.log("End Process Json");


    selectPlayerNames();

    draw();
}

selectPlayerNames();

function selectPlayerNames() {

    var playerSelector = document.getElementById("playerSelector");
    playerSelector.innerHTML = "";
    playerSelector.innerHTML = '<option value="NA">NA</option>';
    var counter = 0;
    var batchs = 20;
    var batchsCounter = 1;
    for (var i = counter; i < dataModelNames.length; i++) {
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

        if (counter > batchs * batchsCounter) {
            batchsCounter++;
            console.log("End Process Selector");
            break;
        }
    }
}



$(".nba-filter").change(function () {
    changeData();
});
