sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "project/model/LanguageManager"
], (Controller, LanguageManager) => {
    "use strict";

    return Controller.extend("project.controller.BaseController", {

        onChangeLang: function(oEvent) {

            const sText = oEvent.getSource().getText();

            const sLocale = sText.includes("Español") ? "es" : "en";
            LanguageManager.changeLanguage(sLocale);
        },

        onNavMain: function() {
            this.getOwnerComponent().getRouter().navTo("RouteMain");
        },
        onNavNews: function() {
            this.getOwnerComponent().getRouter().navTo("RouteSegunda");
        }
    });
});