sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "project/model/LanguageManager"
], (Controller, LanguageManager) => {
    "use strict";

    return Controller.extend("project.controller.shared.BaseController", {

        onChangeLang: function(oEvent) {
            const sText = oEvent.getSource().getText();
            const sLocale = sText.includes("Español") ? "es" : "en";
            LanguageManager.changeLanguage(sLocale);
        },

        onNavInfoCharacter: function(oEvent) {
            this.getOwnerComponent().getRouter().navTo("RouteInfoCharacter", {
                characterId: "1"
            });
        },

        onNavMain: function() { this.getOwnerComponent().getRouter().navTo("RouteMain"); },
        onNavNews: function() { this.getOwnerComponent().getRouter().navTo("RouteNews"); },
        onNavBanners: function() { this.getOwnerComponent().getRouter().navTo("RouteBanners"); },
        onNavMissions: function() { this.getOwnerComponent().getRouter().navTo("RouteMissions"); },
        onOpenProfile: function() { this.getOwnerComponent().getRouter().navTo("RouteProfile"); },
        onOpenSettings: function() { this.getOwnerComponent().getRouter().navTo("RouteSettings"); },
    });
});