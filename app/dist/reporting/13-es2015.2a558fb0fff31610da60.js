(window.webpackJsonp=window.webpackJsonp||[]).push([[13],{UUSl:function(r,t,o){"use strict";o.r(t),o.d(t,"SignupModule",(function(){return V}));var e=o("ofXK"),n=o("NFeN"),i=o("qFsG"),s=o("d3UM"),a=o("bTqV"),c=o("/t3+"),m=o("kmnG"),b=o("mrSG"),u=o("3Pt+"),l=o("fXoL"),p=o("9ZKQ"),f=o("tyNb"),d=o("IRyT"),g=o("dWDE"),h=o("Xa2L");function w(r,t){if(1&r&&(l.Wb(0,"mat-error"),l.Gc(1),l.Vb()),2&r){const r=l.ic();l.Cb(1),l.Ic(" ",r.errors.email," ")}}function y(r,t){if(1&r&&(l.Wb(0,"mat-error"),l.Gc(1),l.Vb()),2&r){const r=l.ic();l.Cb(1),l.Ic(" ",r.errors.password," ")}}function v(r,t){if(1&r&&(l.Wb(0,"mat-error"),l.Gc(1),l.Vb()),2&r){const r=l.ic();l.Cb(1),l.Kc(" ",r.errors.confirm," ",r.errors.confirm&&r.form.value.password!=r.form.value.confirm?" & ":""," ",r.form.value.password!=r.form.value.confirm?"Passwords do not match":""," ")}}function C(r,t){1&r&&l.Rb(0,"mat-progress-spinner",14)}const G=[{path:"",component:(()=>{class r{constructor(r,t,o,e){this.toast=r,this.router=t,this.service=o,this.formerror=e,this.form=new u.f({email:new u.c("",[u.t.email,u.t.required]),confirm:new u.c("",[u.t.required]),password:new u.c("",[u.t.required])}),this.errors={email:"",confirm:"",password:""},this.subscriptions={}}submit(){return Object(b.a)(this,void 0,void 0,(function*(){this.loading=!0,this.form.disable();const r=yield this.service.register({email:this.form.value.email,password:this.form.value.password});this.form.enable(),this.loading=!1,r.ok?this.router.navigate(["/verify"],{replaceUrl:!0}):this.toast.error(r.error.message)}))}ngOnInit(){this.subscriptions.form=this.form.valueChanges.subscribe(r=>{this.errors=this.formerror.validateForm(this.form,this.errors,!0)})}ngOnDestroy(){this.subscriptions.form.unsubscribe()}}return r.\u0275fac=function(t){return new(t||r)(l.Qb(p.a),l.Qb(f.c),l.Qb(d.a),l.Qb(g.a))},r.\u0275cmp=l.Kb({type:r,selectors:[["app-signup"]],decls:32,vars:6,consts:[[3,"formGroup","ngSubmit"],["src","./assets/icons/icon-512x512.png","alt","Auth Icon"],["appearance","outline"],["text-uppercase",""],["matInput","","type","email","name","email","placeholder","email","formControlName","email","required",""],[4,"ngIf"],["matInput","","type","password","name","password","placeholder","password","formControlName","password","required",""],["matInput","","type","password","name","confirm","placeholder","confirm password","formControlName","confirm","required",""],["type","submit","mat-flat-button","","color","primary"],["class","mat-spinner-negative","mode","indeterminate","diameter","30",4,"ngIf"],["routerLink","/terms-and-conditions"],["routerLink","/privacy-policy"],["type","button","mat-stroked-button","","color","primary","routerLink","/verfiy"],["type","button","mat-stroked-button","","color","primary","routerLink","/signin"],["mode","indeterminate","diameter","30",1,"mat-spinner-negative"]],template:function(r,t){1&r&&(l.Wb(0,"form",0),l.ec("ngSubmit",(function(){return!t.form.invalid&&!t.loading&&t.form.value.password==t.form.value.confirm&&t.submit()})),l.Rb(1,"img",1),l.Wb(2,"mat-form-field",2),l.Wb(3,"mat-label",3),l.Gc(4," Email "),l.Vb(),l.Rb(5,"input",4),l.Ec(6,w,2,1,"mat-error",5),l.Vb(),l.Wb(7,"mat-form-field",2),l.Wb(8,"mat-label",3),l.Gc(9," Password "),l.Vb(),l.Rb(10,"input",6),l.Ec(11,y,2,1,"mat-error",5),l.Vb(),l.Wb(12,"mat-form-field",2),l.Wb(13,"mat-label",3),l.Gc(14," Confirm Password "),l.Vb(),l.Rb(15,"input",7),l.Ec(16,v,2,3,"mat-error",5),l.Vb(),l.Wb(17,"button",8),l.Gc(18),l.Ec(19,C,1,0,"mat-progress-spinner",9),l.Vb(),l.Wb(20,"p"),l.Gc(21," By clicking \u201cSIGN UP\u201d, you agree to our "),l.Wb(22,"a",10),l.Gc(23,"Terms & Conditions"),l.Vb(),l.Gc(24," and "),l.Wb(25,"a",11),l.Gc(26,"Privacy Policy"),l.Vb(),l.Gc(27,". We\u2019ll occasionally send you account related emails. "),l.Vb(),l.Wb(28,"button",12),l.Gc(29," verfiy account "),l.Vb(),l.Wb(30,"button",13),l.Gc(31," back to sign in "),l.Vb(),l.Vb()),2&r&&(l.qc("formGroup",t.form),l.Cb(6),l.qc("ngIf",t.errors.email),l.Cb(5),l.qc("ngIf",t.errors.password),l.Cb(5),l.qc("ngIf",t.errors.confirm||t.form.value.password!=t.form.value.confirm),l.Cb(2),l.Ic(" ",t.loading?"":"sign up"," "),l.Cb(1),l.qc("ngIf",t.loading))},directives:[u.u,u.n,u.g,m.c,m.g,i.a,u.b,u.m,u.e,u.s,e.l,a.a,f.e,f.d,m.b,h.a],styles:["img[_ngcontent-%COMP%]{width:100px;display:block;margin:25px auto}form[_ngcontent-%COMP%]{width:400px;margin:auto}form[_ngcontent-%COMP%]   [mat-stroked-button][_ngcontent-%COMP%]{margin-top:20px}p[_ngcontent-%COMP%]{font-size:12px;margin-top:15px;text-align:justify;line-height:15px}p[_ngcontent-%COMP%]   a[_ngcontent-%COMP%]{color:#2196f3}@media screen and (max-width:420px){form[_ngcontent-%COMP%]{width:calc(100% - 20px)}}"]}),r})()}];let W=(()=>{class r{}return r.\u0275mod=l.Ob({type:r}),r.\u0275inj=l.Nb({factory:function(t){return new(t||r)},imports:[[f.f.forChild(G)],f.f]}),r})(),V=(()=>{class r{}return r.\u0275mod=l.Ob({type:r}),r.\u0275inj=l.Nb({factory:function(t){return new(t||r)},imports:[[u.i,e.c,n.b,i.b,a.b,s.b,c.b,m.e,u.r,W,h.b]]}),r})()}}]);