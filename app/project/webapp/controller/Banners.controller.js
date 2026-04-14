sap.ui.define([
    "project/controller/BaseController"
], (BaseController) => {
    "use strict";

    return BaseController.extend("project.controller.Banners", {

        onInit() { },

        onNavBanners:    function() { },
        onNavMissions:   function() { this.getOwnerComponent().getRouter().navTo("RouteMissions"); },
        onNavCharacters: function() { },
        onNavEvents:     function() { },
        onNavItems:      function() { },
        onOpenProfile:   function() { this.getOwnerComponent().getRouter().navTo("RouteProfile"); },
        onOpenSettings:  function() { this.getOwnerComponent().getRouter().navTo("RouteSettings"); },
        onOpenPrivacy:   function() { },
        onOpenCookies:   function() { },
        onOpenTerms:     function() { }
    });
});