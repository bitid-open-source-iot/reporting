(window.webpackJsonp=window.webpackJsonp||[]).push([[12],{UUSl:function(r,t,o){"use strict";o.r(t),o.d(t,"SignupModule",(function(){return V}));var e=o("ofXK"),n=o("NFeN"),i=o("qFsG"),s=o("d3UM"),a=o("bTqV"),c=o("/t3+"),m=o("kmnG"),b=o("mrSG"),p=o("3Pt+"),u=o("fXoL"),f=o("9ZKQ"),l=o("tyNb"),d=o("IRyT"),g=o("dWDE"),h=o("Xa2L");function w(r,t){if(1&r&&(u.Wb(0,"mat-error"),u.Fc(1),u.Vb()),2&r){const r=u.ic();u.Cb(1),u.Hc(" ",r.errors.email," ")}}function y(r,t){if(1&r&&(u.Wb(0,"mat-error"),u.Fc(1),u.Vb()),2&r){const r=u.ic();u.Cb(1),u.Hc(" ",r.errors.password," ")}}function v(r,t){if(1&r&&(u.Wb(0,"mat-error"),u.Fc(1),u.Vb()),2&r){const r=u.ic();u.Cb(1),u.Jc(" ",r.errors.confirm," ",r.errors.confirm&&r.form.value.password!=r.form.value.confirm?" & ":""," ",r.form.value.password!=r.form.value.confirm?"Passwords do not match":""," ")}}function C(r,t){1&r&&u.Rb(0,"mat-progress-spinner",14)}const W=[{path:"",component:(()=>{class r{constructor(r,t,o,e){this.toast=r,this.router=t,this.service=o,this.formerror=e,this.form=new p.f({email:new p.c("",[p.t.email,p.t.required]),confirm:new p.c("",[p.t.required]),password:new p.c("",[p.t.required])}),this.errors={email:"",confirm:"",password:""},this.subscriptions={}}submit(){return Object(b.a)(this,void 0,void 0,(function*(){this.loading=!0,this.form.disable();const r=yield this.service.register({email:this.form.value.email,password:this.form.value.password});this.form.enable(),this.loading=!1,r.ok?this.router.navigate(["/verify"],{replaceUrl:!0}):this.toast.error(r.error.message)}))}ngOnInit(){this.subscriptions.form=this.form.valueChanges.subscribe(r=>{this.errors=this.formerror.validateForm(this.form,this.errors,!0)})}ngOnDestroy(){this.subscriptions.form.unsubscribe()}}return r.\u0275fac=function(t){return new(t||r)(u.Qb(f.a),u.Qb(l.c),u.Qb(d.a),u.Qb(g.a))},r.\u0275cmp=u.Kb({type:r,selectors:[["app-signup"]],decls:32,vars:6,consts:[[3,"formGroup","ngSubmit"],["src","./assets/icons/icon-512x512.png","alt","Auth Icon"],["appearance","outline"],["text-uppercase",""],["matInput","","type","email","name","email","placeholder","email","formControlName","email","required",""],[4,"ngIf"],["matInput","","type","password","name","password","placeholder","password","formControlName","password","required",""],["matInput","","type","password","name","confirm","placeholder","confirm password","formControlName","confirm","required",""],["type","submit","mat-flat-button","","color","primary"],["class","mat-spinner-negative","mode","indeterminate","diameter","30",4,"ngIf"],["routerLink","/terms-and-conditions"],["routerLink","/privacy-policy"],["type","button","mat-stroked-button","","color","primary","routerLink","/verfiy"],["type","button","mat-stroked-button","","color","primary","routerLink","/signin"],["mode","indeterminate","diameter","30",1,"mat-spinner-negative"]],template:function(r,t){1&r&&(u.Wb(0,"form",0),u.ec("ngSubmit",(function(){return!t.form.invalid&&!t.loading&&t.form.value.password==t.form.value.confirm&&t.submit()})),u.Rb(1,"img",1),u.Wb(2,"mat-form-field",2),u.Wb(3,"mat-label",3),u.Fc(4," Email "),u.Vb(),u.Rb(5,"input",4),u.Dc(6,w,2,1,"mat-error",5),u.Vb(),u.Wb(7,"mat-form-field",2),u.Wb(8,"mat-label",3),u.Fc(9," Password "),u.Vb(),u.Rb(10,"input",6),u.Dc(11,y,2,1,"mat-error",5),u.Vb(),u.Wb(12,"mat-form-field",2),u.Wb(13,"mat-label",3),u.Fc(14," Confirm Password "),u.Vb(),u.Rb(15,"input",7),u.Dc(16,v,2,3,"mat-error",5),u.Vb(),u.Wb(17,"button",8),u.Fc(18),u.Dc(19,C,1,0,"mat-progress-spinner",9),u.Vb(),u.Wb(20,"p"),u.Fc(21," By clicking \u201cSIGN UP\u201d, you agree to our "),u.Wb(22,"a",10),u.Fc(23,"Terms & Conditions"),u.Vb(),u.Fc(24," and "),u.Wb(25,"a",11),u.Fc(26,"Privacy Policy"),u.Vb(),u.Fc(27,". We\u2019ll occasionally send you account related emails. "),u.Vb(),u.Wb(28,"button",12),u.Fc(29," verfiy account "),u.Vb(),u.Wb(30,"button",13),u.Fc(31," back to sign in "),u.Vb(),u.Vb()),2&r&&(u.pc("formGroup",t.form),u.Cb(6),u.pc("ngIf",t.errors.email),u.Cb(5),u.pc("ngIf",t.errors.password),u.Cb(5),u.pc("ngIf",t.errors.confirm||t.form.value.password!=t.form.value.confirm),u.Cb(2),u.Hc(" ",t.loading?"":"sign up"," "),u.Cb(1),u.pc("ngIf",t.loading))},directives:[p.u,p.n,p.g,m.c,m.g,i.a,p.b,p.m,p.e,p.s,e.m,a.a,l.e,l.d,m.b,h.a],styles:["img[_ngcontent-%COMP%]{width:100px;display:block;margin:25px auto}form[_ngcontent-%COMP%]{width:400px;margin:auto}form[_ngcontent-%COMP%]   [mat-stroked-button][_ngcontent-%COMP%]{margin-top:20px}p[_ngcontent-%COMP%]{font-size:12px;margin-top:15px;text-align:justify;line-height:15px}p[_ngcontent-%COMP%]   a[_ngcontent-%COMP%]{color:#2196f3}@media screen and (max-width:420px){form[_ngcontent-%COMP%]{width:calc(100% - 20px)}}"]}),r})()}];let F=(()=>{class r{}return r.\u0275mod=u.Ob({type:r}),r.\u0275inj=u.Nb({factory:function(t){return new(t||r)},imports:[[l.f.forChild(W)],l.f]}),r})(),V=(()=>{class r{}return r.\u0275mod=u.Ob({type:r}),r.\u0275inj=u.Nb({factory:function(t){return new(t||r)},imports:[[p.i,e.c,n.b,i.b,a.b,s.b,c.b,m.e,p.r,F,h.b]]}),r})()}}]);