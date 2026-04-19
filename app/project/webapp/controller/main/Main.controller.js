sap.ui.define([
    "project/controller/shared/BaseController",
    "sap/ui/model/json/JSONModel"
], (BaseController, JSONModel) => {
    "use strict";

    const MONTH_MAP = {
        Jan:"01", Feb:"02", Mar:"03", Apr:"04", May:"05", Jun:"06",
        Jul:"07", Aug:"08", Sep:"09", Oct:"10", Nov:"11", Dec:"12"
    };

    function formatShortDate(s) {
        if (!s) return "";
        const p = s.trim().split(" ");
        if (p.length !== 3) return s;
        return `${p[0].padStart(2,"0")}/${MONTH_MAP[p[1]] || "00"}/${p[2].slice(2)}`;
    }

    return BaseController.extend("project.controller.main.Main", {

        onInit() {
            this.getView().setModel(new JSONModel({ upcoming: [], recent: [] }), "chars");
            this._loadCharacters();
        },

        _loadCharacters() {
            const oModel = this.getView().getModel("chars");
            fetch("/odata/v4/character-info/Characters?$orderby=ID desc")
                .then(r => r.json())
                .then(data => {
                    const aAll = (data.value || []).map(c => ({
                        ...c,
                        releaseDateFmt: formatShortDate(c.releaseDate)
                    }));
                    oModel.setProperty("/upcoming", aAll.filter(c =>  c.isUpcoming === true));
                    oModel.setProperty("/recent",   aAll.filter(c =>  c.isUpcoming !== true));
                })
                .catch(err => console.error("Error loading characters:", err));
        }
    });
});