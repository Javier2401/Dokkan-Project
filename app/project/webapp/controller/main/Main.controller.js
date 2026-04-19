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
            const oCharsModel = this.getView().getModel("chars");

            fetch("/odata/v4/character-info/Characters?$orderby=ID desc")
                .then(function (response) { return response.json(); })
                .then(function (data) {
                    const aAll      = data.value || [];
                    const aUpcoming = aAll.filter(function (c) { return c.isUpcoming  === true; });
                    const aRecent   = aAll.filter(function (c) { return c.isUpcoming !== true; });
                    oCharsModel.setProperty("/upcoming", aUpcoming);
                    oCharsModel.setProperty("/recent",   aRecent);
                })
                .catch(function (err) {
                    console.error("Error loading characters:", err);
                });
        }
    });
});