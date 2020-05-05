<template>
	<view>
		<api ref="api"></api>
		<cu-custom bgColor="bg-gradual-red" ><block slot="backText">管理</block><block slot="content">小账本</block></cu-custom>
		<view class="nav-list margin-top" style="width: 200%" @click="showUserControl">
			<view hover-class="none"  class="nav-li bg-yellow text-white" :style="[{animation: 'show ' + ((3)*0.2+1) + 's 1'}]">
				<view class="nav-title">1</view>
				<view class="nav-name">2</view>
				<text class="cuIcon-newsfill"></text>
			</view>
		</view>
		<view class="nav-list ">
			<view hover-class="none"  class="nav-li bg-red" :style="[{animation: 'show ' + (1*0.2+1) + 's 1'}]" @click="inFlag=1">
				<view class="nav-title">收入</view>
				<view class="nav-name">in</view>
				<text class="cuIcon-newsfill"></text>
			</view>
			<view hover-class="none"  class="nav-li bg-green"  :style="[{animation: 'show ' + (2*0.2+1) + 's 1'}]" @click="inFlag=0">
				<view class="nav-title">支出</view>
				<view class="nav-name">out</view>
				<text class="cuIcon-newsfill"></text>
			</view>
		</view>
		<!--list begin-->
		<view class="cu-bar bg-white solid-top">
			<view class="action">
				<text class="cuIcon-title text-blue"></text>{{inFlag==1?"收入":"支出"}}
			</view>
			<view class="action">
				<button class="cu-btn round bg-orange sm" @click="addBill">新增{{inFlag==1?"收入":"支出"}}</button>
			</view>
		</view>
		<div style="width: 100%;height: 1rpx;"></div>
		<div v-if="inFlag==1">
			<div class="flex justify-between in-list bg-red" :style="[{animation: 'show ' + ((index+1)*0.2+1) + 's 1'}]"  v-for="(item,index) in billIn">
				<div>{{item.title}}</div>
				<div>{{item.date}}</div>
			</div>
		</div>
		<div v-if="inFlag==0">
			<div class="flex justify-between in-list bg-green" :style="[{animation: 'show ' + ((index+1)*0.2+1) + 's 1'}]" v-for="(item,index) in billOut">
				<div>{{item.title}}</div>
				<div>{{item.date}}</div>
			</div>
		</div>
		<!--list end-->
		<!--modal begin-->
		<view class="cu-modal"  :class="newBill.show?'show':''">
			<view class="cu-dialog" style="width: auto;">
				<view class="cu-bar bg-white justify-end">
					<view class="content" :class="inFlag==1?'text-red':'text-green'">新增{{inFlag==1?"收入":"支出"}}</view>
				</view>
				<view class="bg-white">
					<form class="text-align: left;">
						<view class="cu-form-group ">
							<view class="title">类目</view>
							<picker @change="itemChange" :value="newBill.index" :range="book.items">
								<view class="picker">
									{{newBill.itemIndex>-1?book.items[newBill.itemIndex]:book.items[0]}}
								</view>
							</picker>
						</view>
						<view class="cu-form-group">
							<view class="title">日期选择</view>
							<picker mode="date" :value="newBill.date" start="2015-09-01" end="2021-09-01" @change="dateChange">
								<view class="picker">
									{{newBill.date}}
								</view>
							</picker>
						</view>
						<view class="cu-form-group" style="text-align:right;">
							<view class="title">{{inFlag==1?"收入":"支出"}}金额</view>
							<input style="z-index: 999999;" placeholder="金额" name="input" @input="onJeInput"></input>
						</view>
						<!-- <view class="cu-form-group align-start">
							<view class="title">备注</view>
							<textarea maxlength="5"  @input="textareaBInput" placeholder="备注"></textarea>
						</view> -->
					</form>	
				</view>
				<view class="cu-bar bg-white">
					<view class="action margin-0 flex-sub" :class="inFlag==1?'text-red':'text-green'" @tap="hidenewBill">确定</view>
					<view class="action margin-0 flex-sub  solid-left" @tap="hidenewBill">取消</view>
				</view>
			</view>
		</view>
		<view class="cu-modal"  :class="newItem.show?'show':''">
			<view class="cu-dialog" style="width: auto;">
				<view class="cu-bar bg-white justify-end">
					<view class="content" :class="inFlag==1?'text-red':'text-green'">新增类目</view>
				</view>
				<view class="bg-white">
					<form class="text-align: left;">
						<view class="cu-form-group" style="text-align:right;">
							<view class="title">类目名</view>
							<input style="z-index: 999999;" placeholder="类目名" name="input" @input="onJeInput"></input>
						</view>
					</form>	
				</view>
				<view class="cu-bar bg-white">
					<view class="action margin-0 flex-sub" :class="inFlag==1?'text-red':'text-green'" @tap="hidenewItem">确定</view>
					<view class="action margin-0 flex-sub  solid-left" @tap="hidenewItem">取消</view>
				</view>
			</view>
		</view>
		<!--modal end-->
		<!--user control begin-->
		<view style="z-index:999999" class="cu-modal drawer-modal justify-start" :class="userControl.show?'show':''" @tap="userControl.show=false">
			<view class="cu-dialog basis-lg bg-white" @tap.stop="" :style="[{top:CustomBar+'px',height:'calc(100vh - ' + CustomBar + 'px)'}]">
				<view class="cu-avatar xl round margin" style="background-image:url(https://ossweb-img.qq.com/images/lol/web201310/skin/big99008.jpg);"></view>
				<view class="cu-list menu text-left">
					<view class="cu-item arrow" v-for="(item,index) in userControl.books" :key="index">
						<view class="content">
							<view>{{item.name}}</view>
						</view>
					</view>
				</view>
				<div style="text-align: center;font-weight: bold;" class="text-blue margin padding">+新增一个账本</div>
			</view>
		</view>
		<!---user control end-->
		<view class="cu-tabbar-height"></view>
	</view>
</template>

<script>
	import api from "../vscomponent/api.vue"
	var that;
	export default {
		
		data() {
			return {
				userControl:{
					show:false,
					books:[{id:"231313",name:"我的账本"},{id:"231313",name:"我的新账本"}
					]
				},
				book:{
					items:['一般支出', '+增加一个新类目+']
				},
				inFlag:1,
				newItem:{
					show:false,
					name:""
				},
				newBill:{
					show:false,
					itemIndex:-1,
					date:"2020-02-03",
					je:0.0,
					desc:"2020-02-03"
				},
				billIn:[
					{title:"一般收入+299,999",date:"2020-20-1"},
					{title:"一般收入+299,999",date:"2020-20-1"},
					{title:"一般收入+299,999",date:"2020-20-1"},
					{title:"一般收入+299,999",date:"2020-20-1"},
					{title:"一般收入+299,999",date:"2020-20-1"},
					{title:"一般收入+299,999",date:"2020-20-1"}
				],
				billOut:[
					{title:"一般支出+299,999",date:"2020-20-1"},
					{title:"一般支出+299,999",date:"2020-20-1"},
					{title:"一般支出+299,999",date:"2020-20-1"},
					{title:"一般支出+299,999",date:"2020-20-1"},
					{title:"一般支出+299,999",date:"2020-20-1"},
					{title:"一般支出+299,999",date:"2020-20-1"}
				]
			}
		},
		created(options){
			console.log(options);
			that = this;
		},
		mounted() {
			that.api=that.$refs.api;
		},
		methods: {
			//user
			showUserControl(){
				that.userControl.show=true
			},
			//add bill
			addBill(){
				//that.api.vs({type:"toast",message:"12312312"})
				that.newBill.show=true
			},
			onJeInput(e){
				console.log(e)
			},
			hidenewBill(){
				that.newBill.show=false
			},
			itemChange(e){
				if(that.book.items[e.detail.value]=='+增加一个新类目+'){
					that.addItem()
					return
				}
				that.newBill.itemIndex=e.detail.value
			},
			dateChange(e){
				that.newBill.date=e.detail.value
			},
			//add item
			addItem(){
				that.newItem.show=true
			},
			hidenewItem(){
				that.newItem.show=false
			}
		}
	}
</script>

<style>
page{
	background-color: #fff;
}
.in-list{
	color:#fff;
	margin:25rpx 50rpx;
	padding: 15rpx;
	border-radius: 12upx;
}
</style>
