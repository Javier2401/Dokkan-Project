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

    const MONTH_MAP = {
        Jan:"01", Feb:"02", Mar:"03", Apr:"04",
        May:"05", Jun:"06", Jul:"07", Aug:"08",
        Sep:"09", Oct:"10", Nov:"11", Dec:"12"
    };
    function formatDate(s) {
        if (!s) return "";
        const p = s.trim().split(" ");
        if (p.length !== 3) return s;
        return `${p[0].padStart(2,"0")}/${MONTH_MAP[p[1]] || "00"}/${p[2]}`;
    }

    function buildStats(d) {
        return {
            hp:    d.hp,  atk:    d.atk,  def:    d.def,
            hp55:  d.hp  + 2000, atk55:  d.atk + 2000, def55:  d.def + 2000,
            hp100: d.hp  + 5000, atk100: d.atk + 5000, def100: d.def + 5000,
            releaseDate: formatDate(d.releaseDate)
        };
    }

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
                    oView.getModel("categories").setProperty("/items", parseCategories(d.categories));
                    oView.getModel("stats").setData(buildStats(d));
                    oView.bindElement({ path: sPath });
                    oView.setBusy(false);
                })
                .catch(err => { console.error("OData ERROR:", err); oView.setBusy(false); });
        }
    });
});