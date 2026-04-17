sap.ui.define([
    "project/controller/shared/BaseController",
    "sap/ui/model/json/JSONModel"
], (BaseController, JSONModel) => {
    "use strict";

    return BaseController.extend("project.controller.pages.characters.InfoCharacter", {

        onInit() {
            const oRouter = this.getOwnerComponent().getRouter();
            oRouter.getRoute("RouteInfoCharacter")
                   .attachPatternMatched(this._onRouteMatched, this);
        },

        _onRouteMatched: function (oEvent) {
            const sCharacterId = oEvent.getParameter("arguments").characterId;
            const oView = this.getView();
            oView.setBusy(true);

            oView.setModel(new JSONModel({}));

            fetch("/odata/v4/character-info/Characters(" + sCharacterId + ")")
                .then(function (response) { return response.json(); })
                .then(function (data) {
                    
                    oView.setModel(new JSONModel(data));
                    oView.setBusy(false);
                })
                .catch(function (err) {
                    console.error("Error loading character:", err);
                    oView.setBusy(false);
                });
        }
    });
});