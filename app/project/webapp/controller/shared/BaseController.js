sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "project/model/LanguageManager"
], (Controller, LanguageManager) => {
    "use strict";

    return Controller.extend("project.controller.shared.BaseController", {

        onChangeLang: function (oEvent) {
            const sText   = oEvent.getSource().getText() || "";
            const sLocale = sText.includes("Español") ? "es" : "en";
            LanguageManager.changeLanguage(sLocale);
        },

        onNavInfoCharacter: function (oEvent) {
            const oSource = oEvent.getSource();
            const oCtx    = oSource.getBindingContext("chars")
                         || oSource.getBindingContext();

            if (!oCtx) {
                console.warn("onNavInfoCharacter: no binding context found");
                return;
            }

            const sId = oCtx.getProperty("ID");
            if (sId !== undefined && sId !== null) {
                this.getOwnerComponent().getRouter().navTo("RouteInfoCharacter", {
                    characterId: String(sId)
                });
            }
        },

        onNavCategory: function (oEvent) {
            const sCategoryName = (oEvent.getSource().getText() || "").trim();
            if (!sCategoryName) return;

            this.getOwnerComponent().getRouter().navTo("RouteCategory", {
                "?query": { name: sCategoryName }
            });
        },

        onNavMain:             function () { this.getOwnerComponent().getRouter().navTo("RouteMain"); },
        onNavNews:             function () { this.getOwnerComponent().getRouter().navTo("RouteNews"); },
        onNavBanners:          function () { this.getOwnerComponent().getRouter().navTo("RouteBanners"); },
        onNavMissions:         function () { this.getOwnerComponent().getRouter().navTo("RouteMissions"); },
        onOpenProfile:         function () { this.getOwnerComponent().getRouter().navTo("RouteProfile"); },
        onOpenSettings:        function () { this.getOwnerComponent().getRouter().navTo("RouteSettings"); },
        onOpenTermsOfUse:      function () { this.getOwnerComponent().getRouter().navTo("RouteTermsOfUse"); },
        onOpenCookiePolicy:    function () { this.getOwnerComponent().getRouter().navTo("RouteCookiePolicy"); },
        onOpenPrivacyPolicy:   function () { this.getOwnerComponent().getRouter().navTo("RoutePrivacyPolicy"); },
        onOpenSearchCharacter: function () { this.getOwnerComponent().getRouter().navTo("RouteSearchCharacter"); },
        onOpenAllCategories:   function () { this.getOwnerComponent().getRouter().navTo("RouteAllCategoriesCharacter"); }
    });
});