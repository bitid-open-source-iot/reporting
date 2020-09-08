function _classCallCheck(e,r){if(!(e instanceof r))throw new TypeError("Cannot call a class as a function")}function _defineProperties(e,r){for(var t=0;t<r.length;t++){var n=r[t];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}function _createClass(e,r,t){return r&&_defineProperties(e.prototype,r),t&&_defineProperties(e,t),e}(window.webpackJsonp=window.webpackJsonp||[]).push([[10],{"9PJG":function(e,r,t){"use strict";t.r(r),t.d(r,"SigninModule",(function(){return O}));var n=t("ofXK"),o=t("NFeN"),i=t("qFsG"),a=t("d3UM"),s=t("bTqV"),c=t("/t3+"),m=t("kmnG"),u=t("mrSG"),b=t("3Pt+"),l=t("fXoL"),p=t("9ZKQ"),f=t("tyNb"),d=t("IRyT"),g=t("dWDE"),h=t("Xa2L");function w(e,r){if(1&e&&(l.Ub(0,"mat-error"),l.yc(1),l.Tb()),2&e){var t=l.gc();l.Cb(1),l.Ac(" ",t.errors.email," ")}}function y(e,r){if(1&e&&(l.Ub(0,"mat-error"),l.yc(1),l.Tb()),2&e){var t=l.gc();l.Cb(1),l.Ac(" ",t.errors.password," ")}}function v(e,r){1&e&&l.Pb(0,"mat-progress-spinner",10)}var C,k,P,x=[{path:"",component:(C=function(){function e(r,t,n,o){_classCallCheck(this,e),this.toast=r,this.router=t,this.service=n,this.formerror=o,this.form=new b.d({email:new b.b("",[b.p.email,b.p.required]),password:new b.b("",[b.p.required])}),this.errors={email:"",password:""},this.subscriptions={}}return _createClass(e,[{key:"submit",value:function(){return Object(u.a)(this,void 0,void 0,regeneratorRuntime.mark((function e(){var r;return regeneratorRuntime.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return this.loading=!0,this.form.disable(),e.next=3,this.service.login({email:this.form.value.email,password:this.form.value.password});case 3:r=e.sent,this.form.enable(),this.loading=!1,r.ok?this.router.navigate(["/apps"],{replaceUrl:!0}):this.toast.error(r.error.message);case 5:case"end":return e.stop()}}),e,this)})))}},{key:"ngOnInit",value:function(){var e=this;this.subscriptions.form=this.form.valueChanges.subscribe((function(r){e.errors=e.formerror.validateForm(e.form,e.errors,!0)}))}},{key:"ngOnDestroy",value:function(){this.subscriptions.form.unsubscribe()}}]),e}(),C.\u0275fac=function(e){return new(e||C)(l.Ob(p.a),l.Ob(f.b),l.Ob(d.a),l.Ob(g.a))},C.\u0275cmp=l.Ib({type:C,selectors:[["app-signin"]],decls:17,vars:5,consts:[[3,"formGroup","ngSubmit"],["src","./assets/icons/icon-512x512.png","alt","Auth Icon"],["appearance","outline"],["text-uppercase",""],["matInput","","type","email","name","email","placeholder","email","formControlName","email","required",""],[4,"ngIf"],["matInput","","type","password","name","password","placeholder","password","formControlName","password","required",""],["type","submit","mat-flat-button","","color","primary"],["class","mat-spinner-negative","mode","indeterminate","diameter","30",4,"ngIf"],["type","button","mat-stroked-button","","color","primary","routerLink","/signup"],["mode","indeterminate","diameter","30",1,"mat-spinner-negative"]],template:function(e,r){1&e&&(l.Ub(0,"form",0),l.cc("ngSubmit",(function(){return!r.form.invalid&&!r.loading&&r.submit()})),l.Pb(1,"img",1),l.Ub(2,"mat-form-field",2),l.Ub(3,"mat-label",3),l.yc(4," Email "),l.Tb(),l.Pb(5,"input",4),l.xc(6,w,2,1,"mat-error",5),l.Tb(),l.Ub(7,"mat-form-field",2),l.Ub(8,"mat-label",3),l.yc(9," Password "),l.Tb(),l.Pb(10,"input",6),l.xc(11,y,2,1,"mat-error",5),l.Tb(),l.Ub(12,"button",7),l.yc(13),l.xc(14,v,1,0,"mat-progress-spinner",8),l.Tb(),l.Ub(15,"button",9),l.yc(16," sign up "),l.Tb(),l.Tb()),2&e&&(l.mc("formGroup",r.form),l.Cb(6),l.mc("ngIf",r.errors.email),l.Cb(5),l.mc("ngIf",r.errors.password),l.Cb(2),l.Ac(" ",r.loading?"":"sign in"," "),l.Cb(1),l.mc("ngIf",r.loading))},directives:[b.q,b.j,b.e,m.c,m.g,i.a,b.a,b.i,b.c,b.o,n.k,s.a,f.c,m.b,h.a],styles:["img[_ngcontent-%COMP%]{width:100px;display:block;margin:25px auto}form[_ngcontent-%COMP%]{width:400px;margin:auto}form[_ngcontent-%COMP%]   [mat-stroked-button][_ngcontent-%COMP%]{margin-top:20px}@media screen and (max-width:420px){form[_ngcontent-%COMP%]{width:calc(100% - 20px)}}"]}),C)}],_=((P=function e(){_classCallCheck(this,e)}).\u0275mod=l.Mb({type:P}),P.\u0275inj=l.Lb({factory:function(e){return new(e||P)},imports:[[f.e.forChild(x)],f.e]}),P),O=((k=function e(){_classCallCheck(this,e)}).\u0275mod=l.Mb({type:k}),k.\u0275inj=l.Lb({factory:function(e){return new(e||k)},imports:[[b.f,n.c,o.b,i.b,s.b,a.b,c.b,m.e,b.n,_,h.b]]}),k)}}]);