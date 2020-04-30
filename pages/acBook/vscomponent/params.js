var params=[
	{name:"entId",type:"buff",des:"企业id",initPage:"main and scan",loadingPage:["pj_detail"],default:""},
	{name:"userInfo",type:"buff",des:"用户信息",initPage:"main",loadingPage:["pj_detail"],default:{name:'someBody'}},
	{name:"wxUserInfo",type:"buff",des:"微信用户基础信息",initPage:"all",loadingPage:[],default:{}},
	{name:"shareInfo",type:"buff",des:"分享信息",initPage:"detail",loadingPage:[],default:{name:'share'}},
	{name:"log",type:"storage",des:"日志",initPage:"all",loadingPage:[],default:"begin"}
]
var sysParams={
	serverurl:"http://192.168.168.73:8088",
	devServerurl:"http://127.0.0.1:8087",
	loginUrl:"/sfy/center/wx/login/login",
	registerUrl:"/sfy/center/wx/login/register",
	dictUrl:"/sfy/center/wx/dict/dict",
	uploadUrl:"http://192.168.168.73:8088",
	navMainUrl:'/pages/carola/carola',
	navParams:{"nav":true,"reback":true,"redirect":true,"main":true,"reLaunch":true},
	httpParams:{"get":true,"getSyn":true,"form":true,"formSyn":true,"post":true,"postSyn":true},
	dialogParams:{"toast":true,"tip":true,"dialog":true},
	storageParams:{"AllAppInfo":true,"getAppInfo":true,"setAppInfo":true,"getStorage":true,"setStorage":true,"getDict":true},
	wxApiParams:{"login":true,"scan":true,"qrCode":true,"upload":true,"download":true}
}
export {  
	params,sysParams  
}