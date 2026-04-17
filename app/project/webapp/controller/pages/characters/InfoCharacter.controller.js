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

            this.getView().setModel(
                new JSONModel({ skills: [] }),
                "linkSkills"
            );
        },

        _onRouteMatched(oEvent) {
            const sCharacterId = oEvent.getParameter("arguments").characterId;
            const oView = this.getView();

            oView.setBusy(true);

            const oModel = oView.getModel(); 

            const sPath = `/Characters(${sCharacterId})`;

            oModel.bindContext(sPath)
                .requestObject()
                .then((oData) => {

                    console.log("DATA OK:", oData);

                    const aSkills = (oData.linkSkills || "")
                        .split(" - ")
                        .map(s => s.trim())
                        .filter(Boolean)
                        .map(s => ({ name: s }));

                    oView.getModel("linkSkills")
                        .setProperty("/skills", aSkills);

                    oView.bindElement({
                        path: sPath
                    });

                    oView.setBusy(false);
                })
                .catch((err) => {
                    console.error("OData ERROR:", err);
                    oView.setBusy(false);
                });
        }
    });
});