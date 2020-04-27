# coding=utf-8
from __future__ import absolute_import
import octoprint.plugin

class FullscreenPlugin(octoprint.plugin.SettingsPlugin,
                       octoprint.plugin.AssetPlugin,
                       octoprint.plugin.TemplatePlugin):

	def get_settings_defaults(self):
		return dict()

	def get_assets(self):
		return dict(
			js=["js/fullscreen.js", "js/jquery-fullscreen.js"],
			css=["css/fullscreen.css"],
			less=[]
		)

	def get_template_configs(self):
		files = [
			dict(type="generic", template="fullscreen.jinja2", custom_bindings=True)
		]

		return files


	def get_update_information(self):
		return dict(
			fullscreen=dict(
				displayName="Fullscreen Plugin",
				displayVersion=self._plugin_version,
				type="github_release",
				user="BillyBlaze",
				repo="OctoPrint-FullScreen",
				current=self._plugin_version,
				pip="https://github.com/BillyBlaze/OctoPrint-FullScreen/archive/{target_version}.zip"
			)
		)

__plugin_name__ = "Fullscreen Plugin"
__plugin_pythoncompat__ = ">=2.7,<4"
def __plugin_load__():
	global __plugin_implementation__
	__plugin_implementation__ = FullscreenPlugin()

	global __plugin_hooks__
	__plugin_hooks__ = {
		"octoprint.plugin.softwareupdate.check_config": __plugin_implementation__.get_update_information
	}
