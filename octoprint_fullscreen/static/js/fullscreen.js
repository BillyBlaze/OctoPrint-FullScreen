/*
 * View model for OctoPrint-Fullscreen
 *
 * Author: Paul de Vries
 * License: AGPLv3
 */
$(function() {
    function FullscreenViewModel(parameters) {
        var self = this;
		var webcam = $('#webcam_image');

		webcam.on("dblclick", function() {
			webcam.toggleFullScreen().toggleClass("fullscreen");
		});
		
		$(document).bind("fullscreenchange", function() {
			if (!$(document).fullScreen()) {
				webcam.removeClass("fullscreen");
			}
		});
    }

    OCTOPRINT_VIEWMODELS.push([
        FullscreenViewModel,
        [],
        []
    ]);
});
