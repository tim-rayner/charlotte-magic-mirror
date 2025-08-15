let config = {
  address: "0.0.0.0",
  port: 8080,
  ipWhitelist: [],
  language: "en",
  timeFormat: 24,
  units: "metric",

  modules: [
    {
      module: "compliments",
      position: "middle_center"
    },
    {
      module: "MMM-AccuWeatherForecastDeluxe",
      header: "",
      position: "top_right",
      classes: "default everyone",
      disabled: false,
      config: {
        apikey: "KR1hIMj36yoEjoLwFrKYAB1Pa6rOSJqJ",
        apikey2: "",
        locationKey: "337209",
        relativeColors: true,
        hourlyForecastLayout: "table",
        maxHourliesToShow: 5,
        dailyForecastLayout: "table",
        maxDailiesToShow: 5,
        ignoreToday: true,
        showPrecipitationProbability: false,
        showPrecipitationSeparator: false,
        iconset: "6oa",
        label_ordinals: ["↓", "↙", "←", "↖", "↑", "↗", "→", "↘"],
        label_high: "",
        label_low: "",
        showAttribution: false
      }
    },
    {
      module: "MMM-Screencast",
      position: "bottom_right", // placeholder only
      config: {
        position: "center",
        x: 0,
        y: 0,
        width: 1080,
        height: 1920,
        castName: "Charlotte's Mirror"
      }
    },

    {
      module: "MMM-Moon",
      position: "top_left",
      config: {
        //TO GET YOUR app_id AND app_secret, VISIT AstronomyAPI AND CREATE AN APPLICATION.
        appId: "2e357e2e-2dc5-426b-bfc3-bd6e441e82e9",
        appSecret:
          "d179feb5e367f7f41420d7fe111f3f073d7bd84babf33aee5c28aa6e0025416aa4a756a393549d759d375450b5c26ffb7244073eedfbe9de59ddfc161f1ecc65a9423043addbfe011c4485961eb126f002878c45fb40973a22cda5c1ea79c3eb4f91aaa9b897c410edcfb1a95a42b69a",
        lat: 52.641479069213354,
        lon: 1.3004873711647678,
        timezone: "Europe/London"
      }
    },
    {
      module: "clock",
      position: "top_right",
      config: {
        displayType: "digital",
        showDate: true,
        showTime: true,
        showWeek: false
      }
    },
    {
      module: "newsfeed",
      position: "bottom_bar",
      config: {
        feeds: [
          {
            title: "BBC News",
            url: "https://feeds.bbci.co.uk/news/rss.xml"
          }
        ],
        showSourceTitle: true,
        showPublishDate: true,
        updateInterval: 30000, // 30 sec
        reloadInterval: 300000, // 5 minutes
        animationSpeed: 2000,
        showDescription: true
      }
    },
    {
      module: "MMM-Carousel",
      position: "bottom_bar",
      config: {
        transitionInterval: 0, // disables automatic rotation
        showPageIndicators: true,
        showPageControls: true,
        ignoreModules: ["clock", "alert"],
        mode: "slides",
        slides: {
          main: ["compliments", "MMM-AccuWeatherForecastDeluxe", "newsfeed"],
          "Slide 2": ["newsfeed", "MMM-AccuWeatherForecastDeluxe", "MMM-Moon"],
          "Slide 3": ["MMM-AccuWeatherForecastDeluxe"]
        }
      }
    }
  ]
};
if (typeof module !== "undefined") {
  module.exports = config;
}
