sap.ui.define([
    "project/controller/shared/BaseController"
], (BaseController) => {
    "use strict";

    return BaseController.extend("project.controller.pages.characters.InfoCharacter", {

        onInit() {
            const oRouter = this.getOwnerComponent().getRouter();
            oRouter.getRoute("RouteInfoCharacter").attachPatternMatched(this._onRouteMatched, this);
        },

        _onRouteMatched: function(oEvent) {
            const sCharacterId = oEvent.getParameter("arguments").characterId;
            const sPath = `/Characters(${sCharacterId})`;
            this.getView().bindElement({
                path: sPath,
                events: {
                    dataRequested: () => { },
                    dataReceived: () => { }
                }
            });
        }
    });
});