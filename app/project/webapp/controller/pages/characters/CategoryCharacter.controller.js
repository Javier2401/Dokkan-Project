sap.ui.define([
    "project/controller/shared/BaseController",
    "sap/ui/model/json/JSONModel",
    "project/model/CharacterUtils"
], (BaseController, JSONModel, CharacterUtils) => {
    "use strict";

    return BaseController.extend("project.controller.pages.characters.CategoryCharacter", {

        onInit() {
            this.getView().setModel(
                new JSONModel({
                    categoryName:    "",
                    leaders:         [],
                    subLeaders:      [],
                    cards:           [],
                    hasLeaders:      false,
                    hasSubLeaders:   false,
                    hasCards:        false,
                    hasNoLeaders:    true,
                    hasNoSubLeaders: true,
                    hasNoCards:      true
                }),
                "chars"
            );

            this.getOwnerComponent().getRouter()
                .getRoute("RouteCategory")
                .attachPatternMatched(this._onRouteMatched, this);
        },

        _onRouteMatched(oEvent) {
            const oArgs         = oEvent.getParameter("arguments");
            const oQuery        = oArgs["?query"] || {};
            const sCategoryName = oQuery.name || "";

            const oModel = this.getView().getModel("chars");
            oModel.setData({
                categoryName:    sCategoryName,
                leaders:         [],
                subLeaders:      [],
                cards:           [],
                hasLeaders:      false,
                hasSubLeaders:   false,
                hasCards:        false,
                hasNoLeaders:    true,
                hasNoSubLeaders: true,
                hasNoCards:      true
            });

            this.getView().setBusy(true);

            fetch("/odata/v4/character-info/Characters?$orderby=ID desc")
                .then(r => r.json())
                .then(data => {
                    const aAll = data.value || [];

                    const aFiltered = aAll.filter(c =>
                        CharacterUtils.parseCategories(c.categories).includes(sCategoryName)
                    );

                    const addStats = c => ({
                        ...c,
                        leaderStats: CharacterUtils.parseLeaderStats(c.leaderSkill)
                    });

                    const aLeaders = aFiltered.filter(c =>
                        CharacterUtils.isLeader(c, sCategoryName)
                    ).map(addStats);

                    const aSubLeaders = aFiltered.filter(c =>
                        !CharacterUtils.isLeader(c, sCategoryName) &&
                         CharacterUtils.isSubLeader(c, sCategoryName)
                    ).map(addStats);

                    const aCards = aFiltered.filter(c =>
                        !CharacterUtils.isLeader(c, sCategoryName) &&
                        !CharacterUtils.isSubLeader(c, sCategoryName)
                    );

                    oModel.setProperty("/leaders",          aLeaders);
                    oModel.setProperty("/subLeaders",       aSubLeaders);
                    oModel.setProperty("/cards",            aCards);
                    oModel.setProperty("/hasLeaders",       aLeaders.length    > 0);
                    oModel.setProperty("/hasSubLeaders",    aSubLeaders.length > 0);
                    oModel.setProperty("/hasCards",         aCards.length      > 0);
                    oModel.setProperty("/hasNoLeaders",     aLeaders.length    === 0);
                    oModel.setProperty("/hasNoSubLeaders",  aSubLeaders.length === 0);
                    oModel.setProperty("/hasNoCards",       aCards.length      === 0);

                    this.getView().setBusy(false);
                })
                .catch(err => {
                    console.error("Error loading characters:", err);
                    this.getView().setBusy(false);
                });
        }
    });
});