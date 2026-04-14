sap.ui.define([], function() {
    "use strict";

    return {
   
        changeLanguage: function(sLocale) {
            
            localStorage.setItem("dokkanLocale", sLocale);
            
            const url = new URL(window.location.href);
            url.searchParams.set("sap-language", sLocale);
            window.location.href = url.toString();
        },

        getStoredLocale: function() {
            return localStorage.getItem("dokkanLocale") || "en";
        }
    };
});