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

        _onRouteMatched: function (oEvent) {
            const sCharacterId = oEvent.getParameter("arguments").characterId;
            // Bind this view to the OData entity — all {fieldName} bindings in the XML work automatically
            this.getView().bindElement({
                path: `/Characters(${sCharacterId})`,
                events: {
                    dataRequested: () => { this.getView().setBusy(true);  },
                    dataReceived: ()  => { this.getView().setBusy(false); }
                }
            });
        }
    });
});