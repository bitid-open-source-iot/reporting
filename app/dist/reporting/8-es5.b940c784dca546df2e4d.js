function _defineProperties(t,e){for(var o=0;o<e.length;o++){var r=e[o];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}function _createClass(t,e,o){return e&&_defineProperties(t.prototype,e),o&&_defineProperties(t,o),t}function _inherits(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function");t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,writable:!0,configurable:!0}}),e&&_setPrototypeOf(t,e)}function _setPrototypeOf(t,e){return(_setPrototypeOf=Object.setPrototypeOf||function(t,e){return t.__proto__=e,t})(t,e)}function _createSuper(t){var e=_isNativeReflectConstruct();return function(){var o,r=_getPrototypeOf(t);if(e){var n=_getPrototypeOf(this).constructor;o=Reflect.construct(r,arguments,n)}else o=r.apply(this,arguments);return _possibleConstructorReturn(this,o)}}function _possibleConstructorReturn(t,e){return!e||"object"!=typeof e&&"function"!=typeof e?_assertThisInitialized(t):e}function _assertThisInitialized(t){if(void 0===t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return t}function _isNativeReflectConstruct(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(t){return!1}}function _getPrototypeOf(t){return(_getPrototypeOf=Object.setPrototypeOf?Object.getPrototypeOf:function(t){return t.__proto__||Object.getPrototypeOf(t)})(t)}function _classCallCheck(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(window.webpackJsonp=window.webpackJsonp||[]).push([[8],{"/t3+":function(t,e,o){"use strict";o.d(e,"a",(function(){return p})),o.d(e,"b",(function(){return h}));var r=o("fXoL"),n=o("FKr1"),i=o("ofXK"),a=o("nLfN"),s=["*",[["mat-toolbar-row"]]],c=["*","mat-toolbar-row"],l=Object(n.s)((function t(e){_classCallCheck(this,t),this._elementRef=e})),u=function(){var t=function t(){_classCallCheck(this,t)};return t.\u0275fac=function(e){return new(e||t)},t.\u0275dir=r.Lb({type:t,selectors:[["mat-toolbar-row"]],hostAttrs:[1,"mat-toolbar-row"],exportAs:["matToolbarRow"]}),t}(),p=function(){var t=function(t){_inherits(o,t);var e=_createSuper(o);function o(t,r,n){var i;return _classCallCheck(this,o),(i=e.call(this,t))._platform=r,i._document=n,i}return _createClass(o,[{key:"ngAfterViewInit",value:function(){var t=this;Object(r.W)()&&this._platform.isBrowser&&(this._checkToolbarMixedModes(),this._toolbarRows.changes.subscribe((function(){return t._checkToolbarMixedModes()})))}},{key:"_checkToolbarMixedModes",value:function(){var t=this;this._toolbarRows.length&&Array.from(this._elementRef.nativeElement.childNodes).filter((function(t){return!(t.classList&&t.classList.contains("mat-toolbar-row"))})).filter((function(e){return e.nodeType!==(t._document?t._document.COMMENT_NODE:8)})).some((function(t){return!(!t.textContent||!t.textContent.trim())}))&&function(){throw Error("MatToolbar: Attempting to combine different toolbar modes. Either specify multiple `<mat-toolbar-row>` elements explicitly or just place content inside of a `<mat-toolbar>` for a single row.")}()}}]),o}(l);return t.\u0275fac=function(e){return new(e||t)(r.Qb(r.l),r.Qb(a.a),r.Qb(i.d))},t.\u0275cmp=r.Kb({type:t,selectors:[["mat-toolbar"]],contentQueries:function(t,e,o){var n;1&t&&r.Ib(o,u,!0),2&t&&r.sc(n=r.fc())&&(e._toolbarRows=n)},hostAttrs:[1,"mat-toolbar"],hostVars:4,hostBindings:function(t,e){2&t&&r.Gb("mat-toolbar-multiple-rows",e._toolbarRows.length>0)("mat-toolbar-single-row",0===e._toolbarRows.length)},inputs:{color:"color"},exportAs:["matToolbar"],features:[r.zb],ngContentSelectors:c,decls:2,vars:0,template:function(t,e){1&t&&(r.oc(s),r.nc(0),r.nc(1,1))},styles:[".cdk-high-contrast-active .mat-toolbar{outline:solid 1px}.mat-toolbar-row,.mat-toolbar-single-row{display:flex;box-sizing:border-box;padding:0 16px;width:100%;flex-direction:row;align-items:center;white-space:nowrap}.mat-toolbar-multiple-rows{display:flex;box-sizing:border-box;flex-direction:column;width:100%}.mat-toolbar-multiple-rows{min-height:64px}.mat-toolbar-row,.mat-toolbar-single-row{height:64px}@media(max-width: 599px){.mat-toolbar-multiple-rows{min-height:56px}.mat-toolbar-row,.mat-toolbar-single-row{height:56px}}\n"],encapsulation:2,changeDetection:0}),t}(),h=function(){var t=function t(){_classCallCheck(this,t)};return t.\u0275mod=r.Ob({type:t}),t.\u0275inj=r.Nb({factory:function(e){return new(e||t)},imports:[[n.f],n.f]}),t}()},cCjq:function(t,e,o){"use strict";o.r(e),o.d(e,"TermsAndConditionsModule",(function(){return y}));var r,n,i,a=o("ofXK"),s=o("NFeN"),c=o("bTqV"),l=o("/t3+"),u=o("fXoL"),p=o("5mtf"),h=((r=function t(e){_classCallCheck(this,t),this.history=e}).\u0275fac=function(t){return new(t||r)(u.Qb(p.a))},r.\u0275cmp=u.Kb({type:r,selectors:[["app-terms-and-conditions-page"]],decls:42,vars:0,consts:[["color","primary"],["mat-icon-button","",1,"menu-toggle",3,"click"],[1,"page-label","spacer"],[1,"page-body"],[1,"container","page"],["href","https://policies.google.com/terms","target","_blank","rel","noopener noreferrer"]],template:function(t,e){1&t&&(u.Wb(0,"mat-toolbar",0),u.Wb(1,"button",1),u.ec("click",(function(){return e.history.back()})),u.Wb(2,"mat-icon"),u.Dc(3," arrow_back "),u.Vb(),u.Vb(),u.Wb(4,"div",2),u.Dc(5," terms and conditions "),u.Vb(),u.Vb(),u.Wb(6,"div",3),u.Wb(7,"div",4),u.Wb(8,"p"),u.Dc(9," By downloading or using the app, these terms will automatically apply to you \u2013 you should make sure therefore that you read them carefully before using the app. You\u2019re not allowed to copy, or modify the app, any part of the app, or our trademarks in any way. You\u2019re not allowed to attempt to extract the source code of the app, and you also shouldn\u2019t try to translate the app into other languages, or make derivative versions. The app itself, and all the trade marks, copyright, database rights and other intellectual property rights related to it, still belong to biTid. "),u.Vb(),u.Wb(10,"p"),u.Dc(11," biTid is committed to ensuring that the app is as useful and efficient as possible. For that reason, we reserve the right to make changes to the app or to charge for its services, at any time and for any reason. We will never charge you for the app or its services without making it very clear to you exactly what you\u2019re paying for. "),u.Vb(),u.Wb(12,"p"),u.Dc(13," The TIKIT app stores and processes personal data that you have provided to us, in order to provide our Service. It\u2019s your responsibility to keep your phone and access to the app secure. We therefore recommend that you do not jailbreak or root your phone, which is the process of removing software restrictions and limitations imposed by the official operating system of your device. It could make your phone vulnerable to malware/viruses/malicious programs, compromise your phone\u2019s security features and it could mean that the TIKIT app won\u2019t work properly or at all. "),u.Vb(),u.Wb(14,"p"),u.Dc(15," The app does use third party services that declare their own Terms and Conditions. "),u.Vb(),u.Wb(16,"p"),u.Dc(17," Link to Terms and Conditions of third party service providers used by the app "),u.Vb(),u.Wb(18,"ul"),u.Wb(19,"li"),u.Wb(20,"a",5),u.Dc(21," Google Play Services "),u.Vb(),u.Vb(),u.Vb(),u.Wb(22,"p"),u.Dc(23," You should be aware that there are certain things that biTid will not take responsibility for. Certain functions of the app will require the app to have an active internet connection. The connection can be Wi-Fi, or provided by your mobile network provider, but biTid cannot take responsibility for the app not working at full functionality if you don\u2019t have access to Wi-Fi, and you don\u2019t have any of your data allowance left. "),u.Vb(),u.Wb(24,"p"),u.Dc(25," If you\u2019re using the app outside of an area with Wi-Fi, you should remember that your terms of the agreement with your mobile network provider will still apply. As a result, you may be charged by your mobile provider for the cost of data for the duration of the connection while accessing the app, or other third party charges. In using the app, you\u2019re accepting responsibility for any such charges, including roaming data charges if you use the app outside of your home territory (i.e. region or country) without turning off data roaming. If you are not the bill payer for the device on which you\u2019re using the app, please be aware that we assume that you have received permission from the bill payer for using the app. "),u.Vb(),u.Wb(26,"p"),u.Dc(27," Along the same lines, biTid cannot always take responsibility for the way you use the app i.e. You need to make sure that your device stays charged \u2013 if it runs out of battery and you can\u2019t turn it on to avail the Service, biTid cannot accept responsibility. "),u.Vb(),u.Wb(28,"p"),u.Dc(29," With respect to biTid\u2019s responsibility for your use of the app, when you\u2019re using the app, it\u2019s important to bear in mind that although we endeavour to ensure that it is updated and correct at all times, we do rely on third parties to provide information to us so that we can make it available to you. biTid accepts no liability for any loss, direct or indirect, you experience as a result of relying wholly on this functionality of the app. "),u.Vb(),u.Wb(30,"p"),u.Dc(31," At some point, we may wish to update the app. The app is currently available on Android & iOS \u2013 the requirements for both systems(and for any additional systems we decide to extend the availability of the app to) may change, and you\u2019ll need to download the updates if you want to keep using the app. biTid does not promise that it will always update the app so that it is relevant to you and/or works with the Android & iOS version that you have installed on your device. However, you promise to always accept updates to the application when offered to you, We may also wish to stop providing the app, and may terminate use of it at any time without giving notice of termination to you. Unless we tell you otherwise, upon any termination, (a) the rights and licenses granted to you in these terms will end; (b) you must stop using the app, and (if needed) delete it from your device. "),u.Vb(),u.Wb(32,"h3"),u.Dc(33," Changes to This Terms and Conditions "),u.Vb(),u.Wb(34,"p"),u.Dc(35," We may update our Terms and Conditions from time to time. Thus, you are advised to review this page periodically for any changes. We will notify you of any changes by posting the new Terms and Conditions on this page. "),u.Vb(),u.Wb(36,"p"),u.Dc(37," These terms and conditions are effective as of 2020-01-01 "),u.Vb(),u.Wb(38,"h3"),u.Dc(39," Contact Us "),u.Vb(),u.Wb(40,"p"),u.Dc(41," If you have any questions or suggestions about our Terms and Conditions, do not hesitate to contact us at support@bitid.co.za. "),u.Vb(),u.Vb(),u.Vb())},directives:[l.a,c.a,s.a],styles:[".page[_ngcontent-%COMP%]{margin:15px auto;display:flex;flex-direction:column;background-color:#fff}.page[_ngcontent-%COMP%]   p[_ngcontent-%COMP%]{margin:5px 10px;font-size:12px;line-height:12px}.page[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%]{margin:5px 10px;font-size:14px;line-height:14px;font-weight:500;text-transform:uppercase}.page[_ngcontent-%COMP%]   ul[_ngcontent-%COMP%]{font-size:12px;line-height:12px;list-style-type:none!important}"]}),r),f=o("tyNb"),d=[{path:"",component:h}],b=((i=function t(){_classCallCheck(this,t)}).\u0275mod=u.Ob({type:i}),i.\u0275inj=u.Nb({factory:function(t){return new(t||i)},imports:[[f.f.forChild(d)],f.f]}),i),y=((n=function t(){_classCallCheck(this,t)}).\u0275mod=u.Ob({type:n}),n.\u0275inj=u.Nb({factory:function(t){return new(t||n)},imports:[[a.c,s.b,c.b,l.b,b]]}),n)}}]);