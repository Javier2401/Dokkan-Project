sap.ui.define([
    "project/controller/shared/BaseController",
    "sap/ui/model/json/JSONModel",
    "project/model/CharacterUtils",
    "project/model/CharacterService"
], (BaseController, JSONModel, CharacterUtils, CharacterService) => {
    "use strict";

    return BaseController.extend("project.controller.main.Main", {

        onInit() {
            this.getView().setModel(new JSONModel({ upcoming: [], recent: [] }), "chars");
            this._loadCharacters();
        },

        _loadCharacters() {
            const oModel = this.getView().getModel("chars");

            CharacterService.loadAll()
                .then(aAll => {
                    const aEnhanced = aAll.map(c => ({
                        ...c,
                        releaseDateFmt: CharacterUtils.formatShortDate(c.releaseDate)
                    }));
                    oModel.setProperty("/upcoming", aEnhanced.filter(c => c.isUpcoming === true));
                    oModel.setProperty("/recent",   aEnhanced.filter(c => c.isUpcoming !== true));
                })
                .catch(err => console.error("Main: error loading characters:", err));
        }
    });
});