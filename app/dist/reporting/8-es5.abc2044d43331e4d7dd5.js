function _defineProperties(e,t){for(var o=0;o<t.length;o++){var i=t[o];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(e,i.key,i)}}function _createClass(e,t,o){return t&&_defineProperties(e.prototype,t),o&&_defineProperties(e,o),e}function _inherits(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&_setPrototypeOf(e,t)}function _setPrototypeOf(e,t){return(_setPrototypeOf=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}function _createSuper(e){var t=_isNativeReflectConstruct();return function(){var o,i=_getPrototypeOf(e);if(t){var r=_getPrototypeOf(this).constructor;o=Reflect.construct(i,arguments,r)}else o=i.apply(this,arguments);return _possibleConstructorReturn(this,o)}}function _possibleConstructorReturn(e,t){return!t||"object"!=typeof t&&"function"!=typeof t?_assertThisInitialized(e):t}function _assertThisInitialized(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}function _isNativeReflectConstruct(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(e){return!1}}function _getPrototypeOf(e){return(_getPrototypeOf=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}function _classCallCheck(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(window.webpackJsonp=window.webpackJsonp||[]).push([[8],{"/t3+":function(e,t,o){"use strict";o.d(t,"a",(function(){return h})),o.d(t,"b",(function(){return p}));var i=o("fXoL"),r=o("FKr1"),n=o("ofXK"),a=o("nLfN"),s=["*",[["mat-toolbar-row"]]],c=["*","mat-toolbar-row"],l=Object(r.s)((function e(t){_classCallCheck(this,e),this._elementRef=t})),u=function(){var e=function e(){_classCallCheck(this,e)};return e.\u0275fac=function(t){return new(t||e)},e.\u0275dir=i.Kb({type:e,selectors:[["mat-toolbar-row"]],hostAttrs:[1,"mat-toolbar-row"],exportAs:["matToolbarRow"]}),e}(),h=function(){var e=function(e){_inherits(o,e);var t=_createSuper(o);function o(e,i,r){var n;return _classCallCheck(this,o),(n=t.call(this,e))._platform=i,n._document=r,n}return _createClass(o,[{key:"ngAfterViewInit",value:function(){var e=this;Object(i.W)()&&this._platform.isBrowser&&(this._checkToolbarMixedModes(),this._toolbarRows.changes.subscribe((function(){return e._checkToolbarMixedModes()})))}},{key:"_checkToolbarMixedModes",value:function(){var e=this;this._toolbarRows.length&&Array.from(this._elementRef.nativeElement.childNodes).filter((function(e){return!(e.classList&&e.classList.contains("mat-toolbar-row"))})).filter((function(t){return t.nodeType!==(e._document?e._document.COMMENT_NODE:8)})).some((function(e){return!(!e.textContent||!e.textContent.trim())}))&&function(){throw Error("MatToolbar: Attempting to combine different toolbar modes. Either specify multiple `<mat-toolbar-row>` elements explicitly or just place content inside of a `<mat-toolbar>` for a single row.")}()}}]),o}(l);return e.\u0275fac=function(t){return new(t||e)(i.Pb(i.l),i.Pb(a.a),i.Pb(n.d))},e.\u0275cmp=i.Jb({type:e,selectors:[["mat-toolbar"]],contentQueries:function(e,t,o){var r;1&e&&i.Ib(o,u,!0),2&e&&i.pc(r=i.ec())&&(t._toolbarRows=r)},hostAttrs:[1,"mat-toolbar"],hostVars:4,hostBindings:function(e,t){2&e&&i.Gb("mat-toolbar-multiple-rows",t._toolbarRows.length>0)("mat-toolbar-single-row",0===t._toolbarRows.length)},inputs:{color:"color"},exportAs:["matToolbar"],features:[i.zb],ngContentSelectors:c,decls:2,vars:0,template:function(e,t){1&e&&(i.nc(s),i.mc(0),i.mc(1,1))},styles:[".cdk-high-contrast-active .mat-toolbar{outline:solid 1px}.mat-toolbar-row,.mat-toolbar-single-row{display:flex;box-sizing:border-box;padding:0 16px;width:100%;flex-direction:row;align-items:center;white-space:nowrap}.mat-toolbar-multiple-rows{display:flex;box-sizing:border-box;flex-direction:column;width:100%}.mat-toolbar-multiple-rows{min-height:64px}.mat-toolbar-row,.mat-toolbar-single-row{height:64px}@media(max-width: 599px){.mat-toolbar-multiple-rows{min-height:56px}.mat-toolbar-row,.mat-toolbar-single-row{height:56px}}\n"],encapsulation:2,changeDetection:0}),e}(),p=function(){var e=function e(){_classCallCheck(this,e)};return e.\u0275mod=i.Nb({type:e}),e.\u0275inj=i.Mb({factory:function(t){return new(t||e)},imports:[[r.f],r.f]}),e}()},cjqQ:function(e,t,o){"use strict";o.r(t),o.d(t,"PrivacyPolicyModule",(function(){return y}));var i,r,n,a=o("ofXK"),s=o("NFeN"),c=o("bTqV"),l=o("/t3+"),u=o("fXoL"),h=o("5mtf"),p=((i=function e(t){_classCallCheck(this,e),this.history=t}).\u0275fac=function(e){return new(e||i)(u.Pb(h.a))},i.\u0275cmp=u.Jb({type:i,selectors:[["app-privacy-policy"]],decls:76,vars:0,consts:[["color","primary"],["mat-icon-button","",1,"menu-toggle",3,"click"],[1,"page-label","spacer"],[1,"page-body"],[1,"container","page"],["href","https://www.google.com/policies/privacy/","target","_blank","rel","noopener noreferrer"]],template:function(e,t){1&e&&(u.Vb(0,"mat-toolbar",0),u.Vb(1,"button",1),u.dc("click",(function(){return t.history.back()})),u.Vb(2,"mat-icon"),u.Ac(3," arrow_back "),u.Ub(),u.Ub(),u.Vb(4,"div",2),u.Ac(5," privacy policy "),u.Ub(),u.Ub(),u.Vb(6,"div",3),u.Vb(7,"div",4),u.Vb(8,"p"),u.Ac(9," biTid built the TIKIT app as a Freemium app. This SERVICE is provided by biTid at no cost and is intended for use as is. "),u.Ub(),u.Vb(10,"p"),u.Ac(11," This page is used to inform visitors regarding our policies with the collection, use, and disclosure of Personal Information if anyone decided to use our Service. "),u.Ub(),u.Vb(12,"p"),u.Ac(13," If you choose to use our Service, then you agree to the collection and use of information in relation to this policy. The Personal Information that we collect is used for providing and improving the Service. We will not use or share your information with anyone except as described in this Privacy Policy. "),u.Ub(),u.Vb(14,"p"),u.Ac(15," The terms used in this Privacy Policy have the same meanings as in our Terms and Conditions, which is accessible at TIKIT unless otherwise defined in this Privacy Policy. "),u.Ub(),u.Vb(16,"h3"),u.Ac(17," Information Collection and Use "),u.Ub(),u.Vb(18,"p"),u.Ac(19," For a better experience, while using our Service, we may require you to provide us with certain personally identifiable information, including but not limited to email, last name, first name, mobile number. The information that we request will be retained by us and used as described in this privacy policy. "),u.Ub(),u.Vb(20,"div"),u.Vb(21,"p"),u.Ac(22," The app does use third party services that may collect information used to identify you. "),u.Ub(),u.Vb(23,"p"),u.Ac(24," Link to privacy policy of third party service providers used by the app "),u.Ub(),u.Vb(25,"ul"),u.Vb(26,"li"),u.Vb(27,"a",5),u.Ac(28," Google Play Services "),u.Ub(),u.Ub(),u.Ub(),u.Ub(),u.Vb(29,"h3"),u.Ac(30," Log Data "),u.Ub(),u.Vb(31,"p"),u.Ac(32," We want to inform you that whenever you use our Service, in a case of an error in the app we collect data and information (through third party products) on your phone called Log Data. This Log Data may include information such as your device Internet Protocol (\u201cIP\u201d) address, device name, operating system version, the configuration of the app when utilizing our Service, the time and date of your use of the Service, and other statistics. "),u.Ub(),u.Vb(33,"h3"),u.Ac(34," Cookies "),u.Ub(),u.Vb(35,"p"),u.Ac(36," Cookies are files with a small amount of data that are commonly used as anonymous unique identifiers. These are sent to your browser from the websites that you visit and are stored on your device's internal memory. "),u.Ub(),u.Vb(37,"p"),u.Ac(38," This Service does not use these \u201ccookies\u201d explicitly. However, the app may use third party code and libraries that use \u201ccookies\u201d to collect information and improve their services. You have the option to either accept or refuse these cookies and know when a cookie is being sent to your device. If you choose to refuse our cookies, you may not be able to use some portions of this Service. "),u.Ub(),u.Vb(39,"h3"),u.Ac(40," Service Providers "),u.Ub(),u.Vb(41,"p"),u.Ac(42," We may employ third-party companies and individuals due to the following reasons: "),u.Ub(),u.Vb(43,"ul"),u.Vb(44,"li"),u.Ac(45," To facilitate our Service; "),u.Ub(),u.Vb(46,"li"),u.Ac(47," To provide the Service on our behalf; "),u.Ub(),u.Vb(48,"li"),u.Ac(49," To perform Service-related services; or "),u.Ub(),u.Vb(50,"li"),u.Ac(51," To assist us in analyzing how our Service is used. "),u.Ub(),u.Ub(),u.Vb(52,"p"),u.Ac(53," We want to inform users of this Service that these third parties have access to your Personal Information. The reason is to perform the tasks assigned to them on our behalf. However, they are obligated not to disclose or use the information for any other purpose. "),u.Ub(),u.Vb(54,"h3"),u.Ac(55," Security "),u.Ub(),u.Vb(56,"p"),u.Ac(57," We value your trust in providing us your Personal Information, thus we are striving to use commercially acceptable means of protecting it. But remember that no method of transmission over the internet, or method of electronic storage is 100% secure and reliable, and we cannot guarantee its absolute security. "),u.Ub(),u.Vb(58,"h3"),u.Ac(59," Links to Other Sites "),u.Ub(),u.Vb(60,"p"),u.Ac(61," This Service may contain links to other sites. If you click on a third-party link, you will be directed to that site. Note that these external sites are not operated by us. Therefore, we strongly advise you to review the Privacy Policy of these websites. We have no control over and assume no responsibility for the content, privacy policies, or practices of any third-party sites or services. "),u.Ub(),u.Vb(62,"h3"),u.Ac(63," Children\u2019s Privacy "),u.Ub(),u.Vb(64,"p"),u.Ac(65," These Services do not address anyone under the age of 13. We do not knowingly collect personally identifiable information from children under 13. In the case we discover that a child under 13 has provided us with personal information, we immediately delete this from our servers. If you are a parent or guardian and you are aware that your child has provided us with personal information, please contact us so that we will be able to do necessary actions. "),u.Ub(),u.Vb(66,"h3"),u.Ac(67," Changes to This Privacy Policy "),u.Ub(),u.Vb(68,"p"),u.Ac(69," We may update our Privacy Policy from time to time. Thus, you are advised to review this page periodically for any changes. We will notify you of any changes by posting the new Privacy Policy on this page. "),u.Ub(),u.Vb(70,"p"),u.Ac(71," This policy is effective as of 2020-01-01 "),u.Ub(),u.Vb(72,"h3"),u.Ac(73," Contact Us "),u.Ub(),u.Vb(74,"p"),u.Ac(75," If you have any questions or suggestions about our Privacy Policy, do not hesitate to contact us at support@bitid.co.za. "),u.Ub(),u.Ub(),u.Ub())},directives:[l.a,c.a,s.a],styles:[".page[_ngcontent-%COMP%]{margin:15px auto;display:flex;flex-direction:column;background-color:#fff}.page[_ngcontent-%COMP%]   p[_ngcontent-%COMP%]{margin:5px 10px;font-size:12px;line-height:12px}.page[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%]{margin:5px 10px;font-size:14px;line-height:14px;font-weight:500;text-transform:uppercase}.page[_ngcontent-%COMP%]   ul[_ngcontent-%COMP%]{font-size:12px;line-height:12px;list-style-type:none!important}"]}),i),b=o("tyNb"),f=[{path:"",component:p}],d=((n=function e(){_classCallCheck(this,e)}).\u0275mod=u.Nb({type:n}),n.\u0275inj=u.Mb({factory:function(e){return new(e||n)},imports:[[b.f.forChild(f)],b.f]}),n),y=((r=function e(){_classCallCheck(this,e)}).\u0275mod=u.Nb({type:r}),r.\u0275inj=u.Mb({factory:function(e){return new(e||r)},imports:[[a.c,s.b,c.b,l.b,d]]}),r)}}]);