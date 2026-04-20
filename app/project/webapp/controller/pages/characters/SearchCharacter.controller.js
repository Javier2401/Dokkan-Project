sap.ui.define([
    "project/controller/shared/BaseController",
    "sap/ui/model/json/JSONModel"
], (BaseController, JSONModel) => {
    "use strict";

    return BaseController.extend("project.controller.pages.characters.SearchCharacter", {

        onInit() {
            
            this.getView().setModel(
                new JSONModel({
                    results:      [],
                    hasResults:   false,
                    showEmpty:    true,
                    emptyMessage: "Type a name or title to search characters."
                }),
                "chars"
            );

            this._allCharacters = [];

            this.getOwnerComponent().getRouter()
                .getRoute("RouteSearchCharacter")
                .attachPatternMatched(this._onRouteMatched, this);
        },

        _onRouteMatched() {
            // Carga solo si aún no tenemos datos
            if (this._allCharacters.length === 0) {
                this._loadAll();
            }
            this._reset();
        },

        _loadAll() {
            fetch("/odata/v4/character-info/Characters?$orderby=name asc")
                .then(r => r.json())
                .then(data => {
                    this._allCharacters = data.value || [];
                })
                .catch(err => console.error("SearchCharacter: error loading characters", err));
        },

        onLiveSearch(oEvent) {
            this._filter(oEvent.getParameter("newValue") || "");
        },

        onSearch(oEvent) {
            this._filter(oEvent.getParameter("query") || "");
        },

        _filter(sQuery) {
            const oModel = this.getView().getModel("chars");
            const sQ     = sQuery.trim().toLowerCase();

            if (!sQ) {
                this._reset();
                return;
            }

            const aFiltered = this._allCharacters.filter(c =>
                (c.name  || "").toLowerCase().includes(sQ) ||
                (c.title || "").toLowerCase().includes(sQ)
            );

            oModel.setProperty("/results",    aFiltered);
            oModel.setProperty("/hasResults", aFiltered.length > 0);
            oModel.setProperty("/showEmpty",  aFiltered.length === 0);
            oModel.setProperty("/emptyMessage",
                aFiltered.length === 0
                    ? `No characters found for "${sQuery}".`
                    : ""
            );
        },

        _reset() {
            const oModel = this.getView().getModel("chars");
            oModel.setProperty("/results",      []);
            oModel.setProperty("/hasResults",   false);
            oModel.setProperty("/showEmpty",    true);
            oModel.setProperty("/emptyMessage", "Type a name or title to search characters.");
        }
    });
});