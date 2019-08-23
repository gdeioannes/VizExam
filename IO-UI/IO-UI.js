        var colorPick = "";
        var min = 1950;
        var max = 2020;
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
            var rangeArray = uiRangeContainer.find(".IO-UI-range");

            for (var i = 0; i < tokensArray.length; i++) {

                $(tokensArray[i]).dblclick(function () {
                    colorPicker.show();
                    pick = this;
                    colorPicker.css("top", $(this).offset().top + 50);
                    colorPicker.css("left", $(this).offset().left + 10 - colorPicker.width() / 2);
                });

                $(tokensArray[i]).css("top", topEnd);
                changeUIDragElements($(tokensArray[i]));

                $(tokensArray[i]).draggable({
                    axis: "x",
                    containment: uiTokenBar,
                    drag: function (event, ui) {
                        colorPicker.hide();
                        changeUIDragElements($(this));
                        colorPicker.css("top", $(this).offset().top + 50);
                        colorPicker.css("left", $(this).offset().left + 10 - colorPicker.width() / 2);
                        $(this).attr("data-year", setValueText($(this)));
                    }
                });
            }
        }

        function moveRange() {

        }

        function changeUIDragElements(token) {
            var text = $(token).find(".IO-UI-token-text");
            text.html(setValueText(token));
            text.css("left", token.offset().left - (text.width() / 4));
            text.css("top", token.offset().top + 7);
        }

        function setValueText(token) {
            return Math.round(min + (max - min) * ((token.offset().left - uiTokenBar.offset().left) / uiTokenBar.width()));
        }

        function addToken() {
            changeInfoTextFade("Token added");
            $(uiTokenContainer).append("<div class='IO-UI-token'  data-year='100'><p class='IO-UI-token-text'>100</p></div>");
            makeDragables();
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
            $(pick).remove();
        });

        $(window).click(function () {
            colorPicker.hide();
        });

        $(window).resize(function () {
            var tokens = $(".IO-UI-token");
            for (var i = 0; i < tokens.length; i++) {
                var mToke = tokens[i];
                var year = $(mToke).attr("data-year");
                console.log(year);
                $(mToke).css("left", (uiTokenBar.offset().left) + (uiTokenBar.width() * ((year - min) / (max - min))));
                changeUIDragElements($(mToke));
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
