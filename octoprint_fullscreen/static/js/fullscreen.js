/*
 * View model for OctoPrint-Fullscreen
 *
 * Based on: NavbarTemp credits to Jarek Szczepanski
 * (Other stuff) Author: Paul de Vries
 * License: AGPLv3
 */
var onceOpenInlineFullscreen = false;
if (window.location.hash.indexOf('-fullscreen-open') !== -1) {
	window.location.hash = window.location.hash.replace('-fullscreen-open', '').substr(1);
	onceOpenInlineFullscreen = true;
}

$(function() {
	function FullscreenViewModel(parameters) {
		var self = this;
		var $body = $('body');
		var $container, $fullscreenContainer;

		self.tempModel = parameters[0];
		self.printer = parameters[1];
		self.printer.fsp = {};

		self.printer.fsp.printLayerProgress = ko.observable('');
		self.printer.fsp.hasLayerProgress = ko.observable(false);

		self.printer.fsp.isFullscreen = ko.observable(false);
		self.printer.fsp.fullscreen = function() {
			$fullscreenContainer.toggleFullScreen();
		}

		self.onStartupComplete = function() {
			var $webcam = $('#webcam_image');
			var $info = $('#fullscreen-bar');
	
			var containerPlaceholder = document.querySelector('#webcam,#webcam_container,#classicwebcam_container');
			if (!containerPlaceholder) {
				return;
			}

			var containerPlaceholderSelector = `#${containerPlaceholder.id}`;
			if ($('.webcam_fixed_ratio').length > 0) {
				$container = $(containerPlaceholderSelector + ' .webcam_fixed_ratio');
				$fullscreenContainer = $(containerPlaceholderSelector + ' #webcam_rotator');
			} else {
				$container = $(containerPlaceholderSelector + ' #webcam_rotator');
				$fullscreenContainer = $(containerPlaceholderSelector + ' #classicwebcam_container');
			}

			var touchtime = 0;
			$webcam.on("click", function() {
				if (touchtime === 0) {
					touchtime = new Date().getTime();
				} else {
					if (((new Date().getTime()) - touchtime) < 800) {
						$body.toggleClass('inlineFullscreen');
						$container.toggleClass("inline fullscreen");
	
						if ($body.hasClass('inlineFullscreen')) {
							history.pushState('', null, window.location.hash + '-fullscreen-open');
						} else {
							if (window.location.hash.indexOf('-fullscreen-open') !== -1) {
								history.pushState('', null, window.location.hash.replace('-fullscreen-open', ''));
							}
						}
	
						if(self.printer.fsp.isFullscreen()) {
							$fullscreenContainer.toggleFullScreen();
						}
						touchtime = 0;
					} else {
						touchtime = new Date().getTime();
					}
				}
			});

			if (onceOpenInlineFullscreen) {
				setTimeout(function() {
					touchtime = new Date().getTime();
					$webcam.trigger("click");
					onceOpenInlineFullscreen = false;
				}, 100);
			}

			$info.insertAfter($container);
			$(".print-control #job_pause").clone().appendTo("#fullscreen-bar .user-buttons").attr('id', 'job_pause_clone');
	
			ko.applyBindings(self.printer, $("#fullscreen-bar #fullscreen-print-info").get(0));
			ko.applyBindings(self.printer, $("#fullscreen-bar #fullscreen-buttons").get(0));
			ko.applyBindings(self.printer, $("#fullscreen-bar #fullscreen-progress-bar").get(0));
		}

		self.onDataUpdaterPluginMessage = function (plugin, data) {
			if (plugin.indexOf('DisplayLayerProgress') !== -1) {
				if (!self.printer.fsp.hasLayerProgress()) {
					self.printer.fsp.hasLayerProgress(true);
				}

				if (data.currentLayer && data.totalLayer) {
					self.printer.fsp.printLayerProgress(data.currentLayer + ' / ' + data.totalLayer);
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

		$(document).bind("fullscreenchange", function() {
			self.printer.fsp.isFullscreen($(document).fullScreen());
		});
	}

	OCTOPRINT_VIEWMODELS.push({
		construct: FullscreenViewModel,
		dependencies: ["temperatureViewModel", "printerStateViewModel", "controlViewModel"],
		optional: [],
		elements: ["#fullscreen-tool-info"]
	});
});
