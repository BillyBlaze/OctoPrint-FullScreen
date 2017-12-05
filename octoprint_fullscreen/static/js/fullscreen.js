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
		var $container, $fullscreenContainer;
		var $webcam = $('#webcam_image');
		var $info = $('#fullscreen-bar');
		var $body = $('body');
		
		if($(".webcam_fixed_ratio").length > 0) {
			$container = $('.webcam_fixed_ratio');
			$fullscreenContainer = $("#webcam_rotator");
		} else {
			$container = $('#webcam_rotator');
			$fullscreenContainer = $("#webcam_container");
		}
		
		self.tempModel = parameters[0];
		self.printer = parameters[2];
		self.settings = parameters[1];
		
		self.printer.isFullscreen = ko.observable(false);
		self.printer.fullscreen = function() {
			$fullscreenContainer.toggleFullScreen();
		}
		
		self.formatBarTemperatureFullscreen = function(toolName, actual, target) {
			var output = toolName + ": " + _.sprintf("%.1f&deg;C", actual);

			if (target) {
				var sign = (target >= actual) ? " \u21D7 " : " \u21D8 ";
				output += sign + _.sprintf("%.1f&deg;C", target);
			}

			return output;
		};

		$webcam.on("dblclick", function() {
			$body.toggleClass('inlineFullscreen');
			$container.toggleClass("inline fullscreen");
			
			if(self.printer.isFullscreen()) {
				$fullscreenContainer.toggleFullScreen();
			}
		});
		
		$(document).bind("fullscreenchange", function() {
			if (!$(document).fullScreen()) {
				self.printer.isFullscreen(false);
			} else {
				self.printer.isFullscreen(true);
			}
		});
		
		$info.insertAfter($container);
		$("#job_pause").clone().appendTo(".user-buttons");
		
		ko.applyBindings(self.printer, document.getElementById("fullscreen-cancel"))
	}

	OCTOPRINT_VIEWMODELS.push([
		FullscreenViewModel,
		["temperatureViewModel", "settingsViewModel", "printerStateViewModel"],
		["#fullscreen-info"]
	]);
});
