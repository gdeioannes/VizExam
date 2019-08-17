/**
 * ---------------------------------------
 * This demo was created using amCharts 4.
 * 
 * For more information visit:
 * https://www.amcharts.com/
 * 
 * Documentation is available at:
 * https://www.amcharts.com/docs/v4/
 * ---------------------------------------
 */

// Themes begin
am4core.useTheme(am4themes_animated);
// Themes end

var chart = am4core.create("chartdiv", am4charts.ChordDiagram);

// colors of main characters
chart.colors.saturation = 0.45;
chart.colors.step = 3;

var colors = {
        SO: "#000"

}

// data was provided by: https://www.reddit.com/user/notrudedude

var dataArray = [];
changeData();

var saveSelectorValue = "";

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
                            var yearColor = "rgba(" + redColor + ",0," + blueColor + ",1)";
                        } else {
                            yearColor = "#000"
                        }
                        console.log(dataModelNameDic[dataModel[j].Player].color);
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



    console.log("End Process");
    chart.data = dataArray;
    selectPlayerNames();

    /*var nodeLink = chart.links.template;
    var bullet = nodeLink.bullets.push(new am4charts.CircleBullet());
    bullet.fillOpacity = 1;
    bullet.circle.radius = 5;
    bullet.locationX = 0.5;

    // create animations

    chart.events.on("ready", function () {
        for (var i = 0; i < chart.links.length; i++) {
            var link = chart.links.getIndex(i);
            var bullet = link.bullets.getIndex(0);

            animateBullet(bullet);
        }
    });

    function animateBullet(bullet) {
        var duration = 3000 * Math.random() + 2000;
        var animation = bullet.animate([{
            property: "locationX",
            from: 0,
            to: 1
    }], duration)
        animation.events.on("animationended", function (event) {
            animateBullet(event.target.object);
        })
    }*/

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
            console.log("out");
            //break;
        }
    }
}

chart.dataFields.fromName = "from";
chart.dataFields.toName = "to";
chart.dataFields.playerName = "playerName";
chart.dataFields.value = "value";


chart.nodePadding = 0.5;
chart.minNodeSize = 0.01;
chart.startAngle = 80;
chart.endAngle = chart.startAngle + 360;
//chart.sortBy = "value";
chart.fontSize = 10;

var nodeTemplate = chart.nodes.template;
nodeTemplate.readerTitle = "Click to show/hide or drag to rearrange";
nodeTemplate.showSystemTooltip = true;
nodeTemplate.propertyFields.fill = "color";
nodeTemplate.tooltipText = "{name}'s kisses: {total}";

// when rolled over the node, make all the links rolled-over
nodeTemplate.events.on("over", function (event) {
    var node = event.target;
    node.outgoingDataItems.each(function (dataItem) {
        if (dataItem.toNode) {
            dataItem.link.isHover = true;
            dataItem.toNode.label.isHover = true;
        }
    })
    node.incomingDataItems.each(function (dataItem) {
        if (dataItem.fromNode) {
            dataItem.link.isHover = true;
            dataItem.fromNode.label.isHover = true;
        }
    })

    node.label.isHover = true;
})

// when rolled out from the node, make all the links rolled-out
nodeTemplate.events.on("out", function (event) {
    var node = event.target;
    node.outgoingDataItems.each(function (dataItem) {
        if (dataItem.toNode) {
            dataItem.link.isHover = false;
            dataItem.toNode.label.isHover = false;
        }
    })
    node.incomingDataItems.each(function (dataItem) {
        if (dataItem.fromNode) {
            dataItem.link.isHover = false;
            dataItem.fromNode.label.isHover = false;
        }
    })

    node.label.isHover = false;
})

var label = nodeTemplate.label;
label.relativeRotation = 90;

label.fillOpacity = 0.4;
let labelHS = label.states.create("hover");
labelHS.properties.fillOpacity = 1;

nodeTemplate.cursorOverStyle = am4core.MouseCursorStyle.pointer;
// this adapter makes non-main character nodes to be filled with color of the main character which he/she kissed most
nodeTemplate.adapter.add("fill", function (fill, target) {
    let node = target;
    let counters = {};
    let mainChar = false;
    node.incomingDataItems.each(function (dataItem) {
        if (colors[dataItem.playerName]) {
            mainChar = true;
        }

        if (isNaN(counters[dataItem.fromName])) {
            counters[dataItem.fromName] = dataItem.value;
        } else {
            counters[dataItem.fromName] += dataItem.value;
        }
    })
    if (mainChar) {
        return fill;
    }

    let count = 0;
    let color;
    let biggest = 0;
    let biggestName;

    for (var name in counters) {
        if (counters[name] > biggest) {
            biggestName = name;
            biggest = counters[name];
        }
    }
    if (colors[biggestName]) {
        fill = colors[biggestName];
    }

    return fill;
})

// link template
//chart.nonRibbon = true;
var linkTemplate = chart.links.template;
linkTemplate.strokeOpacity = 0;
linkTemplate.fillOpacity = 0.15;
linkTemplate.middleLine.strokeWidth = 1;
linkTemplate.middleLine.strokeOpacity = 0.4;
linkTemplate.tooltipText = "{fromName} & {toName}:{playerName}";

var hoverState = linkTemplate.states.create("hover");
hoverState.properties.fillOpacity = 0.7;
hoverState.properties.strokeOpacity = 0.7;

// data credit label
var creditLabel = chart.chartContainer.createChild(am4core.TextLink);
creditLabel.text = "Data source: Omri Goldstein";
creditLabel.url = "https://www.kaggle.com/drgilermo/nba-players-stats";
creditLabel.y = am4core.percent(99);
creditLabel.x = am4core.percent(99);
creditLabel.horizontalCenter = "right";
creditLabel.verticalCenter = "bottom";

var titleImage = chart.chartContainer.createChild(am4core.Image);
titleImage.href = "https://www.itsnicethat.com/system/files/072017/59636abf7fa44cb082006e80/images_slice_large/OCD_Commercial_NBA_Its_Nice_That_list.jpg?1499687638";
titleImage.x = window.innerWidth - 300;
titleImage.y = 30;
titleImage.width = 200;
titleImage.height = 200;
titleImage

$(".nba-filter").change(function () {
    changeData();
});
