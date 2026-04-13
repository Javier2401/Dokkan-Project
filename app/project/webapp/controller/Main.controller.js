sap.ui.define([
    "sap/ui/core/mvc/Controller"
], (Controller) => {
    "use strict";

    return Controller.extend("project.controller.Main", {

        onInit() {
        },

        onNavMain: function () {
            this.getOwnerComponent().getRouter().navTo("RouteMain");
        },

        onNavNews: function () {
            this.getOwnerComponent().getRouter().navTo("RouteSegunda");
        },
        onNavBanners: function () {
            // this.getOwnerComponent().getRouter().navTo("RouteBanners");
        },
        onNavMissions: function () {
            // this.getOwnerComponent().getRouter().navTo("RouteMissions");
        },
        onNavCharacters: function () {
            // this.getOwnerComponent().getRouter().navTo("RouteCharacters");
        },
        onNavEvents: function () {
            // this.getOwnerComponent().getRouter().navTo("RouteEvents");
        },
        onNavItems: function () {
            // this.getOwnerComponent().getRouter().navTo("RouteItems");
        },

        onOpenProfile:  function () { },
        onOpenSettings: function () { },
        onChangeLang:   function () { },

        onOpenPrivacy: function () { },
        onOpenCookies: function () { },
        onOpenTerms:   function () { },
    });
});