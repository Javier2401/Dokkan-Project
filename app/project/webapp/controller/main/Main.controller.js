sap.ui.define([
    "project/controller/shared/BaseController",
    "sap/ui/model/json/JSONModel",
    "project/model/CharacterUtils"
], (BaseController, JSONModel, CharacterUtils) => {
    "use strict";

    return BaseController.extend("project.controller.main.Main", {

        onInit() {
            this.getView().setModel(new JSONModel({ upcoming: [], recent: [] }), "chars");
            this._loadCharacters();
        },

        _loadCharacters() {
            const oModel = this.getView().getModel("chars");
            fetch("/odata/v4/character-info/Characters?$orderby=ID desc")
                .then(r => r.json())
                .then(data => {
                    const aAll = (data.value || []).map(c => ({
                        ...c,
                        releaseDateFmt: CharacterUtils.formatShortDate(c.releaseDate)
                    }));
                    oModel.setProperty("/upcoming", aAll.filter(c =>  c.isUpcoming === true));
                    oModel.setProperty("/recent",   aAll.filter(c =>  c.isUpcoming !== true));
                })
                .catch(err => console.error("Error loading characters:", err));
        }
    });
});