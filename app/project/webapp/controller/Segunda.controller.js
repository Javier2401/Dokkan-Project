sap.ui.define([
    "sap/ui/core/mvc/Controller"
], (Controller) => {
    "use strict";

    return Controller.extend("project.controller.Segunda", {
        onInit() {
        },

        changeViewToMain: function() {
            this.getOwnerComponent().getRouter().navTo("RouteMain");
        },
    });
});