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
                    result.push({ name: compound });
                    i += 2;
                    matched = true;
                }
            }
            if (!matched) {
                const trimmed = (parts[i] || "").trim();
                if (trimmed) result.push({ name: trimmed });
                i++;
            }
        }
        return result;
    }

    return BaseController.extend("project.controller.pages.characters.InfoCharacter", {

        onInit() {
            const oRouter = this.getOwnerComponent().getRouter();

            oRouter.getRoute("RouteInfoCharacter")
                .attachPatternMatched(this._onRouteMatched, this);

            this.getView().setModel(new JSONModel({ skills: [] }), "linkSkills");
            this.getView().setModel(new JSONModel({ items: [] }), "categories");
        },

        _onRouteMatched(oEvent) {
            const sCharacterId = oEvent.getParameter("arguments").characterId;
            const oView = this.getView();

            oView.setBusy(true);

            const oModel = oView.getModel();
            const sPath  = `/Characters(${sCharacterId})`;

            oModel.bindContext(sPath)
                .requestObject()
                .then((oData) => {

                    const aSkills = (oData.linkSkills || "")
                        .split(" - ")
                        .map(s => s.trim())
                        .filter(Boolean)
                        .map(s => ({ name: s }));
                    oView.getModel("linkSkills").setProperty("/skills", aSkills);

                    const aCategories = parseCategories(oData.categories);
                    oView.getModel("categories").setProperty("/items", aCategories);

                    oView.bindElement({ path: sPath });
                    oView.setBusy(false);
                })
                .catch((err) => {
                    console.error("OData ERROR:", err);
                    oView.setBusy(false);
                });
        }
    });
});