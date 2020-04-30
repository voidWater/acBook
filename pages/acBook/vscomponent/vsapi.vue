<template name="api">
	<div class="page" >
	   <div class="shade-layer" v-if="shadeShow"></div>
	   <div class="err-page" v-if="done==-1">
	   		<div class="err-log" v-if="done==-1" @click="refresh">
			   <div class="item"><image class="img" src="../../static/zhaj/快速报修.png"></image></div>
			   <div class="item"><button class="cu-btn radius round">网络超时，点击刷新重试</button></div>
	   		</div>  
	   </div>
	   <uni-popup ref="showpopup" type="center" ><text class="popup-content">{{dialogInfo.message}}</text></uni-popup>
	   <uni-popup ref="showtip" type="center" :mask-click="!(dialogInfo.isCancel&&dialogInfo.isSubmit)&&dialogInfo.mask" @change="showtipChange">
	   	<view class="uni-tip">
	   		<text class="uni-tip-title">{{dialogInfo.title}}</text>
	   		<text class="uni-tip-content margin">{{dialogInfo.message}}</text>
	   		<view class="uni-tip-group-button">
				<div class="flex justify-center" style="width: 100%;">
					<button v-if="dialogInfo.isSubmit" class="cu-btn bg-blue lg margin-lr" @click="dialogSubmit">确定</button>
					<button v-if="dialogInfo.isCancel" class="cu-btn line-gray lg margin-lr" @click="dialogCancel">取消</button>
				</div>
	   		</view>
	   	</view>
	   </uni-popup>
	   <uni-popup ref="loginDialog" type="center">
	   	<view class="uni-tip">
	   		<text class="uni-tip-title">登录</text>
	   		<text class="uni-tip-content margin " style="text-align: center;"><text class="cuIcon-weixin text-green" style="font-size: 70rpx;"></text> </text>
			<view v-if="!(!hashcode&&!openid)" style="text-align: center;">该微信号尚未注册</view>
	   		<view class="uni-tip-group-button">
	   				<div class="flex justify-center" style="width: 100%;">
	   					<button v-if="!hashcode&&!openid"  class="cu-btn bg-blue margin-lr" @click="loginSubmit">使用微信账号登录</button>
						<button v-else class="cu-btn bg-green margin-lr" open-type="getPhoneNumber" @getphonenumber="registerSubmit">使用微信注册</button>
	   				</div>
	   		</view>
	   	</view>
	   </uni-popup>
	</div>
</template>
<script>
import uniPopup from "@/components/uni-popup/uni-popup.vue"
var vsparams = require('./params.js')
var that;
/**
 * @auth lixc
 * @date 2020-03-20
 * @version 1.0.9
 * vs(object)//type,syn,checkLogin,url,data,callback,errorCallback,exData
 * vss(object)
 * chooseImage(callback)
 * uploadImage()//todo
 * getLocation(callback)
 * openNavigation()
 * getOpenId(callback,errorCallback)获取openId和session_key,[storage]
 * getPhone(callback,errorCallback)获取手机号
 */
export default {
	name: "api",
	components: {uniPopup},
	props: {
		done:Number
	},
	data(){
		return{
			development:true,			
			serverurl:"",
			shadeShow:false,
			hashcode: '',
			openid:'',
			sessionKey:'',
			loginUrl:'',
			registerUrl:'',
			navMainUrl:'',
			navParams:{},
			httpParams:{},
			dialogInfo:{title:"",message:"",isSubmit:false,isCancel:false,mask:false},
			dialogParams:{},
			storageParams:{},
			
			
		}
	},
	created:function(e){
		that = this;
		vsparams.sysParams;
		if(process.env.NODE_ENV === 'development'){
			this.development = true
			this.serverurl = vsparams.sysParams.devServerurl
		}else{
			this.development = false
			this.serverurl = vsparams.sysParams.serverurl
		}
		this.loginUrl = vsparams.sysParams.loginUrl;
		this.registerUrl = vsparams.sysParams.registerUrl;
		this.navMainUrl = vsparams.sysParams.navMainUrl;
		this.navParams = vsparams.sysParams.navParams;
		this.httpParams = vsparams.sysParams.httpParams;
		this.dialogParams = vsparams.sysParams.dialogParams;
		this.storageParams = vsparams.sysParams.storageParams;
	},
	methods: {
		/**
		 * 基础
		 */
		log(name,message){
			if(!name||!message)return
			if(this.development){
				console.log(`${name}-->${message}`)
			}
		},
		refresh(){
			this.$emit('refresh');
		},
		vs(params){
			let name ='vs'
			if(!params)return
			if(!params.type){
				this.log(name,`type参数缺失`)
				return
			}
			if(params.checkLogin){
				if(!that.checkLogin()){
					params.checkLogin = false;
					that.login(function(){that.vs(params);})
					return
				}
			}
			if(this.dialogParams[params.type]){
				this.dialog(params)
				return
			}
			if(this.navParams[params.type]){
				this.navTo(params.type,params.url,params.data);
				return;
			}
			if(this.storageParams[params.type]){
				if(params.type=='setAppInfo'){
					return this.setAppInfo(params.name,params.value,params.callback)
				}else if(params.type=='getAppInfo'){
					return this.getAppInfo(params.name,params.callback)
				}else if(params.type=='getStorage'){
					this.log(name,`type该方法正在做了`)
				}else if(params.type=='setStorage'){
					this.log(name,`type该方法正在做了`)
				}else if(params.type=="AllAppInfo"){
					this.allAppInfo()
				}
				return
			}
			if(this.httpParams[params.type]){
				if(params.type=='get'){
					this.vs2({type:"get",syn:"false",url:params.url,data:params.data,callback:params.callback,errorCallback:params.errCallback})
				}else if(params.type=='getSyn'){
					this.vs2({type:"get",syn:"true",url:params.url,data:params.data,callback:params.callback,errorCallback:params.errCallback})
				}else if(params.type=='post'){
					this.vs2({type:"post",syn:"false",url:params.url,data:params.data,callback:params.callback,errorCallback:params.errCallback})
				}else if(params.type=='postSyn'){
					this.vs2({type:"post",syn:"true",url:params.url,data:params.data,callback:params.callback,errorCallback:params.errCallback})
				}else if(params.type=='form'){
					this.vs2({type:"form",syn:"false",url:params.url,data:params.data,callback:params.callback,errorCallback:params.errCallback})
				}else if(params.type=='formSyn'){
					this.vs2({type:"form",syn:"true",url:params.url,data:params.data,callback:params.callback,errorCallback:params.errCallback})
				}
				return
			}
			console.log("err:参数错误->"+params.type+"该命令不存在或没有权限")
		},
		navTo(type,url,data){
			let name ='navTo'
			var str = ""
			if(!url&&(type!='main'&&type!='reback')){
				this.log(name,`url缺失`)
				return
			}
			if(data){
				str = "?"
				for(var item in data){
					str+=item+"="+data[item]+"&"
				}
			}
			if(type=='redirect'){
				this.log(name,`${type}:${url}:${str}`)
				uni.redirectTo({
					url: url+str,
					fail:function(){
						uni.reLaunch({url:that.navMainUrl})
					}
				});
			}else if(type=='nav'){
				this.log(name,`${type}:${url}:${str}`)
				uni.navigateTo({
					url: url+str,
					fail:function(e){
						console.log(e)
						uni.reLaunch({url:that.navMainUrl})
					}
				});
			}else if(type=='reback'){
				this.log(name,`${type}`)
				uni.navigateBack({
					delta: 1,
					fail:function(){
						uni.reLaunch({url:that.navMainUrl})
					}
				});
			}else if(type=='main'){
				this.log(name,`${type}:`+that.navMainUrl+str)
				uni.redirectTo({
					url: that.navMainUrl+str,
					fail:function(){
						uni.reLaunch({url:that.navMainUrl})
					}
				});
			}else if(type=='reLaunch'){
				this.log(name,`${type}:${url}:${str}`)
				uni.reLaunch({
					url: url+str,
					fail:function(){
						uni.reLaunch({url:that.navMainUrl})
					}
				});
			}
		},
		dialog(params){
			if(!params.mask||params.mask!=false){
				that.dialogInfo.mask=true;
			}else{
				that.dialogInfo.mask=false;
			}
			if(params.type=="toast"){
				if(params.message){
					this.dialogInfo.message=params.message;
					this.$refs.showpopup.open()
				}
			}else if(params.type=="tip"){
				if(params.message||params.title){
					this.dialogInfo.message=params.message;
					this.dialogInfo.title=params.title;
					this.dialogInfo.isSubmit = false;
					this.dialogInfo.isCancel = false;
					this.$refs.showtip.open()
				}
			}else if(params.type=="dialog"){
				if(params.message||params.title){
					this.dialogInfo.message=params.message;
					this.dialogInfo.title=params.title;
					if(params.submit){
						this.dialogInfo.isSubmit = true
						this.dialogInfo.submit = params.submit;
					}else{
						this.dialogInfo.isSubmit = false
					}
					if(params.cancel){
						this.dialogInfo.isCancel = true
						this.dialogInfo.cancel = params.cancel;
					}else{
						this.dialogInfo.isCancel = false
					}
					this.$refs.showtip.open()
				}
			}
		},
		dialogSubmit(){
			this.$refs.showtip.close()
			if(this.dialogInfo.submit){
				this.dialogInfo.submit()
			}
		},
		dialogCancel(){
			this.$refs.showtip.close()
			if(this.dialogInfo.cancel){
				this.dialogInfo.cancel()
			}
		},
		showtipChange(e){
			
		},
		/**
		 * 网络
		 */
		getPromise(params){
			return new Promise(function (resolve, reject) {
				params.callback=function(res){
					resolve(res)
				};
				params.errorCallback=function(res){
					reject(res)
				};
				that.vs(params)
			});
		},
		vss(arr,callback,errorCallback){
			let name="vss"
			this.log(name,`begin`)
			if(arr instanceof Array){
				var promises = arr.map(function(index){
				  return that.getPromise(index);
				});
				Promise.all(promises).then(function(res) {
				  if(callback){
					  callback(res)
				  }
				}).catch(function(res){
				  if(errorCallback){
				  	 errorCallback(res)
				  }
				});
			}else{
				this.log(name,`参数必须是数组`)
			}
		},
		vs2(params){
			/*
			type,syn,checkLogin,url,data,callback,errorCallback,exData
			*/
			let name = 'vs'
			if(!params.url){
				this.log(name,`url缺失`)
				return
			}
			if(!params.type){
				params.type = 'get'
			}
			if(!params.syn){
				params.syn = true
			}
			if(params.syn){
				if(params.type=='get'){
					this.httpGetSyn(params.url,params.data,params.callback,params.errorCallback,params.exData);
				}else if(params.type=='post'){
					this.httpPostSyn(params.url,params.data,params.callback,params.errorCallback,params.exData);
				}else if(params.type=='form'){
					this.httpFormSyn(params.url,params.data,params.callback,params.errorCallback,params.exData);
				}else{
					this.log(name,'type参数不正确');
				}
			}else{
				if(params.type=='get'){
					this.httpGet(params.url,params.data,params.callback,errorCallback,params.exData);
				}else if(params.type=='post'){
					this.httpPost(params.url,params.data,params.callback,errorCallback,params.exData);
				}else if(params.type=='form'){
					this.httpForm(params.url,params.data,params.callback,errorCallback,params.exData);
				}else{
					this.log(name,'type参数不正确');
				}
			}
		},
		httpCheckError(res){
			if(res.statusCode!=200||res.errMsg=='request:fail '){
				return true;
			}
			return false;
		},
		httpGetSyn(url,data,callback,errorCallback,exData){
			this.shadeShow = !this.shadeShow
			this.httpGet(url,data,function(res){
				if(callback){
					callback(res)
				}
				setTimeout(function(){
					 that.shadeShow = !that.shadeShow
				},500)
			},function(res){
				if(errorCallback){
					errorCallback(res)
				}
				setTimeout(function(){
					that.shadeShow = !that.shadeShow
				},500)
			},exData)
		},
		httpGet(url,data,callback,errorCallback,exData){
			let name = 'httpGet'
			var str = "?"
			if(data){
				for(var item in data){
					str+=item+"="+data[item]+"&"
				}
			}
			this.log(name,`${url}`)
			/**
			 * TODO exData
			 */
			uni.showLoading({title: ''});
			wx.request({
				url: this.serverurl + url +str,
				header: {
				  'hashcode': that.hashcode,
				  'content-type': 'application/json'
				},
				success(res) {
					if(!that.httpCheckError(res)){
						if(callback){
							callback(res.data)  
						}
					}else{
						that.log(name,`${url}-->${res.statusCode}`)
					    if(errorCallback){
						  errorCallback(res.data);
					    }
					}
				    setTimeout(function(){
					  uni.hideLoading();
				    },500)
				},
				fail(res) {
				  that.log(name,`${url}-->${res.statusCode}`)
				  if(errorCallback){
				  	errorCallback(res)
				  }
				  setTimeout(function(){
					uni.hideLoading();
					wx.showToast({title: '网络超时',icon:'none',duration: 2000})
				  },500)
				  /**
				   * TODO error handle
				   */
				}
			})
		},
		httpPostSyn(url,data,callback,errorCallback,exData){
			this.shadeShow = !this.shadeShow
			this.httpPost(url,data,function(res){
				if(callback){
					callback(res)
				}
				that.shadeShow = !that.shadeShow
			},function(res){
				if(errorCallback){
					errorCallback(res)
				}
				that.shadeShow = !that.shadeShow
			},exData)
		},
		httpPost(url,data,callback,errorCallback,exData){
			let name = 'httpPost'
			this.log(name,`${url}`)
			/**
			 * TODO exData
			 */
			uni.showLoading({title: ''});
			wx.request({
				url: this.serverurl + url,
				method: "POST",
				data: data,
				header: {
					"hashcode": that.hashcode,
				  "Content-Type": "application/json;charset=utf-8" // 默认值
				},
				success(res) {
				  if(!that.httpCheckError(res)){
						if(callback){
							callback(res.data)  
						}
				  }else{
					  if(errorCallback){
						  that.log(name,`${url}-->${res.statusCode}`)
						  errorCallback(res.data);
					  }
				  }
				  setTimeout(function(){
				  	uni.hideLoading();
				  },500)
				},
				fail(res) {
					that.log(name,`${url}-->${res.statusCode}`)
					if(errorCallback){
						errorCallback(res)
					}
					 setTimeout(function(){
						uni.hideLoading();
						wx.showToast({title: '网络超时',icon:'none',duration: 2000})
					 },500) 
				}
			})
		},
		httpFormSyn(url,data,callback,errorCallback,exData){
			this.shadeShow = !this.shadeShow
			this.httpForm(url,data,function(res){
				if(callback){
					callback(res)
				}
				that.shadeShow = !that.shadeShow
			},function(res){
				if(errorCallback){
					errorCallback(res)
				}
				that.shadeShow = !that.shadeShow
			},exData)
		},
		httpForm(url,data,callback,errorCallback,exData){
			let name = 'httpForm'
			this.log(name,`${url}`)
			/**
			 * TODO exData
			 */
			uni.showLoading({title: ''});
			wx.request({
				url: this.serverurl + url,
				method: "POST",
				data: data,
				header: {
					"hashcode": that.hashcode,
				  "Content-Type": "application/x-www-form-urlencoded;charset=utf-8" // 默认值
				},
				success:function(res) {
				  if(!that.httpCheckError(res)){
				  	if(callback){
				  		callback(res.data)  
				  	}
				  }else{
					  that.log(name,`${url}-->${res.statusCode}`)
				      if(errorCallback){
				  	  errorCallback(res.data);
				      }
				  }
				  setTimeout(function(){
				  	uni.hideLoading();
				  },500)
				},
				fail:function(res) {
					that.log(name,`${url}-->${res.statusCode}`)
					if(errorCallback){
						errorCallback(res)
					}
					 setTimeout(function(){
						uni.hideLoading();
						wx.showToast({title: '网络超时',icon:'none',duration: 2000})
					 },500)
				}
			})
		},
		/**
		 * 微信api TODO
		 */
		setAppInfo(key,value,callback){
			let name="setAppInfoSyn";
			if(!key){
				this.log(name,'key不能为空')
				return
			}
			if(!that.checkParam(key)){
				this.log(name,`${key}参数非法`)
				return false;
			}
			if(!value){
				this.log(name,'value不能为空')
				return
			}
			getApp().globalData[key]=value;
			if(callback){
				callback(this.getAppInfo(key))
			}
			return this.getAppInfo(key);
		},
		getAppInfo(key,callback){
			let name="getAppInfo";
			if(!that.checkParam(key)){
				this.log(name,`${key}参数非法`)
				return false;
			}
			if(key&&key!=''){
				let result = getApp().globalData[key];
				if(result){
					if(callback){
						callback(result)
					}
					return result;
				}else{
					this.log(name,`${key}为空`)
					if(callback){
						callback(null)
					}
					return null
				}
			}else{
				if(callback){
					callback(null)
				}
			  return null;
			}
		},
		allAppInfo(){
			vsparams.params.forEach(s=>{
					console.log(s.name+"---->")
					console.log(s)
					console.log(that.getAppInfo(s.name))
			})
		},
		setWxStorage(key,value){
			let name = 'setWxStorage'
			if(!that.checkParam(key)){
				this.log(name,`${key}参数非法`)
				return false;
			}
			try {
			    uni.setStorageSync(key, value);
				this.log(name,`${key}参数保存成功`)
				return true;
			} catch (e) {
			    this.log(name,`${key}参数保存失败`)
				return false;
			}
		},
		getWxStorage(key){
			let name = 'setWxStorage'
			if(!that.checkParam(key)){
				this.log(name,`${key}参数非法`)
				return;
			}
			try {
			    const value = uni.getStorageSync(key);
			    if (value) {
					this.log(name,`${key}参数获取成功`)
					return  value;
			    }
				this.log(name,`${key}参数获取失败`)
				return  null;
			} catch (e) {
			   this.log(name,`${key}参数获取失败`)
			   return  null;
			}
		},
		/**
		 * 图片上传
		 */
		chooseImage(fn){
			uni.chooseImage({
				count: 9, 
				sizeType: ['original', 'compressed'],
				sourceType: ['album','camera'], 
				success: (res) => {
					if(fn){
						fn(res);
					}
				}
			});
		},
		/**
		 * 微信位置服务
		 */
		getLocation(fn){
			uni.getLocation({
			    type: 'wgs84',
			    success: function (res) {
					if(fn){
						fn(res)
					}
			    }
			});
		},
		openNavigation(){
			uni.getLocation({
			    type: 'wgs84', 
			    success: function (res) {
			        uni.openLocation({
			            latitude: res.latitude,
			            longitude: res.longitude,
			            success: function () {
			                console.log('success');
			            }
			        });
			    }
			});
		},
		/**
		 * 微信userinfo TODO
		 */
		checkLogin(){
			let checkuserinfo = that.vs({type:"getAppInfo",name:"userInfo"})
			if(checkuserinfo){
				if(checkuserinfo.hashcode){
					return true;
				}
			}
			return false;
		},
		loginCallBack(){},
		login(fn){
			this.$refs.loginDialog.open()
			if(fn){
				that.loginCallBack = fn;
			}else{
				that.loginCallBack=function(){}
			}
		},
		loginSubmit(){
			that.getWxUserInfo(function(res){
				wx.login({
					success: (res) => {
						that.vs({type:"get",url:that.loginUrl,data:{code:res.code},callback:function(res){
							if(res.code==0){
								that.vs({type:"setAppInfo",name:"userInfo",value:res.data})
								if(res.data.hashcode){
									that.hashcode = res.data.hashcode;
									that.openid = res.data.openid;
									that.sessionKey = res.data.sessionKey;
									that.loginCallBack();
									that.$refs.loginDialog.close()
								}else{
									that.openid = res.data.openid;
									that.sessionKey = res.data.sessionKey;
									console.log("未注册")
								}
							}
						},errCallback:function(res){
							console.log(res)
							that.$refs.loginDialog.close()
						}})
					},fail:(res)=>{
						console.log(res)
						that.$refs.loginDialog.close()
					}
				})
			})
		},
		registerSubmit(e){
			if(e.detail.errMsg=="getPhoneNumber:fail user deny"){
				wx.showToast({title: '用户拒绝获取手机号',icon:'none',duration: 2000})
				return;
			}
			let loginUserInfo = that.getAppInfo("wxUserInfo");
			loginUserInfo.iv = e.detail.iv;
			loginUserInfo.encryptedDataStr = e.detail.encryptedData;
			loginUserInfo.sessionKey = that.sessionKey;
			loginUserInfo.openid = that.openid
			that.vs({type:'formSyn',url:that.registerUrl,data:that.getAppInfo("wxUserInfo"),
			callback:function(res){
				if(res.code==0){
					that.vs({type:"setAppInfo",name:"userInfo",value:res.data})
					if(res.data.hashcode){
						that.hashcode = res.data.hashcode;
						that.openid = res.data.openid;
						that.sessionKey = res.data.sessionKey;
						that.loginCallBack();
						that.$refs.loginDialog.close()
					}else{
						that.openid = res.data.openid;
						that.sessionKey = res.data.sessionKey;
						console.log("注册失败")
					}
				}
				that.$refs.loginDialog.close()
			},errorCallback:function(res){
				console.log(res)
				that.$refs.loginDialog.close()
			}})
		},
		getWxUserInfo(fn){
			if(that.getAppInfo("wxUserInfo")){
				if(fn){
					fn(that.getAppInfo("wxUserInfo"))
				}
			}else{
				this.checkAuth("scope.userInfo",function(){
					wx.getUserInfo({
						success: (res) => {
							if(fn){
								fn(res.userInfo)
							}
							that.setAppInfo("wxUserInfo",res.userInfo)
						}
					})
				})
			}
		},
		
		getPhone(e,callback,errorCallback){
			if(e.detail.errMsg=="getPhoneNumber:fail user deny"){
				wx.showToast({title: '用户拒绝获取手机号',icon:'none',duration: 2000})
				return;
			}
			that.getOpenId(function(res){
				if(res.session_key){
					that.vs({type:'form',syn:true,url:that.getPhoneUrl,data:{iv: e.detail.iv, encryptedDataStr: e.detail.encryptedData,sessionID:res.session_key},
					callback:function(res){
						if(callback){
							callback(res);
						}
					}})
				}else{
					if(errorCallback){
						errorCallback(res)
					}
				}
			},function(res){
				console.log(res)
			})
		},
		getOpenId(callback,errorCallback){
		  wx.login({
			success(res) {
			  if (res.code) {
				that.vs({type:'get',syn:true,url:that.getOpenIdUrl,data:{code:res.code},
				callback:function(res){
					if(callback){
						callback(res)
					}
				},
				errorCallback:function(res){
					console.log(res)
				}})  
			  } else {
				console.log('登录失败！' + res.errMsg)
				if(errorCallback){
					errorCallback(res);
				}
			  }
			}
		  })
		},
		/**
		 * 自定义 TODO
		 */
		checkParam(key){
			let result = false;
			vsparams.params.forEach(s=>{
				if(s.name==key){
					result = true
					return
				}
			})
			return result;
		},
		getDict(dictArray,fn){
			  let name = 'getDict'
			  if(getApp().globalData.DICT){
				getApp().globalData.DICT={}
			  }
			  let DICT = getApp().globalData.DICT;
			  if(dictArray instanceof Array){
				  dictArray.forEach(e=>{
				  })
			  }else{
				this.log(name,`${dictArray}必须是数组`)
			  }
		},
		
		wxCheckSession(fn){
			wx.checkSession({
			  success () {
				  if(fn){
					fn();  
				  }
			  },
			  fail (e) {
			    console.log(e)
			  }
			})
		},
		getLocation(fn){
			wx.getLocation({
			    type: 'gcj02',
				success: (res) => {
					var location = {
						latitude:res.latitude,
						longitude:res.longitude
					}
					fn(location)
					getApp().globalData.location = res.location
				}
			})
		},
		checkAuth(scope,fn){
			wx.getSetting({
				success: (res) => {				   
					if (res.authSetting[scope]) {
						
						if(fn){
							fn()
						}
					}
				}
			})
		}
	}
}
</script>
<style >
.shade-layer{
	position: fixed;
	top:0;bottom: 0;right:0;left:0;
	z-index: 999999;
}
.err-page{
	position: fixed;
	top: 0;
	bottom: 0;
	right:0;
	left:0;
}
.err-log{
	  display:flex;
	  flex-direction: column;
	  align-items:center;/*垂直居中*/
	  justify-content: center;/*水平居中*/
	  width:100%;
	  height:100%;
}
.img{
	width: 300rpx;
	height: 300rpx;
}







	/* #ifndef APP-NVUE */
	page {
		display: flex;
		flex-direction: column;
		box-sizing: border-box;
		min-height: 100%;
		height: auto;
	}

	view {
		font-size: 14px;
		line-height: inherit;
	}

	.example {
		padding: 0 15px 15px;
	}

	.example-info {
		padding: 15px;
		color: #3b4144;
		background: #ffffff;
	}

	.example-body {
		flex-direction: row;
		flex-wrap: wrap;
		justify-content: center;
		padding: 0;
		font-size: 14px;
		background-color: #ffffff;
	}

	/* #endif */
	.example {
		padding: 0 15px;
	}

	.example-info {
		/* #ifndef APP-NVUE */
		display: block;
		/* #endif */
		padding: 15px;
		color: #3b4144;
		background-color: #ffffff;
		font-size: 14px;
		line-height: 20px;
	}

	.example-info-text {
		font-size: 14px;
		line-height: 20px;
		color: #3b4144;
	}


	.example-body {
		flex-direction: column;
		padding: 15px;
		background-color: #ffffff;
	}

	.word-btn-white {
		font-size: 18px;
		color: #FFFFFF;
	}

	.word-btn {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
		align-items: center;
		justify-content: center;
		border-radius: 6px;
		height: 48px;
		margin: 15px;
		background-color: #007AFF;
	}

	.word-btn--hover {
		background-color: #4ca2ff;
	}


	.example-body {
		/* #ifndef APP-NVUE */
		display: block;
		/* #endif */
		padding: 5px 15px;
	}

	.button {
		flex: 1;
		margin: 10px 0;
	}

	.popup-content {
		/* #ifndef APP-NVUE */
		display: block;
		/* #endif */
		background-color: #fff;
		padding: 15px;
		font-size: 14px;
	}

	/* 提示窗口 */
	.uni-tip {
		/* #ifndef APP-NVUE */
		display: flex;
		flex-direction: column;
		/* #endif */
		padding: 15px;
		width: 300px;
		background-color: #fff;
		border-radius: 10px;
	}

	.uni-tip-title {
		margin-bottom: 10px;
		text-align: center;
		font-weight: bold;
		font-size: 16px;
		color: #333;
	}

	.uni-tip-content {
		/* padding: 15px;
 */
		font-size: 14px;
		color: #666;
	}

	.uni-tip-group-button {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
		margin-top: 20px;
	}

	.uni-tip-button {
		flex: 1;
		text-align: center;
		font-size: 14px;
		color: #3b4144;
	}

	/* 插屏广告 */
	.uni-image {
		position: relative;
	}

	.image {
		width: 200px;
		height: 200px;
	}

	.uni-image-close {
		margin-top: 20px;
		text-align: center;
	}

	/* 底部分享 */
	.uni-share {
		/* #ifndef APP-NVUE */
		display: flex;
		flex-direction: column;
		/* #endif */
		background-color: #fff;
	}

	.uni-share-title {
		line-height: 60rpx;
		font-size: 24rpx;
		padding: 15rpx 0;
		text-align: center;
	}

	.uni-share-content {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
		flex-wrap: wrap;
		justify-content: center;
		padding: 15px;
	}

	.uni-share-content-box {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: column;
		align-items: center;
		width: 200rpx;
	}

	.uni-share-content-image {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
		justify-content: center;
		align-items: center;
		width: 60rpx;
		height: 60rpx;
		overflow: hidden;
		border-radius: 10rpx;
	}

	.content-image {
		width: 60rpx;
		height: 60rpx;
	}

	.uni-share-content-text {
		font-size: 26rpx;
		color: #333;
		padding-top: 5px;
		padding-bottom: 10px;
	}

	.uni-share-btn {
		height: 90rpx;
		line-height: 90rpx;
		font-size: 14px;
		border-top-color: #f5f5f5;
		border-top-width: 1px;
		border-top-style: solid;
		text-align: center;
		color: #666;
	}
</style>
 