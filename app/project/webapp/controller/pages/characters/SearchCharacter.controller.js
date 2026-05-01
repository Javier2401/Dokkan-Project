sap.ui.define([
    "project/controller/shared/BaseController",
    "sap/ui/model/json/JSONModel",
    "project/model/CharacterService"
], (BaseController, JSONModel, CharacterService) => {
    "use strict";

    return BaseController.extend("project.controller.pages.characters.SearchCharacter", {

        onInit() {
            this.getView().setModel(
                new JSONModel({
                    results:      [],
                    hasResults:   false,
                    showEmpty:    true,
                    emptyMessage: ""
                }),
                "chars"
            );

            this.getOwnerComponent().getRouter()
                .getRoute("RouteSearchCharacter")
                .attachPatternMatched(this._onRouteMatched, this);
        },

        _onRouteMatched() {
            CharacterService.loadAll().catch(err =>
                console.error("SearchCharacter: pre-load failed", err)
            );
            this._reset();
        },

        onLiveSearch(oEvent) {
            this._filter(oEvent.getParameter("newValue") || "");
        },

        onSearch(oEvent) {
            this._filter(oEvent.getParameter("query") || "");
        },

        _filter(sQuery) {
            const oModel  = this.getView().getModel("chars");
            const oBundle = this.getView().getModel("i18n").getResourceBundle();
            const sQ      = sQuery.trim().toLowerCase();

            if (!sQ) {
                this._reset();
                return;
            }

            CharacterService.loadAll()
                .then(aAll => {
                    const aFiltered = aAll.filter(c =>
                        (c.name  || "").toLowerCase().includes(sQ)
                        // (c.title || "").toLowerCase().includes(sQ)
                    );

                    oModel.setProperty("/results",    aFiltered);
                    oModel.setProperty("/hasResults", aFiltered.length > 0);
                    oModel.setProperty("/showEmpty",  aFiltered.length === 0);
                    oModel.setProperty("/emptyMessage",
                        aFiltered.length === 0
                            ? oBundle.getText("search.empty.noresults", [sQuery])
                            : ""
                    );
                })
                .catch(err => {
                    console.error("SearchCharacter: filter failed", err);
                    oModel.setProperty("/showEmpty", true);
                    oModel.setProperty("/emptyMessage",
                        oBundle.getText("search.empty.initial")
                    );
                });
        },

        _reset() {
            const oModel  = this.getView().getModel("chars");
            const oBundle = this.getView().getModel("i18n").getResourceBundle();
            oModel.setProperty("/results",      []);
            oModel.setProperty("/hasResults",   false);
            oModel.setProperty("/showEmpty",    true);
            oModel.setProperty("/emptyMessage", oBundle.getText("search.empty.initial"));
        }
    });
});