sap.ui.define([
    "project/controller/shared/BaseController"
], (BaseController) => {
    "use strict";

    return BaseController.extend("project.controller.pages.characters.InfoCharacter", {

        onInit() {
            const oRouter = this.getOwnerComponent().getRouter();
            oRouter.getRoute("RouteInfoCharacter")
                .attachPatternMatched(this._onRouteMatched, this);
        },

        _onRouteMatched(oEvent) {
            const sCharacterId = oEvent.getParameter("arguments").characterId;
            const oView = this.getView();

            oView.setBusy(true);

            const sPath = "/Characters(" + sCharacterId + ")";

            const oModel = this.getOwnerComponent().getModel();

            oView.bindElement({
                path: sPath,
                events: {
                    dataRequested: function () {
                        oView.setBusy(true);
                    },
                    dataReceived: function () {
                        oView.setBusy(false);
                    }
                }
            });
        }
    });
});