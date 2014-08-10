(function(){var t={}.hasOwnProperty,e=function(e,r){function n(){this.constructor=e}for(var i in r)t.call(r,i)&&(e[i]=r[i]);return n.prototype=r.prototype,e.prototype=new n,e.__super__=r.prototype,e};!function(t){"use strict";var r,n;return r=t.pi=t.pi||{},n=r.utils,r.controllers||(r.controllers={}),r.controllers.UsersEdit=function(t){function n(){this._scope=new r.utils.Scope,n.__super__.constructor.call(this,"users")}return e(n,t),n.prototype.destroy=function(){return!1},n.prototype.save=function(){return!1},n.prototype.cancel=function(){return this.view.leftbar.one("hidden",function(t){return function(){return t.switch_to("main")}}(this)),this.view.close()},n.prototype.switched_from_main=function(){return this.view["new"](),!0},n.include(r.modules.Search),n}(r.controllers.Base)}(this)}).call(this),function(){var t={}.hasOwnProperty,e=function(e,r){function n(){this.constructor=e}for(var i in r)t.call(r,i)&&(e[i]=r[i]);return n.prototype=r.prototype,e.prototype=new n,e.__super__=r.prototype,e};!function(t){"use strict";var r,n;return r=t.pi=t.pi||{},n=r.utils,r.controllers||(r.controllers={}),r.controllers.Users=function(t){function r(){r.__super__.constructor.call(this,"users","main")}return e(r,t),r.prototype.destroy=function(){return!0},r.prototype.edit=function(t){return this.goto(this._path("edit",t)[0],"_self")},r.prototype.search=function(t){return this.view.search(t)},r.prototype.sort=function(t){return this.view.sort(t)},r}(r.controllers.Base)}(this)}.call(this),function(){var t={}.hasOwnProperty,e=function(e,r){function n(){this.constructor=e}for(var i in r)t.call(r,i)&&(e[i]=r[i]);return n.prototype=r.prototype,e.prototype=new n,e.__super__=r.prototype,e};!function(t){"use strict";var r,n;return r=t.pi=t.pi||{},n=r.utils,r.controllers||(r.controllers={}),r.controllers.UsersSelect=function(t){function i(){this._scope=new r.utils.Scope(null,["page"],{q:function(t,e){var r;return 0===(null!=(r=e.match(t))?r.index:void 0)?t||"":!1}}),i.__super__.constructor.call(this,"users")}return e(i,t),i.prototype.initialize=function(){return i.__super__.initialize.apply(this,arguments),after(3e3,function(t){return function(){return t.index()}}(this))},i.prototype.cancel=function(){return this.view.close().then(function(t){return function(){return t.view.reset(),t.exit()}}(this))},i.prototype.select_users=function(){var t,e,r,i,o,s;for(s=[],o=this.view.list.selected(),e=0,i=o.length;i>e;e++)t=o[e],r=n.clone(t,["nod","selected","disabled","role","role_name"]),r.changed=1,s.push(r);return this.view.close().then(function(t){return function(){return t.exit({users:s})}}(this))},i.prototype.switched_from_any=function(t){return this.view["new"](null!=t?t.users:void 0)},i.include(r.modules.Paginated,r.modules.Search),i}(r.controllers.Base)}(this)}.call(this),function(){var t={}.hasOwnProperty,e=function(e,r){function n(){this.constructor=e}for(var i in r)t.call(r,i)&&(e[i]=r[i]);return n.prototype=r.prototype,e.prototype=new n,e.__super__=r.prototype,e};!function(t){"use strict";var r,n;return r=t.pi=t.pi||{},n=r.utils,r.views||(r.views={}),r.views.UsersEditView=function(t){function r(){r.__super__.constructor.call(this,[{list:"add_users_list"}],null)}return e(r,t),r.prototype.initialize=function(){return r.__super__.initialize.apply(this,arguments)},r.prototype["new"]=function(){return this._show()},r.prototype.edit=function(){return!1},r.prototype.destroy=function(){return!1},r.prototype.clear=function(){return r.__super__.clear.apply(this,arguments),this.form.clear()},r.prototype.close=function(){return this.leftbar.hide()},r.prototype._show=function(){return this.leftbar.one("hidden",function(t){return function(){return after(500,function(){return t.clear()})}}(this)),this.leftbar.show()},r}(r.views.CommonListView)}(this)}.call(this),function(){var t={}.hasOwnProperty,e=function(e,r){function n(){this.constructor=e}for(var i in r)t.call(r,i)&&(e[i]=r[i]);return n.prototype=r.prototype,e.prototype=new n,e.__super__=r.prototype,e};!function(t){"use strict";var r,n;return r=t.pi=t.pi||{},n=r.utils,r.views||(r.views={}),r.views.UsersView=function(t){function r(){r.__super__.constructor.call(this,[{list:"users_list"},"loader","show_user_popup","new_user_popup","show_user_form",{confirm:"confirm_modal"}])}return e(r,t),r.prototype.render_list_data=function(t){var e,r,n,i;for(i=t.users,r=0,n=i.length;n>r;r++)e=i[r],this.list.add_item(e,!1);return this.list.update()},r.prototype.show=function(t){return this.popup.open(this.show_user_popup,{align:!1}),this.show_user_form.data(t),this.show_user_list.data_provider(t.participants)},r.prototype["new"]=function(){return this.popup.open(this.new_user_popup)},r}(r.views.CommonListView)}(this)}.call(this),function(){var t={}.hasOwnProperty,e=function(e,r){function n(){this.constructor=e}for(var i in r)t.call(r,i)&&(e[i]=r[i]);return n.prototype=r.prototype,e.prototype=new n,e.__super__=r.prototype,e},r=[].indexOf||function(t){for(var e=0,r=this.length;r>e;e++)if(e in this&&this[e]===t)return e;return-1};!function(t){"use strict";var n,i;return n=t.pi=t.pi||{},i=n.utils,n.views||(n.views={}),n.views.UsersSelectView=function(t){function i(){i.__super__.constructor.call(this,[{list:"users_select_list"},{loader:"users_select_loader"},{nod:"select_users_popup"},{search_field:"users_search"}],null)}return e(i,t),i.prototype.initialize=function(){return i.__super__.initialize.apply(this,arguments),this.list._create_item=this._list_create_item},i.prototype._list_create_item=function(t){var e,i;return e=n.List.prototype._create_item.call(this,t),null!=this._disabled_ids&&(i=e.id,r.call(this._disabled_ids,i)>=0)&&this.selectable.disable_item(e),e},i.prototype["new"]=function(t){var e,n,i,o,s,u;if(this.list._disabled_ids=null!=t?function(){var e,r,i;for(i=[],e=0,r=t.length;r>e;e++)n=t[e],i.push(n.id);return i}():null,null!=this.list._disabled_ids)for(s=this.list.items,i=0,o=s.length;o>i;i++)e=s[i],u=e.id,r.call(this.list._disabled_ids,u)>=0&&this.list.selectable.disable_item(e);return this._show()},i.prototype.clear=function(){return i.__super__.clear.apply(this,arguments)},i.prototype.close=function(){return this.popup.close()},i.prototype.reset=function(){var t,e,r,n;for(n=this.list.items,e=0,r=n.length;r>e;e++)t=n[e],this.list.selectable.enable_item(t);return this.list.clear_selection(),this.search_field.reset()},i.prototype.render_list_data=function(t){var e,r,n,i;for(i=t.users,r=0,n=i.length;n>r;r++)e=i[r],this.list.add_item(e,!1);return this.list.update()},i.prototype._show=function(){return this.popup.open(this.nod,{align:!1,close:"@@cancel"})},i}(n.views.CommonListView)}(this)}.call(this);