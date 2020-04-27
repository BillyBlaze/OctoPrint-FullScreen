/*
 * View model for OctoPrint-Fullscreen
 *
 * Based on: NavbarTemp credits to Jarek Szczepanski
 * (Other stuff) Author: Paul de Vries
 * License: AGPLv3
 */
$(function() {
	var $container, $fullscreenContainer;

	if($(".webcam_fixed_ratio").length > 0) {
		$container = $('#webcam .webcam_fixed_ratio');
		$fullscreenContainer = $("#webcam #webcam_rotator");
	} else {
		$container = $('#webcam #webcam_rotator');
		$fullscreenContainer = $("#webcam #webcam_container");
	}

	function FullscreenViewModel(parameters) {
		var self = this;
		var $webcam = $('#webcam_image');
		var $info = $('#fullscreen-bar');
		var $body = $('body');

		self.tempModel = parameters[0];
		self.printer = parameters[2];
		self.settings = parameters[1];
		self.layerProgress = parameters[3];

		self.printer.printLayerProgress = ko.observable('');
		self.printer.hasLayerProgress = ko.observable(false);

		self.printer.isFullscreen = ko.observable(false);
		self.printer.fullscreen = function() {
			$fullscreenContainer.toggleFullScreen();
		}

		self.onDataUpdaterPluginMessage = function (plugin, data) {
			if (plugin.indexOf('DisplayLayerProgress') !== -1) {
				if (!self.printer.hasLayerProgress()) {
					self.printer.hasLayerProgress(true);
				}

				if (data.currentLayer && data.totalLayer) {
					self.printer.printLayerProgress(data.currentLayer + ' / ' + data.totalLayer);
				}
			}
		};

		self.formatBarTemperatureFullscreen = function(toolName, actual, target) {
			var output = toolName + ": " + _.sprintf("%.1f&deg;C", actual);

			if (target) {
				var sign = (target >= actual) ? " \u21D7 " : " \u21D8 ";
				output += sign + _.sprintf("%.1f&deg;C", target);
			}

			return output;
		};


		var touchtime = 0;
		$webcam.on("click", function() {
			if (touchtime == 0) {
				touchtime = new Date().getTime();
			} else {
				if (((new Date().getTime()) - touchtime) < 800) {
					$body.toggleClass('inlineFullscreen');
					$container.toggleClass("inline fullscreen");

					if(self.printer.isFullscreen()) {
						$fullscreenContainer.toggleFullScreen();
					}
					touchtime = 0;
				} else {
					touchtime = new Date().getTime();
				}
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
		$(".print-control #job_pause").clone().appendTo(".user-buttons").attr('id', 'job_pause_clone');

		ko.applyBindings(self.printer, $("#webcam #fullscreen-cancel").get(0));
	}

	OCTOPRINT_VIEWMODELS.push({
		construct: FullscreenViewModel,
		dependencies: ["temperatureViewModel", "settingsViewModel", "printerStateViewModel"],
		optional: [],
		elements: ["#fullscreen-info"]
	});
});
