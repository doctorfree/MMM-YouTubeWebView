/* Magic Mirror
 * Module: YouTube WebView
 * 
 * v 1.0.0
 * 
 * By Ronald Joe Record http://ronrecord.com
 * Based on MMM-EmbedYoutube by Nitipoom Unrrom and MMM-WebView by Shunta Iketaki
 *
 * MIT Licensed.
 */
Module.register("MMM-YouTubeWebView", {
	defaults: {
		autoplay: false,
		color: "red",
		controls : true,
		disablekb: false,
		fs: true,
		height: "315px",
		width: "560px",
		loop: false,
		modestbranding: false,
		rel : false,
		showinfo : false,
		video_id : "",
		playlist: "",
		loadedJS: undefined,
		referrer: "",
		video_list: []
	},
	getDom: function () {
		var wrapper = document.createElement("div");
        wrapper.id = 'mmm-youtube-webview-wrapper';

		var params = "";
		var videoList = "";

		if (this.config.video_list && this.config.video_list.length > 0) {
			videoList = "&playlist=";
			for (var i = 0; i < this.config.video_list.length; i++) {
				videoList += this.config.video_list[i];
				if (i + 1 < this.config.video_list.length)
					videoList += ",";
			}
		}
		params += (this.config.autoplay) ? "autoplay=1" : "autoplay=0";
		params += (typeof this.config.color !== "undefined" && this.config.color != "red")? "&color=" + this.config.color:"";
		params += (this.config.controls)? "&controls=1":"&controls=0";
		params += (this.config.disablekb)? "&disablekb=1":"";
		params += (this.config.fs)? "":"&fs=0";
		params += (videoList != "" && (typeof this.config.playlist === "undefined" || this.config.playlist == "")) ? videoList : "&playlist=" + this.config.video_id; // required playlist to loopable
		params += (this.config.loop) ? "&loop=1" : "";
		params += (this.config.modestbranding) ? "&modestbranding=1" : "";
		params += (this.config.rel)? "&rel=1": "&rel=0";
		params += (this.config.showinfo)? "&showinfo=1": "&showinfo=0";

		var videoId = this.config.video_id +"?version=3";
		if (typeof this.config.playlist !== "undefined" && this.config.playlist != "")
			videoId = "playlist?list=" + this.config.playlist + "&";

		var referrer = "";
		if (typeof this.config.referrer !== "undefined" && this.config.referrer != "")
			referrer = "httpreferrer=\"" + this.config.referrer + "\"";

		wrapper.innerHTML = `<webview id="mmm-youtube-webview" style="display:inline-flex; width:${this.config.width}; height:${this.config.height}" src="https://www.youtube.com/embed/${videoId}&${params}" nodeIntegration ${referrer}></webview>`;
		return wrapper;
	},
    notificationReceived: function (notification, payload, sender) {
        if (notification == 'MODULE_DOM_CREATED') {
          if (this.config.loadedJS && this.config.loadedJS.length > 0) {
            const webview = document.getElementById('mmm-youtube-webview');
            if (webview) {
              webview.addEventListener('did-finish-load', () => {
                webview.executeJavaScript(this.config.loadedJS);
              });
            } else {
              // TODO: Show Error
            }
          }
        }
    },
});
