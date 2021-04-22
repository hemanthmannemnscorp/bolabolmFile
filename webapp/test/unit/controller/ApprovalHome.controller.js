/*global QUnit*/

sap.ui.define([
	"com/bolam/zptv_bolam_approval/controller/ApprovalHome.controller"
], function (Controller) {
	"use strict";

	QUnit.module("ApprovalHome Controller");

	QUnit.test("I should test the ApprovalHome controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});