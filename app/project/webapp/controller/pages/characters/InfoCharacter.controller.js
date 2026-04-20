sap.ui.define([
    "project/controller/shared/BaseController",
    "sap/ui/model/json/JSONModel",
    "project/model/CharacterUtils"
], (BaseController, JSONModel, CharacterUtils) => {
    "use strict";

    // Clases CSS de tipo — deben coincidir con las del CSS
    const TYPE_CLASSES = ["typeAGL", "typeSTR", "typeTEQ", "typeINT", "typePHY"];

    return BaseController.extend("project.controller.pages.characters.InfoCharacter", {

        onInit() {
            this.getOwnerComponent().getRouter()
                .getRoute("RouteInfoCharacter")
                .attachPatternMatched(this._onRouteMatched, this);

            this.getView().setModel(new JSONModel({ skills: [] }), "linkSkills");
            this.getView().setModel(new JSONModel({ items: [] }),  "categories");
            this.getView().setModel(new JSONModel({}),             "stats");
        },

        _onRouteMatched(oEvent) {
            const sId   = oEvent.getParameter("arguments").characterId;
            const oView = this.getView();
            oView.setBusy(true);

            const sPath = `/Characters(${sId})`;

            oView.getModel().bindContext(sPath).requestObject()
                .then(d => {
                    // Link skills
                    oView.getModel("linkSkills").setProperty("/skills",
                        (d.linkSkills || "").split(" - ")
                            .map(s => s.trim()).filter(Boolean).map(s => ({ name: s }))
                    );

                    // Categories
                    oView.getModel("categories").setProperty("/items",
                        CharacterUtils.parseCategories(d.categories).map(name => ({ name }))
                    );

                    // Stats
                    oView.getModel("stats").setData(CharacterUtils.buildStats(d));

                    // Color de borde según el tipo del personaje
                    const oNameBox = oView.byId("cardNameBox");
                    if (oNameBox) {
                        TYPE_CLASSES.forEach(c => oNameBox.removeStyleClass(c));
                        const sType = (d.type || "AGL").trim().toUpperCase();
                        oNameBox.addStyleClass("type" + sType);
                    }

                    oView.bindElement({ path: sPath });
                    oView.setBusy(false);
                })
                .catch(err => {
                    console.error("OData ERROR:", err);
                    oView.setBusy(false);
                });
        }
    });
});