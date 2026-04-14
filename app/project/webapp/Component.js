sap.ui.define([
    "sap/ui/core/UIComponent",
    "project/model/models",
    "project/model/LanguageManager"
], (UIComponent, models, LanguageManager) => {
    "use strict";

    return UIComponent.extend("project.Component", {
        metadata: {
            manifest: "json",
            interfaces: ["sap.ui.core.IAsyncContentCreation"]
        },

        init() {
            
            const url = new URL(window.location.href);
            if (!url.searchParams.has("sap-language")) {
                const savedLocale = LanguageManager.getStoredLocale();
                if (savedLocale !== "en") {
                    url.searchParams.set("sap-language", savedLocale);
                    window.location.replace(url.toString());
                    return;
                }
            }

            UIComponent.prototype.init.apply(this, arguments);
            this.setModel(models.createDeviceModel(), "device");
            this.getRouter().initialize();
        }
    });
});