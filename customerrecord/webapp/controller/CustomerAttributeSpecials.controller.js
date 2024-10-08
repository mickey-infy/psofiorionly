sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/Fragment"
],
    function (Controller, Fragment) {
        "use strict";  

        return Controller.extend("com.pso.customerrecord.controller.CustomerAttributeSpecials", {
            onInit: function () {
                var oRouter = this.getOwnerComponent().getRouter();
                oRouter.getRoute("CustomerAttributeSpecials").attachMatched(function (oEvent) {
                    //   currentScope= oEvent.getParameter("arguments").scope;
                    this._loadFragmentPerScope(oEvent.getParameter("arguments").scope);
                }, this);
            },
            _loadFragmentPerScope: function(currentScope){
                var oScope = currentScope;
                //this.onCreateFusesAtLedRows();
            },

            onDisplaySpecials:function(){
                this.getView().byId("idpanelCreateSpecials").setVisible(false);
                this.getView().byId("idpanelDisplaySpecials").setVisible(true);
            },

            // onCreateFusesAtLedRows:function(){

            // },
        onBack :function(){
            window.history.go(-1); 
        }  
    });
});