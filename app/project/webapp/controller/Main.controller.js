sap.ui.define([
    "project/controller/BaseController"
], (BaseController) => {
    "use strict";

    return BaseController.extend("project.controller.Main", {

        onInit() {
            
            /** 
            const oModel = this.getView().getModel();
            oModel.read("/Characters", {
            success: (data) => console.log(data),
            error:   (err)  => console.error(err)
            
            });
            */
        },

        onNavBanners:    function() { },
        onNavMissions:   function() { },
        onNavCharacters: function() { },
        onNavEvents:     function() { },
        onNavItems:      function() { },
        onOpenProfile:   function() { },
        onOpenSettings:  function() { },
        onOpenPrivacy:   function() { },
        onOpenCookies:   function() { },
        onOpenTerms:     function() { },
    });
});