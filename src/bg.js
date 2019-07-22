"use strict";

browser.runtime.onInstalled.addListener(handleInstalled);
function handleInstalled(details){
	if(details.reason==="install"||details.reason==="update"){
		browser.storage.local.get().then(db=>{
			if(db.minRate===undefined){
				browser.storage.local.set({
					theme:"light",
					minRange:0.3,
					maxRange:4,
					stepRange:0.1,
					stepButton:0.25,
					popup:[["range","current"],["minus","plus"],[1,1.25,1.5,1.75,2],["playpause","open"],["customize"]]
				});
			}
		});
	}
}

browser.commands.onCommand.addListener(command=>{
	switch(command){
		case "ratePlus":
			control("plus");
			break;
		case "rateMinus":
			control("minus");
			break;
		case "rateDefault":
			control(1);
			break;
	}
});

function control(e){
	browser.tabs.executeScript(null,{
		allFrames: true,
		file: "/insert.js",
		runAt: "document_end"
	}).then(()=>{
		browser.storage.local.get("stepButton").then(db=>{
			browser.tabs.executeScript(null,{
				allFrames: true,
				code: `control("${e}",${db.stepButton});`,
				runAt: "document_end"
			});
		});
	});
}

browser.runtime.onMessage.addListener(mes);
function mes(m,s){
	if(m.rate){
		browser.browserAction.setBadgeText({text:m.rate+"",tabId:s.tab.id});
	}
}
