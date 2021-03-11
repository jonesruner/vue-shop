(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-59e41b81"],{"170b":function(e,t,a){"use strict";a.r(t);var r=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",[a("el-breadcrumb",{attrs:{"separator-class":"el-icon-arrow-right"}},[a("el-breadcrumb-item",{attrs:{to:{path:"/welcome"}}},[e._v("首页")]),a("el-breadcrumb-item",[e._v("商品管理")]),a("el-breadcrumb-item",[e._v("商品分类")])],1),a("el-card",[a("el-row",[a("el-button",{attrs:{type:"primary"},on:{click:e.showAddCategoryDialog}},[e._v("添加分类")])],1),a("el-row",[a("tree-table",{attrs:{border:"",stripe:"","show-index":!0,"expand-type":!1,"selection-type":!1,data:e.cateList,columns:e.columns},scopedSlots:e._u([{key:"isOk",fn:function(t){return[!1===t.row.cat_deleted?a("i",{staticClass:"el-icon-success",staticStyle:{color:"lightgreen"}}):e._e(),t.row.cat_deleted?a("i",{staticClass:"el-icon-error",staticStyle:{color:"red"}}):e._e()]}},{key:"order",fn:function(t){return[0===t.row.cat_level?a("el-tag",{attrs:{type:"primary",size:"mini"}},[e._v("一级")]):1===t.row.cat_level?a("el-tag",{attrs:{type:"success",size:"mini"}},[e._v("二级")]):a("el-tag",{attrs:{type:"warning",size:"mini"}},[e._v("三级")])]}}])},[a("template",{slot:"opt"},[a("el-button",{attrs:{type:"primary",icon:"el-icon-edit",size:"mini"}},[e._v("编辑")]),a("el-button",{attrs:{type:"danger",icon:"el-icon-delete",size:"mini"}},[e._v("删除")])],1)],2)],1),a("el-row",[a("el-pagination",{attrs:{"current-page":0,"page-sizes":e.pageSizes,"page-size":e.pageParams.pagesize,layout:"total, sizes, prev, pager, next, jumper",total:e.total},on:{"size-change":e.handleSizeChange,"current-change":e.handleCurrentChange}})],1)],1),a("el-dialog",{attrs:{title:"添加分类",visible:e.addCatDialogVisible,width:"50%"},on:{close:e.addCatDialogClose,"update:visible":function(t){e.addCatDialogVisible=t}}},[a("div",[a("el-form",{ref:"addCatFormRef",attrs:{model:e.addCatForm,"label-width":"100px",rules:e.addCatFormRules}},[a("el-form-item",{attrs:{label:"分类名称：",prop:"cat_name"}},[a("el-input",{model:{value:e.addCatForm.cat_name,callback:function(t){e.$set(e.addCatForm,"cat_name",t)},expression:"addCatForm.cat_name"}})],1),a("el-form-item",{attrs:{label:"父级分类"}},[a("el-cascader",{attrs:{options:e.parentCateList,props:e.cascaderProps,height:"300",clearable:""},on:{change:e.handleChange},model:{value:e.selectedKeys,callback:function(t){e.selectedKeys=t},expression:"selectedKeys"}})],1)],1)],1),a("span",{staticClass:"dialog-footer",attrs:{slot:"footer"},slot:"footer"},[a("el-button",{on:{click:function(t){e.addCatDialogVisible=!1}}},[e._v("取消")]),a("el-button",{attrs:{type:"primary"},on:{click:e.addCategory}},[e._v("确定")])],1)])],1)},s=[],i=(a("96cf"),a("1da1")),n={data:function(){return{selectedKeys:[],addCatForm:{cat_name:"",cat_pid:0,cat_level:0},cascaderProps:{value:"cat_id",label:"cat_name",children:"children",checkStrictly:"true",expandTrigger:"hover"},parentCateList:[],addCatFormRules:{cat_name:[{required:!0,message:"请输入新增分类名称",trigger:"blur"}]},addCatDialogVisible:!1,cateList:[],total:0,pageSizes:[8,15,20,30],pageParams:{type:3,pagenum:1,pagesize:8},columns:[{label:"分类名称",prop:"cat_name"},{label:"是否有效",type:"template",template:"isOk"},{label:"排序",type:"template",template:"order"},{label:"操作",type:"template",template:"opt"}]}},methods:{handleChange:function(e){this.selectedKeys.length>0?(this.addCatForm.cat_pid=this.selectedKeys[this.selectedKeys.length-1],this.addCatForm.cat_level=this.selectedKeys.length):(this.addCatForm.cat_pid=0,this.addCatForm.cat_level=0)},getParentCateList:function(){var e=this;return Object(i["a"])(regeneratorRuntime.mark((function t(){var a,r;return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:return t.next=2,e.$http.get("categories",{params:{type:"2"}});case 2:if(a=t.sent,r=a.data,200===r.meta.status){t.next=6;break}return t.abrupt("return",e.$message.error("获取父级分类数据失败！"));case 6:e.parentCateList=r.data;case 7:case"end":return t.stop()}}),t)})))()},addCategory:function(){var e=this;this.$refs.addCatFormRef.validate(function(){var t=Object(i["a"])(regeneratorRuntime.mark((function t(a){var r,s;return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:if(a){t.next=2;break}return t.abrupt("return");case 2:return t.next=4,e.$http.post("categories",e.addCatForm);case 4:if(r=t.sent,s=r.data,201===s.meta.status){t.next=8;break}return t.abrupt("return",e.$message.error("添加分类失败！！！"));case 8:e.$message.success("添加分类成功"),e.getCateList(),e.addCatDialogVisible=!1;case 11:case"end":return t.stop()}}),t)})));return function(e){return t.apply(this,arguments)}}())},addCatDialogClose:function(){this.$refs.addCatFormRef.resetFields(),this.selectedKeys=[],this.addCatForm.cat_pid=0,this.addCatForm.cat_level=0},showAddCategoryDialog:function(){this.getParentCateList(),this.addCatDialogVisible=!0},handleSizeChange:function(e){this.pageParams.pagesize=e,this.getCateList()},handleCurrentChange:function(e){this.pageParams.pagenum=e,this.getCateList()},getCateList:function(){var e=this;return Object(i["a"])(regeneratorRuntime.mark((function t(){var a,r;return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:return t.next=2,e.$http.get("categories",{params:e.pageParams});case 2:if(a=t.sent,r=a.data,200===r.meta.status){t.next=6;break}return t.abrupt("return",e.$message.error("获取商品分类失败！！！"));case 6:e.cateList=r.data.result,e.total=r.data.total;case 8:case"end":return t.stop()}}),t)})))()}},created:function(){this.getCateList()}},l=n,o=(a("e5d9"),a("2877")),c=Object(o["a"])(l,r,s,!1,null,null,null);t["default"]=c.exports},d180:function(e,t,a){},e5d9:function(e,t,a){"use strict";a("d180")}}]);
//# sourceMappingURL=chunk-59e41b81.a6a5cc4f.js.map