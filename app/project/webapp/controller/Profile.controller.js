sap.ui.define([
    "project/controller/BaseController"
], (BaseController) => {
    "use strict";

    return BaseController.extend("project.controller.Profile", {

        onInit() { },

        onNavBanners:    function() { this.getOwnerComponent().getRouter().navTo("RouteBanners"); },
        onNavMissions:   function() { this.getOwnerComponent().getRouter().navTo("RouteMissions"); },
        onNavCharacters: function() { },
        onNavEvents:     function() { },
        onNavItems:      function() { },
        onOpenProfile:   function() { },
        onOpenSettings:  function() { this.getOwnerComponent().getRouter().navTo("RouteSettings"); },
        onOpenPrivacy:   function() { },
        onOpenCookies:   function() { },
        onOpenTerms:     function() { }
    });
});