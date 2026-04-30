sap.ui.define([], function () {
    "use strict";

    const COMPOUND_CATEGORIES = [
        "Earth - Bred Fighters",
        "Earth - Protecting Heroes",
        "All - Out Struggle",
        "Target: Goku",
        "Bond of Parent and Child",
    ];

    const COMPOUND_SET = new Set([
        "Earth - Bred Fighters",
        "Earth - Protecting Heroes",
        "All - Out Struggle"
    ]);

    const MONTH_MAP = {
        Jan:"01", Feb:"02", Mar:"03", Apr:"04",
        May:"05", Jun:"06", Jul:"07", Aug:"08",
        Sep:"09", Oct:"10", Nov:"11", Dec:"12"
    };

    return {

        COMPOUND_CATEGORIES,

        parseCategories(str) {
            if (!str) return [];
            const parts = str.split(" - ");
            const result = [];
            let i = 0;
            while (i < parts.length) {
                let matched = false;
                if (i + 1 < parts.length) {
                    const compound = parts[i] + " - " + parts[i + 1];
                    if (COMPOUND_SET.has(compound)) {
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
        },

        formatDate(s) {
            if (!s) return "";
            const p = s.trim().split(" ");
            if (p.length !== 3) return s;
            return `${p[0].padStart(2, "0")}/${MONTH_MAP[p[1]] || "00"}/${p[2]}`;
        },

        formatShortDate(s) {
            if (!s) return "";
            const p = s.trim().split(" ");
            if (p.length !== 3) return s;
            return `${p[0].padStart(2, "0")}/${MONTH_MAP[p[1]] || "00"}/${p[2].slice(2)}`;
        },

        getMaxBoost(ls) {
            const matches = (ls || "").match(/\+(\d+)%/g) || [];
            const nums = matches.map(m => parseInt(m.slice(1)));
            return nums.length ? Math.max(...nums) : 0;
        },

        isLeader(c, cat) {
            return (c.leaderSkill || "").includes(cat) && this.getMaxBoost(c.leaderSkill) >= 170;
        },

        isSubLeader(c, cat) {
            if (this.isLeader(c, cat)) return false;
            const rainbow  = (c.leaderSkill || "").includes("All Types");
            const lowBoost = (c.leaderSkill || "").includes(cat) && this.getMaxBoost(c.leaderSkill) < 170;
            return rainbow || lowBoost;
        },

        parseLeaderStats(ls) {
            const out = { ki: "-", hp: "-", atk: "-", def: "-" };
            if (!ls) return out;

            const kiAll = [...ls.matchAll(/Ki\s*\+(\d+)/gi)];
            if (kiAll.length) out.ki = String(Math.max(...kiAll.map(m => +m[1])));

            const fullAll   = [...ls.matchAll(/HP,\s*ATK\s*&\s*DEF\s*\+(\d+)%/gi)];
            const atkDefAll = [...ls.matchAll(/ATK\s*&\s*DEF\s*\+(\d+)%/gi)];
            const hpAll     = [...ls.matchAll(/HP\s*\+(\d+)%/gi)];

            const hpVals  = [...fullAll, ...hpAll].map(m => +m[1]);
            const atkVals = [...fullAll, ...atkDefAll].map(m => +m[1]);
            const defVals = [...fullAll, ...atkDefAll].map(m => +m[1]);

            if (hpVals.length)  out.hp  = String(Math.max(...hpVals));
            if (atkVals.length) out.atk = String(Math.max(...atkVals));
            if (defVals.length) out.def = String(Math.max(...defVals));

            return out;
        },

        buildStats(d) {
            return {
                hp:     d.hp,
                atk:    d.atk,
                def:    d.def,
                hp55:   d.hp  + 2000,
                atk55:  d.atk + 2000,
                def55:  d.def + 2000,
                hp100:  d.hp  + 5000,
                atk100: d.atk + 5000,
                def100: d.def + 5000,
                releaseDate: this.formatDate(d.releaseDate)
            };
        }
    };
});