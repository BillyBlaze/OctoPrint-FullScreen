/*
 * View model for OctoPrint-Fullscreen
 *
 * Based on: NavbarTemp credits to Jarek Szczepanski
 * (Other stuff) Author: Paul de Vries
 * License: AGPLv3
 */
$(function() {
    function FullscreenViewModel(parameters) {
        var self = this;
		var webcam = $('#webcam_image');
		var info = $('#fullscreen-bar');
		
        self.tempModel = parameters[0];
		self.printer = parameters[2];
        self.settings = parameters[1];

		webcam.on("dblclick", function() {
			$('#webcam_rotator').toggleFullScreen();
			webcam.toggleClass("fullscreen");
		});
		
		$(document).bind("fullscreenchange", function() {
			if (!$(document).fullScreen()) {
				webcam.removeClass("fullscreen");
			}
		});
		
		info.insertAfter(webcam);
		$("#job_pause").clone().appendTo("#fullscreen-cancel");
		
		ko.applyBindings(self.printer, document.getElementById("fullscreen-cancel"))
    }

    OCTOPRINT_VIEWMODELS.push([
        FullscreenViewModel,
        ["temperatureViewModel", "settingsViewModel", "printerStateViewModel"],
        ["#fullscreen-info"]
    ]);
});

function formatBarTemperature(toolName, actual, target) {
    var output = toolName + ": " + _.sprintf("%.1f&deg;C", actual);

    if (target) {
        var sign = (target >= actual) ? " \u21D7 " : " \u21D8 ";
        output += sign + _.sprintf("%.1f&deg;C", target);
    }

    return output;
};