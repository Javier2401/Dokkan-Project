sap.ui.define([
    "project/controller/shared/BaseController",
    "sap/ui/model/json/JSONModel"
], (BaseController, JSONModel) => {
    "use strict";

    return BaseController.extend("project.controller.main.Main", {

        onInit() {
            const oCharsModel = new JSONModel({ upcoming: [], recent: [] });
            this.getView().setModel(oCharsModel, "chars");
            this._loadCharacters();
        },

        _loadCharacters: function () {
            const oODataModel = this.getOwnerComponent().getModel();
            const oCharsModel = this.getView().getModel("chars");

            oODataModel.bindList("/Characters")
                .requestContexts(0, 200)
                .then(aContexts => {
                    const aAll = aContexts.map(ctx => ctx.getObject());
                    oCharsModel.setProperty("/upcoming", aAll.filter(c => c.isUpcoming === true));
                    oCharsModel.setProperty("/recent",   aAll.filter(c => c.isUpcoming === false));
                })
                .catch(oErr => {
                    console.error("Error loading characters:", oErr);
                });
        }
    });
});