sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/ValueState",
	"sap/m/Dialog",
	"sap/m/DialogType",
	"sap/m/Button",
	"sap/m/ButtonType",
	"sap/m/Label",
	"sap/m/MessageToast",
	"sap/m/Text",
	"sap/m/HBox"
], function (Controller, ValueState, Dialog, DialogType, Button, ButtonType, Label, MessageToast, Text, HBox) {
	"use strict";

	return Controller.extend("com.bolam.zptv_bolam_approval.controller.ApprovalHome", {
		onInit: function () {
			this.onReadTable(); 
		},
		onReadTable: function () {

			var oTable = this.getView().byId("idFileApprovalTable");
			var oModel = this.getView().getModel("fileListModel");
			var oJSONModel = this.getView().getModel("oFileMainModelJSON");
			oModel.read("/FileReqSet", {
				success: function (oData) {
					var data = oData.results;
					oJSONModel.setData(data);
					oTable.setModel(oJSONModel);
				}
			})

		},
		onFilesSubmitReq: function () {

			var oData = this.getView().byId("idFileApprovalTable").getModel().getData();
			var approveCount = 0;
			var denyCount = 0;
			var denyind = false; //added
			this._oData = oData;
			for (var i = 0; i < oData.length; i++) {
				var denyNotes = ""; //added
				if (oData[i].Approve == true) {
					approveCount = approveCount + 1;
				}
				if (oData[i].Deny == true) {
					denyCount = denyCount + 1;
					var denyNotes = oData[i].Notes; // added below
					if (denyNotes === "") {
						denyind = true;
						if (!this.oErrorMessageDialog) {
							this.oErrorMessageDialog = new Dialog({
								type: DialogType.Message,
								title: "Error",
								state: ValueState.Error,
								content: new Text({
									text: "Please add Reason for Denial."
								}),
								beginButton: new Button({
									type: ButtonType.Emphasized,
									text: "OK",
									press: function () {
										this.oErrorMessageDialog.close();
									}.bind(this)
								})
							});
						}

						this.oErrorMessageDialog.open();
					}
				}
			}
			if (denyind == false) {
				this.oApproveDialog = new Dialog({
					type: DialogType.Message,
					title: "Save & Submit Information?",
					content: [
						new HBox({
							items: [
								new Label({
									text: "You are about to submit:"
								})
							]
						}),
						new HBox({
							items: [
								new Label({
									text: approveCount + " Approved Files"
								}).addStyleClass("bulletlist")
							]
						}),
						new HBox({
							items: [
								new Label({
									text: denyCount + " Denied Files"
								}).addStyleClass("bulletlist")
							]
						}),
						new HBox({
							items: [
								new Label({
									text: ""
								})
							]
						}),
						new HBox({
							items: [
								new Label({
									text: "Are you sure you would like to save and submit the information "
								})
							]
						}),
						new HBox({
							items: [
								new Label({
									text: "from this session?"
								})
							]
						})
					],
					beginButton: new Button({
						type: ButtonType.Emphasized,
						text: "Yes",
						press: function () {
							// MessageToast.show("Submit pressed!");
							this.onApproveYesPress();
							this.oApproveDialog.close();
						}.bind(this)
					}),
					endButton: new Button({
						text: "Cancel",
						press: function () {
							this.oApproveDialog.close();
						}.bind(this)
					})
				});

				this.oApproveDialog.open();
			}
		},
		onApproveYesPress: function () {
			var oData = this._oData;
			var oPostJSONItem = [];

			for (var i = 0; i < oData.length; i++) {
				var oDate = new Date();
				var oTime = "PT" + oDate.getHours() + "H" + oDate.getMinutes() + "M" + oDate.getSeconds() + "S";
				var oPostJSONLocal = {
					"File": oData[i].File,
					"Count": oData[i].Count,
					"Date": oData[i].Date,
					"Time": oData[i].Time,
					"Approve": oData[i].Approve,
					"Deny": oData[i].Deny,
					"Notes": oData[i].Notes,
					"Pernr": "",
					"Dateap": oDate,
					"Timeap": oTime,
					"Type": oData[i].Type
				};
				oPostJSONItem.push(oPostJSONLocal);
			};
			var oPostJSON = {
				"File": "NSC_6_US_BOLA_653810_NS TRVL_20210408_171836.txt",
				"Count": 6,
				"Date": "\/Date(1617840000000)\/",
				"Time": "PT17H18M46S",
				"Approve": false,
				"Deny": false,
				"Notes": "",
				"Type": "BOLA",
				"ReqToPostNav": oPostJSONItem

			};
			var oModel = this.getView().getModel("fileListModel");
			var that = this;
			oModel.create("/FileReqSet", oPostJSON, {
				success: function () {
					// console.log("Success")
					that.onReadTable();
				},
				error: function () {
					that.onReadTable();
				}
			});

		}
	});
});