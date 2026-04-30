sap.ui.define([], function () {
    "use strict";

    const SELECT_FIELDS = [
        "ID", "title", "name", "rarity", "type", "classType",
        "thumbnail", "leaderSkill", "categories", "releaseDate",
        "isUpcoming", "isEZA"
    ].join(",");

    const BASE_URL = "/odata/v4/character-info/Characters";
    let _oPromise  = null;

    return {

        loadAll() {
            if (!_oPromise) {
                _oPromise = fetch(
                    `${BASE_URL}?$orderby=ID desc&$select=${SELECT_FIELDS}`
                )
                    .then(r => {
                        if (!r.ok) throw new Error(`CharacterService HTTP ${r.status}`);
                        return r.json();
                    })
                    .then(data => data.value || [])
                    .catch(err => {
                        _oPromise = null;
                        throw err;
                    });
            }
            return _oPromise;
        },

        invalidate() {
            _oPromise = null;
        }
    };
});