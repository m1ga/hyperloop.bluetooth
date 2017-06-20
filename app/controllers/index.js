var Activity = require('android.app.Activity');
var activity = new Activity(Ti.Android.currentActivity);

var BluetoothLEController = require("co.lujun.lmbluetoothsdk.BluetoothLEController");
var BluetoothController = require("co.lujun.lmbluetoothsdk.BluetoothController");
var BluetoothLEListener = require("co.lujun.lmbluetoothsdk.base.BluetoothLEListener");
var BluetoothListener = require("co.lujun.lmbluetoothsdk.base.BluetoothListener");

var BluetoothAdapter = require("android.bluetooth.BluetoothAdapter");
var BluetoothDevice = require("android.bluetooth.BluetoothDevice");
var BluetoothGattCharacteristic = require("android.bluetooth.BluetoothGattCharacteristic");
var BTController = new BluetoothController();
var BLEController = new BluetoothLEController();
var ble = BLEController.build(activity);
var btc = BTController.build(activity);

var isRunning = false;
var mBluetoothListener = new BluetoothListener({
	onActionStateChanged: onActionStateChanged,
	onActionDiscoveryStateChanged: onActionDiscoveryStateChanged,
	onActionScanModeChanged: onActionScanModeChanged,
	onBluetoothServiceStateChanged: onBluetoothServiceStateChanged,
	onReadData: onReadData,
	onActionDeviceFound: onActionDeviceFound
});
var mBluetoothLEListener = new BluetoothLEListener({
	onActionStateChanged: onActionStateChanged,
	onActionDiscoveryStateChanged: onActionDiscoveryStateChanged,
	onActionScanModeChanged: onActionScanModeChanged,
	onBluetoothServiceStateChanged: onBluetoothServiceStateChanged,
	onActionDeviceFound: onActionDeviceFound,
	onReadData: onReadData,
	onWriteData: onWriteData,
	onDataChanged: onDataChanged
});
var devices = [];

btc.setBluetoothListener(mBluetoothListener);
ble.setBluetoothListener(mBluetoothLEListener);

function onActionStateChanged(preState, state) {
	console.log("action state");
}

function onActionDiscoveryStateChanged(discoveryState) {
	console.log("action dicovery state");
}

function onActionScanModeChanged(preScanMode, scanMode) {
	console.log("scan mode");
}

function onBluetoothServiceStateChanged(state) {
	console.log("blue state changed: " + state);
}

function onWriteData(characteristic) {
	console.log("data write: " + characteristic);
}

function onDataChanged(characteristic) {
	console.log("data changed: " + characteristic);
}

function onActionDeviceFound(device) {
	console.log("found device");
	if (devices.indexOf(device.getAddress()) == -1) {
		var v = Ti.UI.createView({
			height: 40,
			left: 0,
			right: 0,
			udid: device.getAddress(),
			borderColor: "#999",
			borderWidth: 1,
			borderRadius: 4
		});
		var l = Ti.UI.createLabel({
			text: "Found: " + device.getName() + " " + device.getAddress(),
			color: "#000",
			touchEnabled: false
		});
		v.add(l);
		$.view_scroller.add(v);
		devices.push(device.getAddress());
	}
}

function onReadData(characteristic) {
	console.log("data flag: " + characteristic.getProperties());
	var l = Ti.UI.createLabel({
		text: "UDID: " + characteristic.getUuid() + " - Data: " + characteristic.getValue(),
		color: "#000"
	});
	$.view_scroller_char.add(l);

}

function onClickScan(e) {
	if (ble.isAvailable()) {
		if (ble.isEnabled()) {
			if (!isRunning) {
				ble.startScan();
				$.btn_scan.title = "Stop";
			} else {
				$.btn_scan.title = "Start";
				ble.cancelScan();
			}
			isRunning = !isRunning;
		} else {
			alert("Not enabled");
			ble.openBluetooth();
		}
	} else {
		alert("Not available");
	}

}

function onClickDevice(e) {
	console.log(e.source.udid);
	if (e.source.udid) {
		$.view_scroller_char.removeAllChildren();
		ble.cancelScan();
		$.btn_scan.title = "Start";
		ble.connect(e.source.udid);
		isRunning = false;
	}
}

function onClickScanBt(e){
	if (btc.isAvailable()) {
		if (btc.isEnabled()) {
			if (!isRunning) {
				btc.startScan();
				$.btn_scan_bt.title = "Stop";
			} else {
				$.btn_scan_bt.title = "Start";
				btc.cancelScan();
			}
			isRunning = !isRunning;
		} else {
			alert("Not enabled");
			btc.openBluetooth();
		}
	} else {
		alert("Not available");
	}

}

$.view_scroller.addEventListener("click", onClickDevice);
$.btn_scan.addEventListener("click", onClickScan);
$.btn_scan_bt.addEventListener("click", onClickScanBt);
$.index.open();
