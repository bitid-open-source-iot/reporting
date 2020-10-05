function _classCallCheck(e,r){if(!(e instanceof r))throw new TypeError("Cannot call a class as a function")}function _defineProperties(e,r){for(var t=0;t<r.length;t++){var n=r[t];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}function _createClass(e,r,t){return r&&_defineProperties(e.prototype,r),t&&_defineProperties(e,t),e}(window.webpackJsonp=window.webpackJsonp||[]).push([[9],{"9PJG":function(e,r,t){"use strict";t.r(r),t.d(r,"SigninModule",(function(){return O}));var n=t("ofXK"),i=t("NFeN"),o=t("qFsG"),a=t("d3UM"),s=t("bTqV"),c=t("/t3+"),m=t("kmnG"),u=t("mrSG"),p=t("3Pt+"),l=t("fXoL"),b=t("9ZKQ"),f=t("tyNb"),d=t("IRyT"),g=t("dWDE"),h=t("Xa2L");function w(e,r){if(1&e&&(l.Wb(0,"mat-error"),l.Dc(1),l.Vb()),2&e){var t=l.ic();l.Cb(1),l.Fc(" ",t.errors.email," ")}}function C(e,r){if(1&e&&(l.Wb(0,"mat-error"),l.Dc(1),l.Vb()),2&e){var t=l.ic();l.Cb(1),l.Fc(" ",t.errors.password," ")}}function v(e,r){1&e&&l.Rb(0,"mat-progress-spinner",10)}var y,k,_,P=[{path:"",component:(y=function(){function e(r,t,n,i){_classCallCheck(this,e),this.toast=r,this.router=t,this.service=n,this.formerror=i,this.form=new p.d({email:new p.b("",[p.q.email,p.q.required]),password:new p.b("",[p.q.required])}),this.errors={email:"",password:""},this.subscriptions={}}return _createClass(e,[{key:"submit",value:function(){return Object(u.a)(this,void 0,void 0,regeneratorRuntime.mark((function e(){var r;return regeneratorRuntime.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return this.loading=!0,this.form.disable(),e.next=3,this.service.login({email:this.form.value.email,password:this.form.value.password});case 3:r=e.sent,this.form.enable(),this.loading=!1,r.ok?this.router.navigate(["/apps"],{replaceUrl:!0}):this.toast.error(r.error.message);case 5:case"end":return e.stop()}}),e,this)})))}},{key:"ngOnInit",value:function(){var e=this;this.subscriptions.form=this.form.valueChanges.subscribe((function(r){e.errors=e.formerror.validateForm(e.form,e.errors,!0)}))}},{key:"ngOnDestroy",value:function(){this.subscriptions.form.unsubscribe()}}]),e}(),y.\u0275fac=function(e){return new(e||y)(l.Qb(b.a),l.Qb(f.c),l.Qb(d.a),l.Qb(g.a))},y.\u0275cmp=l.Kb({type:y,selectors:[["app-signin"]],decls:17,vars:5,consts:[[3,"formGroup","ngSubmit"],["src","./assets/icons/icon-512x512.png","alt","Auth Icon"],["appearance","outline"],["text-uppercase",""],["matInput","","type","email","name","email","placeholder","email","formControlName","email","required",""],[4,"ngIf"],["matInput","","type","password","name","password","placeholder","password","formControlName","password","required",""],["type","submit","mat-flat-button","","color","primary"],["class","mat-spinner-negative","mode","indeterminate","diameter","30",4,"ngIf"],["type","button","mat-stroked-button","","color","primary","routerLink","/signup"],["mode","indeterminate","diameter","30",1,"mat-spinner-negative"]],template:function(e,r){1&e&&(l.Wb(0,"form",0),l.ec("ngSubmit",(function(){return!r.form.invalid&&!r.loading&&r.submit()})),l.Rb(1,"img",1),l.Wb(2,"mat-form-field",2),l.Wb(3,"mat-label",3),l.Dc(4," Email "),l.Vb(),l.Rb(5,"input",4),l.Cc(6,w,2,1,"mat-error",5),l.Vb(),l.Wb(7,"mat-form-field",2),l.Wb(8,"mat-label",3),l.Dc(9," Password "),l.Vb(),l.Rb(10,"input",6),l.Cc(11,C,2,1,"mat-error",5),l.Vb(),l.Wb(12,"button",7),l.Dc(13),l.Cc(14,v,1,0,"mat-progress-spinner",8),l.Vb(),l.Wb(15,"button",9),l.Dc(16," sign up "),l.Vb(),l.Vb()),2&e&&(l.pc("formGroup",r.form),l.Cb(6),l.pc("ngIf",r.errors.email),l.Cb(5),l.pc("ngIf",r.errors.password),l.Cb(2),l.Fc(" ",r.loading?"":"sign in"," "),l.Cb(1),l.pc("ngIf",r.loading))},directives:[p.r,p.k,p.e,m.c,m.g,o.a,p.a,p.j,p.c,p.p,n.m,s.a,f.d,m.b,h.a],styles:["img[_ngcontent-%COMP%]{width:100px;display:block;margin:25px auto}form[_ngcontent-%COMP%]{width:400px;margin:auto}form[_ngcontent-%COMP%]   [mat-stroked-button][_ngcontent-%COMP%]{margin-top:20px}@media screen and (max-width:420px){form[_ngcontent-%COMP%]{width:calc(100% - 20px)}}"]}),y)}],x=((_=function e(){_classCallCheck(this,e)}).\u0275mod=l.Ob({type:_}),_.\u0275inj=l.Nb({factory:function(e){return new(e||_)},imports:[[f.f.forChild(P)],f.f]}),_),O=((k=function e(){_classCallCheck(this,e)}).\u0275mod=l.Ob({type:k}),k.\u0275inj=l.Nb({factory:function(e){return new(e||k)},imports:[[p.g,n.c,i.b,o.b,s.b,a.b,c.b,m.e,p.o,x,h.b]]}),k)}}]);