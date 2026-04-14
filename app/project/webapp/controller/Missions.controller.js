sap.ui.define([
    "project/controller/BaseController"
], (BaseController) => {
    "use strict";

    return BaseController.extend("project.controller.Missions", {

        onInit() { },

        onNavBanners:    function() { this.getOwnerComponent().getRouter().navTo("RouteBanners"); },
        onNavMissions:   function() { },
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