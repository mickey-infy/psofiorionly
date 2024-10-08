sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/Fragment"
],
    function (Controller, Fragment) {
        "use strict";

        return Controller.extend("com.pso.customerrecord.controller.CustomerDetails", {
            onInit: function () {
                //var currentScope = null;
                var oRouter = this.getOwnerComponent().getRouter();
                oRouter.getRoute("CustomerDetails").attachMatched(function (oEvent) {
                    //   currentScope= oEvent.getParameter("arguments").scope;
                    this._loadFragmentPerScope(oEvent.getParameter("arguments").scope);
                }, this);

                this.oEdiFlag = "";

            },
            _loadFragmentPerScope: function (currentScope) {

                var superior_flag = this.getOwnerComponent().getModel("oCustomerAttributesJModel").oData.superior_flag;
                //  if (currentScope == "cd_create" && superior_flag== "X") {
                if (superior_flag == "X") { //create child
                    this.getView().byId("_IDButtonCreateRecord").setText("Create Record");
                    this.getView().byId("idpanel").setVisible(true);
                    this.getView().byId("idpanel2").setVisible(false);
                    this.getView().byId("_IDButtonCreateRecord").setVisible(true)
                    this.getView().byId("_IDButtonEditRecord").setVisible(false);
                    this.getView().byId("_IDGenButtonCreateSp").setVisible(false);
                    this.getView().byId("idButtonView").setVisible(false)
 
                    //this.LoadFragmentCreateChield(); 
                    //  } else if (currentScope == "cd_display" && superior_flag== "") {
                } else if (superior_flag == "") { // display child
                    this.getView().byId("idpanel").setVisible(false);
                    this.getView().byId("idpanel2").setVisible(true);
                    this.getView().byId("_IDButtonEditRecord").setVisible(true);
                    this.getView().byId("_IDButtonCreateRecord").setVisible(false);
                    this.getView().byId("idPageSecEmerContact_DC").setVisible(true);
                    this.getView().byId("_IDGenButtonCreateSp").setVisible(true);
                    this.getView().byId("idButtonView").setVisible(false)
                    
                    this.getCustomerAttribute();
                    //this.LoadFragmentDisplayChield();
                } else if (currentScope == "cd_display_limited" && superior_flag == "") {
                    this.getView().byId("idpanel").setVisible(false);
                    this.getView().byId("idpanel2").setVisible(true);
                    this.getView().byId("idPageSecEmerContact_DC").setVisible(false);
                    this.getView().byId("_IDGenButtonCreateSp").setVisible(false);
                    //this.LoadFragmentDisplayChield();
                }
                //cd_display_limited
                //this.getDropdowns();

                // //Binding Consolidated Dropdown values
                // var oCreateChildFlockJModel_DD = this.getOwnerComponent().getModel("oCreateChildFlockJModel_DD")
                // this.oDropdownData = this.getOwnerComponent().getModel("dropDownJsonModel").getProperty("/DropdownData");
                // oCreateChildFlockJModel_DD.setProperty("/DropdownCreateChildFlock", this.oDropdownData);

            },

               //**********************Editing Customer*****************************************/
               onEditCustomerAttribute: function () {
                this.oEdiFlag = "X";
                this.getView().byId("_IDButtonCreateRecord").setText("Update Record");
                this.getView().byId("idpanel").setVisible(true);
                this.getView().byId("idpanel2").setVisible(false);
                this.getView().byId("_IDButtonCreateRecord").setVisible(true);
                this.getView().byId("_IDButtonEditRecord").setVisible(false);
                this.getView().byId("idButtonView").setVisible(true)

            },

            onViewRecord:function(){
                this.getView().byId("idpanel").setVisible(false);
                this.getView().byId("idpanel2").setVisible(true);
                this.getView().byId("_IDButtonCreateRecord").setVisible(false);
                this.getView().byId("_IDButtonEditRecord").setVisible(true);
                this.getView().byId("idButtonView").setVisible(false)
            },

            //*******************************F4 Help for Substation**********************/

            onHelpSubstation: function (oEvt) {
                var sPath = this.getOwnerComponent().getModel().sServiceUrl + "/substation_dropdownSet";
                var oSubstationJModel = this.getView().getModel("oSubstationJModel");
                oSubstationJModel.loadData(sPath, null, false, "GET", false, false, null);

                var _valueHelpSubstationDialog = new sap.m.SelectDialog({

                    title: "Substation", contentHeight: "50%", titleAlignment: "Center",
                    items: {
                        path: "/d/results",
                        template: new sap.m.StandardListItem({
                            title: "{substation}",
                            description: "",
                            customData: [new sap.ui.core.CustomData({
                                key: "Key",
                                value: "{substation}"
                            })]

                        })
                    },
                    liveChange: function (oEvent) {
                        var sValue = oEvent.getParameter("value");
                        var oFilter = new sap.ui.model.Filter("substation", sap.ui.model.FilterOperator.Contains, sValue);
                        oEvent.getSource().getBinding("items").filter([oFilter]);
                    },
                    confirm: [this._handleSubstationClose, this],
                    cancel: [this._handleSubstationClose, this]
                });
                _valueHelpSubstationDialog.setModel(oSubstationJModel);
                _valueHelpSubstationDialog.open();
            },

            _handleSubstationClose: function (oEvent) {
                var oSelectedItem = oEvent.getParameter("selectedItem");
                if (oSelectedItem) {
                    this.objSubstation = oSelectedItem.getBindingContext().getObject();
                    this.getView().byId("idSubstation_CC").setValue(oSelectedItem.getTitle());
                    this.getView().byId("idCircuit_CC").setValue();
                }
            },

            //************************F4 Help for Circuit***********************************/
            onHelpCircuit: function (oEvt) {
                var oSubstation = this.getView().byId("idSubstation_CC").getValue();
                if (oSubstation === "") {
                    sap.m.MessageBox.show(this.getView().getModel("i18n").getProperty("text_note_mandatory"), {
                        icon: sap.m.MessageBox.Icon.WARNING,
                        title: this.getView().getModel("i18n").getProperty("error"),
                        actions: [sap.m.MessageBox.Action.OK]
                    });
                    this.getView().byId("idCircuit_CC").setValue();
                    return;
                }

                this.oDCPLIND = this.getView().byId("idDCPLIND_CC").getSelectedButton().getText();
                var sPath = this.getOwnerComponent().getModel().sServiceUrl + "/circuit_dropdownSet";
                var oCircuitJModel = this.getView().getModel("oCircuitJModel");
                oCircuitJModel.loadData(sPath, null, false, "GET", false, false, null);
                // Create filters
                var oFilterSubstation = new sap.ui.model.Filter("substation", sap.ui.model.FilterOperator.EQ, this.objSubstation.substation);
                var oFilterDCPLIND = new sap.ui.model.Filter("dc_pl", sap.ui.model.FilterOperator.EQ, this.oDCPLIND);
                // Combine filters
                var oFiltersF = [oFilterSubstation, oFilterDCPLIND];


                var _valueHelpCircuitDialog = new sap.m.SelectDialog({

                    title: "Circuit", contentHeight: "50%", titleAlignment: "Center",
                    items: {
                        path: "/d/results",
                        template: new sap.m.StandardListItem({
                            title: "{circuit}",
                            description: "",
                            customData: [new sap.ui.core.CustomData({
                                key: "Key",
                                value: "{circuit}"
                            })]

                        })
                    },
                    liveChange: function (oEvent) {
                        var sValue = oEvent.getParameter("value");
                        var oFilter = new sap.ui.model.Filter("circuit", sap.ui.model.FilterOperator.Contains, sValue);
                        oEvent.getSource().getBinding("items").filter([oFilter]);
                    },
                    confirm: [this._handleCircuitClose, this],
                    cancel: [this._handleCircuitClose, this]
                });
                _valueHelpCircuitDialog.setModel(oCircuitJModel);
                //Apply Filters
                var oCircuit = _valueHelpCircuitDialog.getBinding("items");
                oCircuit.filter([oFiltersF]);
                _valueHelpCircuitDialog.open();
            },

            _handleCircuitClose: function (oEvent) {
                var oSelectedItem = oEvent.getParameter("selectedItem");
                if (oSelectedItem) {
                    this.obj = oSelectedItem.getBindingContext().getObject();
                    this.getView().byId("idCircuit_CC").setValue(oSelectedItem.getTitle());
                }
            },

            //*********************Getting Circuit and Substation dropdown values **********/
            // getDropdowns: function () {
            //     var that = this;
            //     //var fService = this.getOwnerComponent().getModel().sServiceUrl;
            //     //var oCRMModel = new sap.ui.model.odata.ODataModel(fService, false);
            //     var firstCall = new Promise(function (resolve, reject) {
            //         that.getOwnerComponent().getModel().read("/substation_dropdownSet", {
            //             //    this.oDataModel.read("Customer_searchSet", {
            //             success: function (oData) {
            //                 resolve(oData);
            //             },
            //             error: function (error) {
            //                 sap.m.MessageBox.show(
            //                     error.message, {
            //                     icon: sap.m.MessageBox.Icon.ERROR,
            //                     title: "Error",
            //                     actions: [sap.m.MessageBox.Action.OK]
            //                 });
            //                 resolve(error);
            //             }
            //         });
            //     });
            //     //var oModel3 = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZAPP_FILE_UPLOAD_DMS_SRV");
            //     var secondCall = new Promise(function (resolve, reject) {
            //         that.getOwnerComponent().getModel().read("/circuit_dropdownSet", {
            //             //    this.oDataModel.read("Customer_searchSet", {
            //             success: function (oData) {
            //                 resolve(oData);
            //             },
            //             error: function (error) {
            //                 sap.m.MessageBox.show(
            //                     error.message, {
            //                     icon: sap.m.MessageBox.Icon.ERROR,
            //                     title: "Error",
            //                     actions: [sap.m.MessageBox.Action.OK]
            //                 });
            //                 reject(error);
            //             }
            //         });
            //     });
            //     Promise.all([firstCall, secondCall]).then(function (aResults) {
            //         var oData1 = aResults[0];
            //         var oData2 = aResults[1];
            //         that.getOwnerComponent().getModel("oSubstationJModel").setProperty("/oSubstation", oData1.results);
            //         that.getOwnerComponent().getModel("oCircuitJModel").setProperty("/oCircuit", oData2.results);
            //     });
            // },

            //**************************Getting Cutomer Attrubutes*******************************/
            getCustomerAttribute: function () {
                //var that = this;
                var oConnectionObject = this.getOwnerComponent().getModel("oCustomerAttributesJModel").oData.conn_obj;
                var oCustomerAttributesJModel = this.getOwnerComponent().getModel("oCustomerAttributesJModel");
                this.getOwnerComponent().getModel().read("/Customer_attributeSet(conn_obj='" + oConnectionObject + "')", {
                    //    this.oDataModel.read("Customer_searchSet", {
                    success: function (oData) {
                        //that.oBusyIndicator.close()

                        oCustomerAttributesJModel.setData(oData);


                    },
                    error: function (error) {
                        //that.oBusyIndicator.close();
                        sap.m.MessageBox.show(
                            error.message, {
                            icon: sap.m.MessageBox.Icon.ERROR,
                            title: "Error",
                            actions: [sap.m.MessageBox.Action.OK]
                        });
                        oCustomerAttributesJModel.setData([]);
                    }
                });
            },
            //**********************************Loading Fragments*********************************/ 
            // LoadFragmentCreateChield: function () {
            //     var that = this;
            //     var oCreateChildFlockJModel_DD = this.getOwnerComponent().getModel("oCreateChildFlockJModel_DD");
            //     // oCreateChildFlockJModel_DD= new sap.ui.model.json.JSONModel();
            //     that.oDropdownData = this.getOwnerComponent().getModel("dropDownJsonModel").getProperty("/DropdownData");
            //     oCreateChildFlockJModel_DD.setProperty("/DropdownCreateChildFlock", that.oDropdownData);

            //     var oView = this.getView();
            //     if (!this._oFragmentA) {
            //         this._oFragmentA = Fragment.load({
            //             id: oView.getId(),
            //             name: "com.pso.customerrecord.fragment.CreateChildFloc",
            //             controller: this
            //         }).then(function (oFragment) {
            //             oView.addDependent(oFragment);
            //             return oFragment;
            //         });


            //     }

            //     this._oFragmentA.then(function (oFragment) {
            //         oView.byId("idpanel").removeAllContent(oFragment);
            //         oView.byId("idpanel").addContent(oFragment);
            //         //oFragment.setModel(oCreateChildFlockJModel_DD, "oCreateChildFlockJModel_DD");


            //     });

            // },

            // LoadFragmentDisplayChield: function () {
            //     var that = this;
            //     var oCreateChildFlockJModel_DD = this.getOwnerComponent().getModel("oCreateChildFlockJModel_DD");
            //     // oCreateChildFlockJModel_DD= new sap.ui.model.json.JSONModel();
            //     that.oDropdownData = this.getOwnerComponent().getModel("dropDownJsonModel").getProperty("/DropdownData");
            //     oCreateChildFlockJModel_DD.setProperty("/DropdownCreateChildFlock", that.oDropdownData);

            //     var oView = this.getView();
            //     if (!this._oFragmentA) {
            //         this._oFragmentA = Fragment.load({
            //             id: oView.getId(),
            //             name: "com.pso.customerrecord.fragment.DisplayChildFloc",
            //             controller: this
            //         }).then(function (oFragment) {
            //             oView.addDependent(oFragment);
            //             return oFragment;
            //         });


            //     }

            //     this._oFragmentA.then(function (oFragment) {
            //         oView.byId("idpanel").removeAllContent(oFragment);
            //         oView.byId("idpanel").addContent(oFragment);
            //         //oFragment.setModel(oCreateChildFlockJModel_DD, "oCreateChildFlockJModel_DD");


            //     });

            // },
            //****************************DC/PL/IND Logic **************************************************** */
            onDCPLINDSelect: function () {
                var oCircuit = this.getView().byId("idCircuit_CC");
                oCircuit.setValue();
                var oSelected = this.oView.byId("idDCPLIND_CC").getSelectedButton();
                this.oDCPLIND = oSelected.getText();
                if (this.oDCPLIND === "IND") {
                    this.oView.byId("idTrans_CC").setVisible(true);
                    oCircuit.setValue();
                    oCircuit.setEnabled(false);
                } else {
                    this.oView.byId("idTrans_CC").setVisible(false);
                    oCircuit.setEnabled(true);
                }
            },
            //**************************Open OPEN TEXT URL **************************************************************/
            onOpenOTurl: function () {
                //direct url
                var sUrl = "https://dca-dev5538.dteco.com/otcs/cs.exe?func=xecmpf.GetWspIntegration&botype=PREMISES&extsysid=DI5&bokey=5110267589&language=EN";
                //           https://dca-dev5538.dteco.com/otcs/cs.exe?func=xecmpf.GetWspIntegration&botype=PREMISES&extsysid=DI5&bokey=5110267589&language=EN
                //  var url_cc =  "&botype=PREMISES&extsysid=DI5&bokey=5110267589&language=EN;
                //   window.open(sUrl, "_blank");
                var url_cc = "http://dev-https-opentext-n1:8443/otcs/cs.exe?func=xecmpf.GetWspIntegration&botype=PREMISES&extsysid=DI5&bokey=5110267589&language=EN"

                var url_dest = "/compsocustomerrecord/openText/&bokey=5110267589&language=EN"
                
                //New OT Url
                var new_Url = "https://dca-dev5538.dteco.com/otcs/cs.exe?func=xecmpf.GetWspIntegration&botype=BUS0010&extsysid=DI5&bokey=0431034121&language=EN"
                

                window.open(new_Url, "_blank");

                //console.log(url);

                // var aData = jQuery.ajax({
                //     type: "GET",
                //     contentType: "application/xml",
                //     url: url,
                //     dataType: "xml",
                //     async: false,
                //     success: function (data, textStatus, jqXHR) {
                //         alert("success to post");
                //     }
                // });

            },

         
            //****************Submit Customer Attrubutes****************************************/
            createCustomerDetails: function () {
                var oStreetNo = this.getView().byId("idStreetno_CC").getValue();
                var oStreetAdd = this.getView().byId("idStreetAdd_CC").getValue();
                if (oStreetNo === "" || oStreetAdd === "") {
                    sap.m.MessageBox.show(this.getView().getModel("i18n").getProperty("document_note_mandatory"), {
                        icon: sap.m.MessageBox.Icon.WARNING,
                        title: this.getView().getModel("i18n").getProperty("error"),
                        actions: [sap.m.MessageBox.Action.OK]
                    });
                    return;
                }

                var CustomerAttributesList = [];
                var oCustomerAttributes1 = this.getView().getModel("oCustomerAttributesJModel").getData();
                var oSelectedKey = this.getView().byId("idDCPLIND_CC").getSelectedIndex();
                var oDC = "", oPL = "", oNA = "";
                if (oSelectedKey === 0) {
                    oDC = "X";
                } else if (oSelectedKey === 1) {
                    oPL = "X";
                } else {
                    oNA = "X";
                }

                var oSelectedKeyGen = this.getView().byId("idGeneration_CC").getSelectedIndex();
                var oEmergency = "", oPartial = "", oFullGen = "", oNoOnsiteGen = "";

                if (oSelectedKeyGen === 0) {
                    oEmergency = "X";
                } else if (oSelectedKeyGen === 1) {
                    oPartial = "X";
                } else if (oSelectedKeyGen === 2) {
                    oFullGen = "X";
                } else {
                    oNoOnsiteGen = "X";
                }
                var oNooflines = this.getView().byId("idNoOfline_CC").getSelectedKey();
                var oServiceCentre = this.getView().byId("idSrvCenter_CC").getSelectedKey();
                var oPrimerySrvRep = this.getView().byId("idPSR_CC").getSelectedKey();
                var oProact1 = this.getView().byId("idProEqp1_CC").getSelectedKey();
                var oProact2 = this.getView().byId("idProEqp2_CC").getSelectedKey();
                var oThrowovertyp = this.getView().byId("idThrowoverTyp_CC").getSelectedKey();
                var oServicetype = this.getView().byId("idServiceType_CC").getSelectedKey();
                var Comments = this.getView().byId("idComents_CC").getValue();

                // var oAttributs = {
                    
                //         "acc_rep": "",
                //         "cable_no": "12345",
                //         "circuit": "",
                //         "circuit_doc_id": "543",
                //         "city": "Southgate",
                //         "conn_obj": "4000438944",
                //         "cust_name": "Connection object Loc",
                //         "doc_id": "145",
                //         "emer_phone": "0987654321",
                //         "emer_title": "Mr",
                //         "generation": "genkW",
                //         "indus_cust": "",
                //         "mail_name": "",
                //         "na": "",
                //         "no_of_lines": "3",
                //         "on_site_emerg": "X",
                //         "on_site_nosg": "",
                //         "on_site_part": "",
                //         "pl": "",
                //         "prot_equip1": "",
                //         "prot_equip2": "",
                //         "pso_site": "",
                //         "psr": "",
                //         "psw": "23",
                //         "sect_point": "454",
                //         "sketch_no": "2345654",
                //         "srv_center": "",
                //         "srv_type": "",
                //         "street_name": "Waverly St",
                //         "street_no": "16002",
                //         "sub_station": "",
                //         "throw_type": "",
                //         "zip_code": "33351-4520"
                        
                // };
                var oAttributs = {};
                    oAttributs.conn_obj = oCustomerAttributes1.conn_obj,
                    oAttributs.cust_name = oCustomerAttributes1.cust_name,
                    //Attributs.mail_name = oCustomerAttributes1.mail_name,
                    oAttributs.street_no = oCustomerAttributes1.street_no,
                    oAttributs.street_name = oCustomerAttributes1.street_name,
                    oAttributs.city = oCustomerAttributes1.city,
                    oAttributs.zip_code = oCustomerAttributes1.zip_code,
                    oAttributs.no_of_lines = oNooflines,
                    oAttributs.srv_center = oServiceCentre,
                    oAttributs.cable_no = oCustomerAttributes1.cable_no,
                    oAttributs.doc_id = oCustomerAttributes1.doc_id,
                    oAttributs.psr = oPrimerySrvRep
                    oAttributs.sub_station = oCustomerAttributes1.sub_station,
                    oAttributs.sketch_no = oCustomerAttributes1.sketch_no,
                    oAttributs.circuit = oCustomerAttributes1.circuit,
                    //oAttributs.acc_rep = oCustomerAttributes1.acc_rep,
                    oAttributs.emer_title = oCustomerAttributes1.emer_title,
                    oAttributs.emer_phone = oCustomerAttributes1.emer_phone,
                    oAttributs.sect_point = oCustomerAttributes1.sect_point,
                    oAttributs.dc = oDC,
                    oAttributs.pl = oPL,
                    oAttributs.na = oNA,
                    oAttributs.psw = oCustomerAttributes1.psw,
                    oAttributs.prot_equip1 = oProact1,
                    oAttributs.prot_equip2 = oProact2,
                    oAttributs.throw_type = oThrowovertyp,
                    oAttributs.srv_type = oServicetype,
                    oAttributs.circuit_doc_id = oCustomerAttributes1.circuit_doc_id,
                    oAttributs.on_site_emerg = oEmergency,
                    oAttributs.on_site_part = oPartial,
                    oAttributs.on_site_nosg = oNoOnsiteGen,
                    oAttributs.full_generation = oFullGen,
                    oAttributs.generation = oCustomerAttributes1.generation + "kW",
                    oAttributs.indus_cust = "",
                    oAttributs.pso_site = "",
                    oAttributs.demo_site = ""
                    oAttributs.comments = Comments;

                if (this.oEdiFlag == "X") {
                    this.getOwnerComponent().getModel().update("/Customer_attributeSet('" + oAttributs.conn_obj + "')", oAttributs, {
                        //    this.oDataModel.read("Customer_searchSet", {
                        method: "PUT",
                        success: function (oData, oResponse) {
                            //that.oBusyIndicator.close()
                            if (oResponse.statusCode === "204") {
                                var oMessage = JSON.parse(oResponse.headers["sap-message"]);

                                var dialog = new sap.m.Dialog({
                                    title: "Success",
                                    type: 'Message',
                                    state: 'Success',
                                    content: new sap.m.Text({
                                        text: oMessage.message
                                    }),
                                    endButton: new sap.m.Button({
                                        text: "OK",
                                        press: function () {
                                            dialog.close();
                                            //location.reload();
                                        }
                                    }),
                                    afterClose: function () {
                                        dialog.destroy();
                                    }
                                });
                                dialog.open();


                            } else {
                                sap.m.MessageBox.show(oResponse.statusText, {
                                    icon: sap.m.MessageBox.Icon.ERROR,
                                    title: this.getView().getModel("i18n").getProperty("error"),
                                    actions: [sap.m.MessageBox.Action.OK]
                                });
                            }


                        },

                        error: function (error) {
                            //that.oBusyIndicator.close();
                            var oError = JSON.parse(error.responseText);
                            var oMessage = oError.error.message.value;
                            sap.m.MessageBox.show(
                                oMessage, {
                                icon: sap.m.MessageBox.Icon.ERROR,
                                title: "Error",
                                actions: [sap.m.MessageBox.Action.OK]
                            });

                        }
                    });
                } else {
                    this.getOwnerComponent().getModel().create("/Customer_attributeSet", oAttributs, {
                        //    this.oDataModel.read("Customer_searchSet", {
                        success: function (oData, oResponse) {
                            //that.oBusyIndicator.close()
                            var oMessage = JSON.parse(oResponse.headers["sap-message"]);
                            if (oResponse.statusCode === "201") {

                                var dialog = new sap.m.Dialog({
                                    title: "Success",
                                    type: 'Message',
                                    state: 'Success',
                                    content: new sap.m.Text({
                                        text: oMessage.message
                                    }),
                                    endButton: new sap.m.Button({
                                        text: "OK",
                                        press: function () {
                                            dialog.close();
                                            window.history.go(-1);
                                        }
                                    }),
                                    afterClose: function () {
                                        dialog.destroy();
                                    }
                                });
                                dialog.open();


                            } else {
                                sap.m.MessageBox.show(oMessage.message, {
                                    icon: sap.m.MessageBox.Icon.ERROR,
                                    title: this.getView().getModel("i18n").getProperty("error"),
                                    actions: [sap.m.MessageBox.Action.OK]
                                });
                            }


                        },

                        error: function (error) {
                            //that.oBusyIndicator.close();
                            var oError = JSON.parse(error.responseText);
                            var oMessage = oError.error.message.value
                            sap.m.MessageBox.show(
                                oMessage, {
                                icon: sap.m.MessageBox.Icon.ERROR,
                                title: "Error",
                                actions: [sap.m.MessageBox.Action.OK]
                            });

                        }
                    });
                }



                //     this.getOwnerComponent().getModel().create("/Customer_attributeSet",CustomerAttributesList, {
                //         success:fnSuccess,
                //         error:fnError
                //     });

                //    var fnSuccess = function (oData, oResponse) {
                //         //that.oBusyIndicator.close()
                //         var abc = "";

                //     }
                //     var fnError = function (oError) {
                //        // that.oBusyIndicator.close();
                //         sap.m.MessageBox.show(
                //             error.message, {
                //             icon: sap.m.MessageBox.Icon.ERROR,
                //             title: "Error",
                //             actions: [sap.m.MessageBox.Action.OK]
                //         });

                //     }


            },



            //********************************Navigate to privious page**************************/
            //Navigate to privious page
            onBack: function (oEvent) {
                // var oCustomerAttributesJModel = this.getOwnerComponent().getModel("oCustomerAttributesJModel");
                // oCustomerAttributesJModel.setData({});
                // oCustomerAttributesJModel.refresh(true);
                // this.getView().updateBindings();
                //var oRouter=sap.ui.core.UIComponent.getRouterFor(this);
                //oRouter.navTo("View1");
                window.history.go(-1);
            },

            onCreateSpecials: function (oEvent) {
                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                oRouter.navTo("CustomerAttributeSpecials", {
                    scope: "cd_create"
                });
            },
            oncallc4cOData:function(){
                var oSearchCustomerJModel = this.oView.getModel("oSearchCustomerJModel");
                var oPromiseModel = new sap.ui.model.odata.v2.ODataModel("/sap/c4c/odata/v1/c4codataapi");
                oPromiseModel.read("BusinessUserCollection?$filter=UserID eq 'U62926'", {
                    success: function (oData) {
                        oSearchCustomerJModel.setData(oData.results);

                    },
                    error: function (error) {
                        sap.m.MessageBox.show(
                            error.message, {
                                icon: sap.m.MessageBox.Icon.ERROR,
                                title: "Error",
                                actions: [sap.m.MessageBox.Action.OK]
                            });

                    }
                });
            }

        });
    });
