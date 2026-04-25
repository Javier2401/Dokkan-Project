sap.ui.define([
    "project/controller/shared/BaseController",
    "sap/ui/model/json/JSONModel",
    "project/model/CharacterUtils",
    "project/model/CharacterService"
], (BaseController, JSONModel, CharacterUtils, CharacterService) => {
    "use strict";

    return BaseController.extend("project.controller.pages.characters.AllCategoriesCharacter", {

        onInit() {
            this.getView().setModel(new JSONModel({ items: [] }), "allCats");

            this.getOwnerComponent().getRouter()
                .getRoute("RouteAllCategoriesCharacter")
                .attachPatternMatched(this._onRouteMatched, this);
        },

        _onRouteMatched() {
            const oView = this.getView();
            oView.setBusy(true);

            CharacterService.loadAll()
                .then(aAll => {
                    
                    const oSet = new Set();
                    aAll.forEach(c => {
                        CharacterUtils.parseCategories(c.categories).forEach(cat => {
                            if (cat) oSet.add(cat);
                        });
                    });

                    const aItems = [...oSet].sort((a, b) => a.localeCompare(b))
                        .map(name => ({ name }));

                    oView.getModel("allCats").setProperty("/items", aItems);
                    oView.setBusy(false);
                })
                .catch(err => {
                    console.error("AllCategories: error loading characters:", err);
                    oView.setBusy(false);
                });
        }
    });
});