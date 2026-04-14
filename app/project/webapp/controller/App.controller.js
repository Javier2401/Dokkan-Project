sap.ui.define([
  "project/controller/BaseController"
], (BaseController) => {
  "use strict";

  return BaseController.extend("project.controller.App", {
      onInit() { },

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