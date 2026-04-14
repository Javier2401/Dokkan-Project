sap.ui.define([
    "project/controller/BaseController"
], (BaseController) => {
    "use strict";

    return BaseController.extend("project.controller.Settings", {

        onInit() { },

        onNavBanners:    function() { this.getOwnerComponent().getRouter().navTo("RouteBanners"); },
        onNavMissions:   function() { this.getOwnerComponent().getRouter().navTo("RouteMissions"); },
        onNavCharacters: function() { },
        onNavEvents:     function() { },
        onNavItems:      function() { },
        onOpenProfile:   function() { this.getOwnerComponent().getRouter().navTo("RouteProfile"); },
        onOpenSettings:  function() { },
        onOpenPrivacy:   function() { },
        onOpenCookies:   function() { },
        onOpenTerms:     function() { }
    });
});