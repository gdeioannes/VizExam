        var colorPick = "";
        var min = 1950;
        var max = 2017;
        //Value to fix a value with min a max over the bar, is the toke with/9
        var ofsetTokenPos = 9;
        var colorPicker = new iro.ColorPicker("#color-picker-container", {
            // Set the size of the color picker
            width: 150,
            // Set the initial color to pure red
            color: "#f00"

        });

        colorPicker.on("color:change", colorChangeCallback);

        var pick;

        function colorChangeCallback(color) {
            colorPick = color.hexString;
            $(pick).css("background-color", colorPick);
        }

        var uIContainer = $(".IO-UI-input-bar-container");

        var uiTokenContainer = uIContainer.find(".IO-UI-token-container");
        var uiRangeContainer = uIContainer.find(".IO-UI-container-range");
        var uiTokenBar = uIContainer.find(".IO-UI-input-bar");
        var uiToken = uiTokenContainer.find(".IO-UI-token");
        var colorPicker = $("#color-picker-container");
        var infoText = $("#IO-UI-input-info-text");

        colorPicker.hide();

        var leftStart = uiTokenContainer.offset().left;
        var topStart = uiTokenContainer.offset().top - uiTokenBar.height() / 2;

        var leftEnd = uiTokenContainer.offset().left + uiTokenBar.width() / 2 - uiToken.width();
        var topEnd = uiTokenContainer.offset().top - uiTokenBar.height() / 2;
        uiToken.css("left", leftEnd);
        uiToken.css("top", topEnd);

        makeDragables();

        function makeDragables() {
            var tokensArray = uiTokenContainer.find(".IO-UI-token");
            var rangeArray = uiTokenContainer.find(".IO-UI-range");

            for (var j = 0; j < rangeArray.length; j++) {
                var selectRange = rangeArray[j];
                /*$(selectRange).draggable({
                    axis: "x",
                    containment: uiTokenBar,
                    stack: ".IO-UI-range",
                    drag: function (event, ui) {
                        colorPicker.hide();
                    }
                });*/

            }

            for (var i = 0; i < tokensArray.length; i++) {
                var selectToken = tokensArray[i];
                $(selectToken).dblclick(function () {
                    colorPicker.show();
                    pick = this;
                    colorPicker.css("top", $(this).offset().top + 50);
                    colorPicker.css("left", $(this).offset().left + 10 - colorPicker.width() / 2);
                });

                $(selectToken).css("top", topEnd);
                changeUIDragElements($(tokensArray[i]));

                $(selectToken).draggable({
                    axis: "x",
                    containment: uiTokenBar,
                    stack: ".IO-UI-token",
                    drag: function (event, ui) {
                        colorPicker.hide();
                        changeUIDragElements($(this));
                        $(this).attr("data-year", setValueText($(this)));
                        moveRange(this);
                    },
                    stop: function (event, ui) {
                        getDataRanges();
                        changeData();
                    }
                });

                moveRange(selectToken);
            }
        }

        function moveRange(token) {
            var range = $(token).parent();
            var tokensChilds = $(range).find(".IO-UI-token");
            var min = 10000000;
            var max = -1;
            for (var i = 0; i < tokensChilds.length; i++) {
                var selectToken = tokensChilds[i];

                if (min > $(selectToken).offset().left) {
                    min = $(selectToken).offset().left;
                }

                if (max < $(selectToken).offset().left) {
                    max = $(selectToken).offset().left;
                }
            }

            var width = max - min;
            $(range).css("top", $(token).offset().top - ($(range).height() - $(token).height()) / 2);
            var offSetWidth = $(token).width() / 2 - 5;
            $(range).css("left", min - offSetWidth);
            $(range).css("width", width + $(token).width() + offSetWidth * 2);

        }

        function changeUIDragElements(token) {
            var text = $(token).find(".IO-UI-token-text");
            text.html(setValueText(token));
            text.css("left", token.offset().left - (text.width() / 4));
            text.css("top", token.offset().top + 10);
        }

        function setValueText(token) {
            return Math.round(min + (max - min) * ((token.offset().left - uiTokenBar.offset().left) / (uiTokenBar.width() - ofsetTokenPos)));
        }

        function addToken() {
            changeInfoTextFade("Token added");
            var range = '<div class="IO-UI-range" data-first="" data-end=""><div class="IO-UI-token" data-year="1950"><p class="IO-UI-token-text">100</p></div><div class="IO-UI-token" data-year="1953"><p class="IO-UI-token-text">100</p></div></div>';
            //$(uiTokenContainer).append("<div class='IO-UI-token'  data-year='100'><p class='IO-UI-token-text'>100</p></div>");
            $(uiTokenContainer).append(range);
            setTokenPositionByValue();
            makeDragables();
            changeData();
        }

        function addRange() {

            changeInfoText("Pick 1st Token");
        }

        $("#IO-UI-add-token").click(function () {
            addToken();
        });

        $("#IO-UI-add-range").click(function () {
            addRange();
        });

        $(".IO-UI-delete-btn").click(function () {
            colorPicker.hide();
            $(pick).parent().remove();
        });

        $(window).click(function () {
            colorPicker.hide();
            changeData();
        });

        $(window).resize(function () {
            var tokens = $(".IO-UI-token");
            for (var i = 0; i < tokens.length; i++) {
                var mToke = tokens[i];
                var year = $(mToke).attr("data-year");
                $(mToke).css("left", (uiTokenBar.offset().left) + ((uiTokenBar.width() - ofsetTokenPos) * ((year - min) / (max - min))));
                changeUIDragElements($(mToke))
                moveRange($(mToke));
            }
        });

        function changeInfoTextFade(text) {
            var textP = '<p class="IO-UI-input-info-fade">' + text + '</p>';
            infoText.html(textP);
        }

        function changeInfoText(text) {
            var textP = '<p class="IO-UI-input-info">' + text + '</p>';
            infoText.html(textP);
        }

        setTokenPositionByValue();

        function setTokenPositionByValue() {
            var tokensArray = uiTokenContainer.find(".IO-UI-token");

            for (var i = 0; i < tokensArray.length; i++) {
                var selectToken = tokensArray[i];
                var data = $(tokensArray[i]).attr("data-year");
                var barW = uiTokenBar.width() - ofsetTokenPos;
                var barPos = uiTokenBar.offset().left;
                var left = barPos + barW * ((data - min) / (max - min));
                $(selectToken).css("left", left);
                changeUIDragElements($(selectToken));
                moveRange(selectToken);
            }
        }

        function getDataRanges() {
            console.log("Data Ranges Caluclated");
            var rangeArrayHTML = uiTokenContainer.find(".IO-UI-range");
            var rangeArray = [];

            for (var i = 0; i < rangeArrayHTML.length; i++) {
                console.log(i);
                var rangeObj = {
                    from: "",
                    color_from: "",
                    to: "",
                    color_to: ""
                }

                var tokensChilds = $(rangeArrayHTML[i]).find(".IO-UI-token");
                var min = 10000000;
                var max = -1;
                for (var j = 0; j < tokensChilds.length; j++) {

                    var selectToken = tokensChilds[j];
                    var from = "";
                    var to = "";
                    if (min > $(selectToken).attr("data-year")) {
                        min = $(selectToken).attr("data-year");
                        rangeObj.color_from = $(selectToken).css("background-color");
                    }

                    if (max < $(selectToken).attr("data-year")) {
                        max = $(selectToken).attr("data-year");
                        rangeObj.color_to = $(selectToken).css("background-color");

                    }
                }
                rangeObj.from = min;
                rangeObj.to = max;
                rangeArray.push(rangeObj);

            }
            console.log(rangeArray);
            return rangeArray;
        }
