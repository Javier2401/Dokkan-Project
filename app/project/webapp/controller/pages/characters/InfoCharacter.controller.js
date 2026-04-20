sap.ui.define([
    "project/controller/shared/BaseController",
    "sap/ui/model/json/JSONModel",
    "project/model/CharacterUtils"
], (BaseController, JSONModel, CharacterUtils) => {
    "use strict";

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
                    oView.getModel("linkSkills").setProperty("/skills",
                        (d.linkSkills || "").split(" - ")
                            .map(s => s.trim()).filter(Boolean).map(s => ({ name: s }))
                    );
                    oView.getModel("categories").setProperty("/items",
                        CharacterUtils.parseCategories(d.categories).map(name => ({ name }))
                    );
                    oView.getModel("stats").setData(CharacterUtils.buildStats(d));
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