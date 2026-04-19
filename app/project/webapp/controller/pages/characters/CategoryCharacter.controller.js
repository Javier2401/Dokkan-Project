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

    function getMaxBoost(ls) {
        const matches = (ls || "").match(/\+(\d+)%/g) || [];
        const nums = matches.map(m => parseInt(m.slice(1)));
        return nums.length ? Math.max(...nums) : 0;
    }

    function isLeader(c, cat) {
        return (c.leaderSkill || "").includes(cat) && getMaxBoost(c.leaderSkill) >= 170;
    }

    function isSubLeader(c, cat) {
        if (isLeader(c, cat)) return false;
        const rainbow  = (c.leaderSkill || "").includes("All Types");
        const lowBoost = (c.leaderSkill || "").includes(cat) && getMaxBoost(c.leaderSkill) < 170;
        return rainbow || lowBoost;
    }

    /**
     * Extrae Ki, HP%, ATK% y DEF% máximos del Leader Skill.
     */
    function parseLeaderStats(ls) {
        const out = { ki: "-", hp: "-", atk: "-", def: "-" };
        if (!ls) return out;

        // Ki — valor máximo
        const kiAll = [...ls.matchAll(/Ki\s*\+(\d+)/gi)];
        if (kiAll.length) out.ki = `+${Math.max(...kiAll.map(m => +m[1]))}`;

        // "HP, ATK & DEF +X%"
        const fullAll = [...ls.matchAll(/HP,\s*ATK\s*&\s*DEF\s*\+(\d+)%/gi)];
        // "ATK & DEF +X%"
        const atkDefAll = [...ls.matchAll(/ATK\s*&\s*DEF\s*\+(\d+)%/gi)];
        // "HP +X%"
        const hpAll = [...ls.matchAll(/HP\s*\+(\d+)%/gi)];

        const hpVals  = [...fullAll, ...hpAll].map(m => +m[1]);
        const atkVals = [...fullAll, ...atkDefAll].map(m => +m[1]);
        const defVals = [...fullAll, ...atkDefAll].map(m => +m[1]);

        if (hpVals.length)  out.hp  = `+${Math.max(...hpVals)}%`;
        if (atkVals.length) out.atk = `+${Math.max(...atkVals)}%`;
        if (defVals.length) out.def = `+${Math.max(...defVals)}%`;

        return out;
    }

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
                        parseCategories(c.categories).includes(sCategoryName)
                    );

                    // Añadir leaderStats a leaders y sub-leaders
                    const addStats = c => ({ ...c, leaderStats: parseLeaderStats(c.leaderSkill) });

                    const aLeaders    = aFiltered.filter(c =>  isLeader(c, sCategoryName)).map(addStats);
                    const aSubLeaders = aFiltered.filter(c => !isLeader(c, sCategoryName) && isSubLeader(c, sCategoryName)).map(addStats);
                    const aCards      = aFiltered.filter(c => !isLeader(c, sCategoryName) && !isSubLeader(c, sCategoryName));

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