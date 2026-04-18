sap.ui.define([
    "project/controller/shared/BaseController",
    "sap/ui/model/json/JSONModel"
], (BaseController, JSONModel) => {
    "use strict";

    const COMPOUND_CATEGORIES = [
        "Earth - Bred Fighters",
        "Earth - Protecting Heroes",
        "All - Out Struggle"
    ];

    function parseCategories(str) {
        const parts = (str || "").split(" - ");
        const result = [];
        let i = 0;
        while (i < parts.length) {
            let matched = false;
            if (i + 1 < parts.length) {
                const compound = parts[i] + " - " + parts[i + 1];
                if (COMPOUND_CATEGORIES.includes(compound)) {
                    result.push(compound);
                    i += 2;
                    matched = true;
                }
            }
            if (!matched) {
                const trimmed = (parts[i] || "").trim();
                if (trimmed) result.push(trimmed);
                i++;
            }
        }
        return result;
    }

    return BaseController.extend("project.controller.pages.characters.CategoryCharacter", {

        onInit() {
            this.getView().setModel(
                new JSONModel({ characters: [], categoryName: "", hasNoResults: false }),
                "chars"
            );

            this.getOwnerComponent().getRouter()
                .getRoute("RouteCategory")
                .attachPatternMatched(this._onRouteMatched, this);
        },

        _onRouteMatched(oEvent) {
            const oArgs        = oEvent.getParameter("arguments");
            const oQuery       = oArgs["?query"] || {};
            const sCategoryName = oQuery.name || "";

            const oModel = this.getView().getModel("chars");
            oModel.setProperty("/categoryName", sCategoryName);
            oModel.setProperty("/characters",   []);
            oModel.setProperty("/hasNoResults",  false);

            this.getView().setBusy(true);

            fetch("/odata/v4/character-info/Characters?$orderby=ID")
                .then(r => r.json())
                .then(data => {
                    const aAll = data.value || [];

                    const aFiltered = aAll.filter(c => {
                        const aCategories = parseCategories(c.categories);
                        return aCategories.includes(sCategoryName);
                    });

                    oModel.setProperty("/characters",  aFiltered);
                    oModel.setProperty("/hasNoResults", aFiltered.length === 0);
                    this.getView().setBusy(false);
                })
                .catch(err => {
                    console.error("Error loading characters:", err);
                    oModel.setProperty("/hasNoResults", true);
                    this.getView().setBusy(false);
                });
        }
    });
});