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

    /* A character is a "leader" if its leaderSkill string mentions
       the category name — meaning it buffs allies who belong to it. */
    function isLeader(oChar, sCategoryName) {
        return (oChar.leaderSkill || "").includes(sCategoryName);
    }

    return BaseController.extend("project.controller.pages.characters.CategoryCharacter", {

        onInit() {
            this.getView().setModel(
                new JSONModel({
                    categoryName: "",
                    leaders: [],
                    members: [],
                    hasNoLeaders: false,
                    hasNoMembers: false
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
            oModel.setProperty("/categoryName", sCategoryName);
            oModel.setProperty("/leaders",      []);
            oModel.setProperty("/members",      []);
            oModel.setProperty("/hasNoLeaders", false);
            oModel.setProperty("/hasNoMembers", false);

            this.getView().setBusy(true);

            fetch("/odata/v4/character-info/Characters?$orderby=ID")
                .then(r => r.json())
                .then(data => {
                    const aAll = data.value || [];

                    /* All characters that belong to the category */
                    const aFiltered = aAll.filter(c => {
                        const aCategories = parseCategories(c.categories);
                        return aCategories.includes(sCategoryName);
                    });

                    /* Split into leaders (buff the category) and plain members */
                    const aLeaders = aFiltered.filter(c =>  isLeader(c, sCategoryName));
                    const aMembers = aFiltered.filter(c => !isLeader(c, sCategoryName));

                    oModel.setProperty("/leaders",      aLeaders);
                    oModel.setProperty("/members",      aMembers);
                    oModel.setProperty("/hasNoLeaders", aLeaders.length === 0);
                    oModel.setProperty("/hasNoMembers", aMembers.length === 0);

                    this.getView().setBusy(false);
                })
                .catch(err => {
                    console.error("Error loading characters:", err);
                    oModel.setProperty("/hasNoLeaders", true);
                    oModel.setProperty("/hasNoMembers", true);
                    this.getView().setBusy(false);
                });
        }
    });
});