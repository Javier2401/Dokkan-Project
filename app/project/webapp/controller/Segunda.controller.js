sap.ui.define([
    "sap/ui/core/mvc/Controller"
], (Controller) => {
    "use strict";

    return Controller.extend("project.controller.Segunda", {

        onInit() {
        },

        onNavMain: function () {
            this.getOwnerComponent().getRouter().navTo("RouteMain");
        },

        onNavNews:       function () { },
        onNavBanners:    function () { },
        onNavMissions:   function () { },
        onNavCharacters: function () { },
        onNavEvents:     function () { },
        onNavItems:      function () { },

        onOpenProfile:  function () { },
        onOpenSettings: function () { },
        onChangeLang:   function () { },

        onOpenPrivacy: function () { },
        onOpenCookies: function () { },
        onOpenTerms:   function () { },

        changeViewToMain: function () {
            this.getOwnerComponent().getRouter().navTo("RouteMain");
        },
    });
});