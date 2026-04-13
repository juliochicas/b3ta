import{r as c,a as Vt,v as qt,R as je}from"./vendor-react-CpgH_0iB.js";import{j as b}from"./vendor-motion-Cj23VSOt.js";function A(e,t,{checkForDefaultPrevented:n=!0}={}){return function(a){if(e?.(a),n===!1||!a.defaultPrevented)return t?.(a)}}function xe(e,t){if(typeof e=="function")return e(t);e!=null&&(e.current=t)}function Ie(...e){return t=>{let n=!1;const r=e.map(a=>{const o=xe(a,t);return!n&&typeof o=="function"&&(n=!0),o});if(n)return()=>{for(let a=0;a<r.length;a++){const o=r[a];typeof o=="function"?o():xe(e[a],null)}}}}function N(...e){return c.useCallback(Ie(...e),e)}function Wt(e,t){const n=c.createContext(t),r=o=>{const{children:s,...i}=o,y=c.useMemo(()=>i,Object.values(i));return b.jsx(n.Provider,{value:y,children:s})};r.displayName=e+"Provider";function a(o){const s=c.useContext(n);if(s)return s;if(t!==void 0)return t;throw new Error(`\`${o}\` must be used within \`${e}\``)}return[r,a]}function Bt(e,t=[]){let n=[];function r(o,s){const i=c.createContext(s),y=n.length;n=[...n,s];const l=h=>{const{scope:m,children:p,...k}=h,d=m?.[e]?.[y]||i,v=c.useMemo(()=>k,Object.values(k));return b.jsx(d.Provider,{value:v,children:p})};l.displayName=o+"Provider";function f(h,m){const p=m?.[e]?.[y]||i,k=c.useContext(p);if(k)return k;if(s!==void 0)return s;throw new Error(`\`${h}\` must be used within \`${o}\``)}return[l,f]}const a=()=>{const o=n.map(s=>c.createContext(s));return function(i){const y=i?.[e]||o;return c.useMemo(()=>({[`__scope${e}`]:{...i,[e]:y}}),[i,y])}};return a.scopeName=e,[r,Ut(a,...t)]}function Ut(...e){const t=e[0];if(e.length===1)return t;const n=()=>{const r=e.map(a=>({useScope:a(),scopeName:a.scopeName}));return function(o){const s=r.reduce((i,{useScope:y,scopeName:l})=>{const h=y(o)[`__scope${l}`];return{...i,...h}},{});return c.useMemo(()=>({[`__scope${t.scopeName}`]:s}),[s])}};return n.scopeName=t.scopeName,n}function ve(e){const t=$t(e),n=c.forwardRef((r,a)=>{const{children:o,...s}=r,i=c.Children.toArray(o),y=i.find(Kt);if(y){const l=y.props.children,f=i.map(h=>h===y?c.Children.count(l)>1?c.Children.only(null):c.isValidElement(l)?l.props.children:null:h);return b.jsx(t,{...s,ref:a,children:c.isValidElement(l)?c.cloneElement(l,void 0,f):null})}return b.jsx(t,{...s,ref:a,children:o})});return n.displayName=`${e}.Slot`,n}var Sr=ve("Slot");function $t(e){const t=c.forwardRef((n,r)=>{const{children:a,...o}=n;if(c.isValidElement(a)){const s=Gt(a),i=Zt(o,a.props);return a.type!==c.Fragment&&(i.ref=r?Ie(r,s):s),c.cloneElement(a,i)}return c.Children.count(a)>1?c.Children.only(null):null});return t.displayName=`${e}.SlotClone`,t}var Fe=Symbol("radix.slottable");function Pr(e){const t=({children:n})=>b.jsx(b.Fragment,{children:n});return t.displayName=`${e}.Slottable`,t.__radixId=Fe,t}function Kt(e){return c.isValidElement(e)&&typeof e.type=="function"&&"__radixId"in e.type&&e.type.__radixId===Fe}function Zt(e,t){const n={...t};for(const r in t){const a=e[r],o=t[r];/^on[A-Z]/.test(r)?a&&o?n[r]=(...i)=>{const y=o(...i);return a(...i),y}:a&&(n[r]=a):r==="style"?n[r]={...a,...o}:r==="className"&&(n[r]=[a,o].filter(Boolean).join(" "))}return{...e,...n}}function Gt(e){let t=Object.getOwnPropertyDescriptor(e.props,"ref")?.get,n=t&&"isReactWarning"in t&&t.isReactWarning;return n?e.ref:(t=Object.getOwnPropertyDescriptor(e,"ref")?.get,n=t&&"isReactWarning"in t&&t.isReactWarning,n?e.props.ref:e.props.ref||e.ref)}var Xt=["a","button","div","form","h2","h3","img","input","label","li","nav","ol","p","select","span","svg","ul"],_=Xt.reduce((e,t)=>{const n=ve(`Primitive.${t}`),r=c.forwardRef((a,o)=>{const{asChild:s,...i}=a,y=s?n:t;return typeof window<"u"&&(window[Symbol.for("radix-ui")]=!0),b.jsx(y,{...i,ref:o})});return r.displayName=`Primitive.${t}`,{...e,[t]:r}},{});function Yt(e,t){e&&Vt.flushSync(()=>e.dispatchEvent(t))}function V(e){const t=c.useRef(e);return c.useEffect(()=>{t.current=e}),c.useMemo(()=>(...n)=>t.current?.(...n),[])}function Qt(e,t=globalThis?.document){const n=V(e);c.useEffect(()=>{const r=a=>{a.key==="Escape"&&n(a)};return t.addEventListener("keydown",r,{capture:!0}),()=>t.removeEventListener("keydown",r,{capture:!0})},[n,t])}var Jt="DismissableLayer",fe="dismissableLayer.update",en="dismissableLayer.pointerDownOutside",tn="dismissableLayer.focusOutside",Me,ze=c.createContext({layers:new Set,layersWithOutsidePointerEventsDisabled:new Set,branches:new Set}),me=c.forwardRef((e,t)=>{const{disableOutsidePointerEvents:n=!1,onEscapeKeyDown:r,onPointerDownOutside:a,onFocusOutside:o,onInteractOutside:s,onDismiss:i,...y}=e,l=c.useContext(ze),[f,h]=c.useState(null),m=f?.ownerDocument??globalThis?.document,[,p]=c.useState({}),k=N(t,w=>h(w)),d=Array.from(l.layers),[v]=[...l.layersWithOutsidePointerEventsDisabled].slice(-1),g=d.indexOf(v),E=f?d.indexOf(f):-1,x=l.layersWithOutsidePointerEventsDisabled.size>0,M=E>=g,C=rn(w=>{const R=w.target,H=[...l.branches].some(re=>re.contains(R));!M||H||(a?.(w),s?.(w),w.defaultPrevented||i?.())},m),O=an(w=>{const R=w.target;[...l.branches].some(re=>re.contains(R))||(o?.(w),s?.(w),w.defaultPrevented||i?.())},m);return Qt(w=>{E===l.layers.size-1&&(r?.(w),!w.defaultPrevented&&i&&(w.preventDefault(),i()))},m),c.useEffect(()=>{if(f)return n&&(l.layersWithOutsidePointerEventsDisabled.size===0&&(Me=m.body.style.pointerEvents,m.body.style.pointerEvents="none"),l.layersWithOutsidePointerEventsDisabled.add(f)),l.layers.add(f),Ce(),()=>{n&&l.layersWithOutsidePointerEventsDisabled.size===1&&(m.body.style.pointerEvents=Me)}},[f,m,n,l]),c.useEffect(()=>()=>{f&&(l.layers.delete(f),l.layersWithOutsidePointerEventsDisabled.delete(f),Ce())},[f,l]),c.useEffect(()=>{const w=()=>p({});return document.addEventListener(fe,w),()=>document.removeEventListener(fe,w)},[]),b.jsx(_.div,{...y,ref:k,style:{pointerEvents:x?M?"auto":"none":void 0,...e.style},onFocusCapture:A(e.onFocusCapture,O.onFocusCapture),onBlurCapture:A(e.onBlurCapture,O.onBlurCapture),onPointerDownCapture:A(e.onPointerDownCapture,C.onPointerDownCapture)})});me.displayName=Jt;var nn="DismissableLayerBranch",He=c.forwardRef((e,t)=>{const n=c.useContext(ze),r=c.useRef(null),a=N(t,r);return c.useEffect(()=>{const o=r.current;if(o)return n.branches.add(o),()=>{n.branches.delete(o)}},[n.branches]),b.jsx(_.div,{...e,ref:a})});He.displayName=nn;function rn(e,t=globalThis?.document){const n=V(e),r=c.useRef(!1),a=c.useRef(()=>{});return c.useEffect(()=>{const o=i=>{if(i.target&&!r.current){let y=function(){Ve(en,n,l,{discrete:!0})};const l={originalEvent:i};i.pointerType==="touch"?(t.removeEventListener("click",a.current),a.current=y,t.addEventListener("click",a.current,{once:!0})):y()}else t.removeEventListener("click",a.current);r.current=!1},s=window.setTimeout(()=>{t.addEventListener("pointerdown",o)},0);return()=>{window.clearTimeout(s),t.removeEventListener("pointerdown",o),t.removeEventListener("click",a.current)}},[t,n]),{onPointerDownCapture:()=>r.current=!0}}function an(e,t=globalThis?.document){const n=V(e),r=c.useRef(!1);return c.useEffect(()=>{const a=o=>{o.target&&!r.current&&Ve(tn,n,{originalEvent:o},{discrete:!1})};return t.addEventListener("focusin",a),()=>t.removeEventListener("focusin",a)},[t,n]),{onFocusCapture:()=>r.current=!0,onBlurCapture:()=>r.current=!1}}function Ce(){const e=new CustomEvent(fe);document.dispatchEvent(e)}function Ve(e,t,n,{discrete:r}){const a=n.originalEvent.target,o=new CustomEvent(e,{bubbles:!1,cancelable:!0,detail:n});t&&a.addEventListener(e,t,{once:!0}),r?Yt(a,o):a.dispatchEvent(o)}var Or=me,Rr=He,q=globalThis?.document?c.useLayoutEffect:()=>{},on="Portal",qe=c.forwardRef((e,t)=>{const{container:n,...r}=e,[a,o]=c.useState(!1);q(()=>o(!0),[]);const s=n||a&&globalThis?.document?.body;return s?qt.createPortal(b.jsx(_.div,{...r,ref:t}),s):null});qe.displayName=on;function cn(e,t){return c.useReducer((n,r)=>t[n][r]??n,e)}var Q=e=>{const{present:t,children:n}=e,r=sn(t),a=typeof n=="function"?n({present:r.isPresent}):c.Children.only(n),o=N(r.ref,ln(a));return typeof n=="function"||r.isPresent?c.cloneElement(a,{ref:o}):null};Q.displayName="Presence";function sn(e){const[t,n]=c.useState(),r=c.useRef(null),a=c.useRef(e),o=c.useRef("none"),s=e?"mounted":"unmounted",[i,y]=cn(s,{mounted:{UNMOUNT:"unmounted",ANIMATION_OUT:"unmountSuspended"},unmountSuspended:{MOUNT:"mounted",ANIMATION_END:"unmounted"},unmounted:{MOUNT:"mounted"}});return c.useEffect(()=>{const l=W(r.current);o.current=i==="mounted"?l:"none"},[i]),q(()=>{const l=r.current,f=a.current;if(f!==e){const m=o.current,p=W(l);e?y("MOUNT"):p==="none"||l?.display==="none"?y("UNMOUNT"):y(f&&m!==p?"ANIMATION_OUT":"UNMOUNT"),a.current=e}},[e,y]),q(()=>{if(t){let l;const f=t.ownerDocument.defaultView??window,h=p=>{const d=W(r.current).includes(p.animationName);if(p.target===t&&d&&(y("ANIMATION_END"),!a.current)){const v=t.style.animationFillMode;t.style.animationFillMode="forwards",l=f.setTimeout(()=>{t.style.animationFillMode==="forwards"&&(t.style.animationFillMode=v)})}},m=p=>{p.target===t&&(o.current=W(r.current))};return t.addEventListener("animationstart",m),t.addEventListener("animationcancel",h),t.addEventListener("animationend",h),()=>{f.clearTimeout(l),t.removeEventListener("animationstart",m),t.removeEventListener("animationcancel",h),t.removeEventListener("animationend",h)}}else y("ANIMATION_END")},[t,y]),{isPresent:["mounted","unmountSuspended"].includes(i),ref:c.useCallback(l=>{r.current=l?getComputedStyle(l):null,n(l)},[])}}function W(e){return e?.animationName||"none"}function ln(e){let t=Object.getOwnPropertyDescriptor(e.props,"ref")?.get,n=t&&"isReactWarning"in t&&t.isReactWarning;return n?e.ref:(t=Object.getOwnPropertyDescriptor(e,"ref")?.get,n=t&&"isReactWarning"in t&&t.isReactWarning,n?e.props.ref:e.props.ref||e.ref)}var un=je[" useInsertionEffect ".trim().toString()]||q;function dn({prop:e,defaultProp:t,onChange:n=()=>{},caller:r}){const[a,o,s]=fn({defaultProp:t,onChange:n}),i=e!==void 0,y=i?e:a;{const f=c.useRef(e!==void 0);c.useEffect(()=>{const h=f.current;h!==i&&console.warn(`${r} is changing from ${h?"controlled":"uncontrolled"} to ${i?"controlled":"uncontrolled"}. Components should not switch from controlled to uncontrolled (or vice versa). Decide between using a controlled or uncontrolled value for the lifetime of the component.`),f.current=i},[i,r])}const l=c.useCallback(f=>{if(i){const h=yn(f)?f(e):f;h!==e&&s.current?.(h)}else o(f)},[i,e,o,s]);return[y,l]}function fn({defaultProp:e,onChange:t}){const[n,r]=c.useState(e),a=c.useRef(n),o=c.useRef(t);return un(()=>{o.current=t},[t]),c.useEffect(()=>{a.current!==n&&(o.current?.(n),a.current=n)},[n,a]),[n,r,o]}function yn(e){return typeof e=="function"}/**
 * @license lucide-react v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const hn=e=>e.replace(/([a-z0-9])([A-Z])/g,"$1-$2").toLowerCase(),We=(...e)=>e.filter((t,n,r)=>!!t&&t.trim()!==""&&r.indexOf(t)===n).join(" ").trim();/**
 * @license lucide-react v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */var pn={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:2,strokeLinecap:"round",strokeLinejoin:"round"};/**
 * @license lucide-react v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const vn=c.forwardRef(({color:e="currentColor",size:t=24,strokeWidth:n=2,absoluteStrokeWidth:r,className:a="",children:o,iconNode:s,...i},y)=>c.createElement("svg",{ref:y,...pn,width:t,height:t,stroke:e,strokeWidth:r?Number(n)*24/Number(t):n,className:We("lucide",a),...i},[...s.map(([l,f])=>c.createElement(l,f)),...Array.isArray(o)?o:[o]]));/**
 * @license lucide-react v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const u=(e,t)=>{const n=c.forwardRef(({className:r,...a},o)=>c.createElement(vn,{ref:o,iconNode:t,className:We(`lucide-${hn(e)}`,r),...a}));return n.displayName=`${e}`,n};/**
 * @license lucide-react v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const _r=u("Activity",[["path",{d:"M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2",key:"169zse"}]]);/**
 * @license lucide-react v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Dr=u("Archive",[["rect",{width:"20",height:"5",x:"2",y:"3",rx:"1",key:"1wp1u1"}],["path",{d:"M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8",key:"1s80jp"}],["path",{d:"M10 12h4",key:"a56b0p"}]]);/**
 * @license lucide-react v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ar=u("ArrowLeft",[["path",{d:"m12 19-7-7 7-7",key:"1l729n"}],["path",{d:"M19 12H5",key:"x3x0zl"}]]);/**
 * @license lucide-react v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Tr=u("ArrowRight",[["path",{d:"M5 12h14",key:"1ays0h"}],["path",{d:"m12 5 7 7-7 7",key:"xquz4c"}]]);/**
 * @license lucide-react v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Nr=u("Bell",[["path",{d:"M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9",key:"1qo2s2"}],["path",{d:"M10.3 21a1.94 1.94 0 0 0 3.4 0",key:"qgo35s"}]]);/**
 * @license lucide-react v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Lr=u("Briefcase",[["path",{d:"M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16",key:"jecpp"}],["rect",{width:"20",height:"14",x:"2",y:"6",rx:"2",key:"i6l2r4"}]]);/**
 * @license lucide-react v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const jr=u("Building2",[["path",{d:"M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z",key:"1b4qmf"}],["path",{d:"M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2",key:"i71pzd"}],["path",{d:"M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2",key:"10jefs"}],["path",{d:"M10 6h4",key:"1itunk"}],["path",{d:"M10 10h4",key:"tcdvrf"}],["path",{d:"M10 14h4",key:"kelpxr"}],["path",{d:"M10 18h4",key:"1ulq68"}]]);/**
 * @license lucide-react v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ir=u("CalendarDays",[["path",{d:"M8 2v4",key:"1cmpym"}],["path",{d:"M16 2v4",key:"4m81vk"}],["rect",{width:"18",height:"18",x:"3",y:"4",rx:"2",key:"1hopcy"}],["path",{d:"M3 10h18",key:"8toen8"}],["path",{d:"M8 14h.01",key:"6423bh"}],["path",{d:"M12 14h.01",key:"1etili"}],["path",{d:"M16 14h.01",key:"1gbofw"}],["path",{d:"M8 18h.01",key:"lrp35t"}],["path",{d:"M12 18h.01",key:"mhygvu"}],["path",{d:"M16 18h.01",key:"kzsmim"}]]);/**
 * @license lucide-react v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Fr=u("Calendar",[["path",{d:"M8 2v4",key:"1cmpym"}],["path",{d:"M16 2v4",key:"4m81vk"}],["rect",{width:"18",height:"18",x:"3",y:"4",rx:"2",key:"1hopcy"}],["path",{d:"M3 10h18",key:"8toen8"}]]);/**
 * @license lucide-react v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const zr=u("ChartColumn",[["path",{d:"M3 3v16a2 2 0 0 0 2 2h16",key:"c24i48"}],["path",{d:"M18 17V9",key:"2bz60n"}],["path",{d:"M13 17V5",key:"1frdt8"}],["path",{d:"M8 17v-3",key:"17ska0"}]]);/**
 * @license lucide-react v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Hr=u("Check",[["path",{d:"M20 6 9 17l-5-5",key:"1gmf2c"}]]);/**
 * @license lucide-react v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Vr=u("ChevronDown",[["path",{d:"m6 9 6 6 6-6",key:"qrunsl"}]]);/**
 * @license lucide-react v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const qr=u("ChevronLeft",[["path",{d:"m15 18-6-6 6-6",key:"1wnfg3"}]]);/**
 * @license lucide-react v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Wr=u("ChevronRight",[["path",{d:"m9 18 6-6-6-6",key:"mthhwq"}]]);/**
 * @license lucide-react v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Br=u("ChevronUp",[["path",{d:"m18 15-6-6-6 6",key:"153udz"}]]);/**
 * @license lucide-react v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ur=u("ChevronsUpDown",[["path",{d:"m7 15 5 5 5-5",key:"1hf1tw"}],["path",{d:"m7 9 5-5 5 5",key:"sgt6xg"}]]);/**
 * @license lucide-react v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const $r=u("CircleCheckBig",[["path",{d:"M21.801 10A10 10 0 1 1 17 3.335",key:"yps3ct"}],["path",{d:"m9 11 3 3L22 4",key:"1pflzl"}]]);/**
 * @license lucide-react v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Kr=u("CircleCheck",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"m9 12 2 2 4-4",key:"dzmm74"}]]);/**
 * @license lucide-react v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Zr=u("CircleHelp",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3",key:"1u773s"}],["path",{d:"M12 17h.01",key:"p32p05"}]]);/**
 * @license lucide-react v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Gr=u("CircleX",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"m15 9-6 6",key:"1uzhvr"}],["path",{d:"m9 9 6 6",key:"z0biqf"}]]);/**
 * @license lucide-react v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Xr=u("Circle",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}]]);/**
 * @license lucide-react v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Yr=u("Clock",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["polyline",{points:"12 6 12 12 16 14",key:"68esgv"}]]);/**
 * @license lucide-react v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Qr=u("Code",[["polyline",{points:"16 18 22 12 16 6",key:"z7tu5w"}],["polyline",{points:"8 6 2 12 8 18",key:"1eg1df"}]]);/**
 * @license lucide-react v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Jr=u("Copy",[["rect",{width:"14",height:"14",x:"8",y:"8",rx:"2",ry:"2",key:"17jyea"}],["path",{d:"M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2",key:"zix9uf"}]]);/**
 * @license lucide-react v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ea=u("DollarSign",[["line",{x1:"12",x2:"12",y1:"2",y2:"22",key:"7eqyqh"}],["path",{d:"M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6",key:"1b0p4s"}]]);/**
 * @license lucide-react v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ta=u("Download",[["path",{d:"M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4",key:"ih7n3h"}],["polyline",{points:"7 10 12 15 17 10",key:"2ggqvy"}],["line",{x1:"12",x2:"12",y1:"15",y2:"3",key:"1vk2je"}]]);/**
 * @license lucide-react v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const na=u("EllipsisVertical",[["circle",{cx:"12",cy:"12",r:"1",key:"41hilf"}],["circle",{cx:"12",cy:"5",r:"1",key:"gxeob9"}],["circle",{cx:"12",cy:"19",r:"1",key:"lyex9k"}]]);/**
 * @license lucide-react v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ra=u("Eraser",[["path",{d:"m7 21-4.3-4.3c-1-1-1-2.5 0-3.4l9.6-9.6c1-1 2.5-1 3.4 0l5.6 5.6c1 1 1 2.5 0 3.4L13 21",key:"182aya"}],["path",{d:"M22 21H7",key:"t4ddhn"}],["path",{d:"m5 11 9 9",key:"1mo9qw"}]]);/**
 * @license lucide-react v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const aa=u("ExternalLink",[["path",{d:"M15 3h6v6",key:"1q9fwt"}],["path",{d:"M10 14 21 3",key:"gplh6r"}],["path",{d:"M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6",key:"a6xqqp"}]]);/**
 * @license lucide-react v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const oa=u("EyeOff",[["path",{d:"M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49",key:"ct8e1f"}],["path",{d:"M14.084 14.158a3 3 0 0 1-4.242-4.242",key:"151rxh"}],["path",{d:"M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143",key:"13bj9a"}],["path",{d:"m2 2 20 20",key:"1ooewy"}]]);/**
 * @license lucide-react v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ia=u("Eye",[["path",{d:"M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0",key:"1nclc0"}],["circle",{cx:"12",cy:"12",r:"3",key:"1v7zrd"}]]);/**
 * @license lucide-react v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ca=u("FileDown",[["path",{d:"M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z",key:"1rqfz7"}],["path",{d:"M14 2v4a2 2 0 0 0 2 2h4",key:"tnqrlb"}],["path",{d:"M12 18v-6",key:"17g6i2"}],["path",{d:"m9 15 3 3 3-3",key:"1npd3o"}]]);/**
 * @license lucide-react v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const sa=u("FileSpreadsheet",[["path",{d:"M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z",key:"1rqfz7"}],["path",{d:"M14 2v4a2 2 0 0 0 2 2h4",key:"tnqrlb"}],["path",{d:"M8 13h2",key:"yr2amv"}],["path",{d:"M14 13h2",key:"un5t4a"}],["path",{d:"M8 17h2",key:"2yhykz"}],["path",{d:"M14 17h2",key:"10kma7"}]]);/**
 * @license lucide-react v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const la=u("FileText",[["path",{d:"M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z",key:"1rqfz7"}],["path",{d:"M14 2v4a2 2 0 0 0 2 2h4",key:"tnqrlb"}],["path",{d:"M10 9H8",key:"b1mrlr"}],["path",{d:"M16 13H8",key:"t4e002"}],["path",{d:"M16 17H8",key:"z1uh3a"}]]);/**
 * @license lucide-react v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ua=u("FileUp",[["path",{d:"M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z",key:"1rqfz7"}],["path",{d:"M14 2v4a2 2 0 0 0 2 2h4",key:"tnqrlb"}],["path",{d:"M12 12v6",key:"3ahymv"}],["path",{d:"m15 15-3-3-3 3",key:"15xj92"}]]);/**
 * @license lucide-react v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const da=u("Filter",[["polygon",{points:"22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3",key:"1yg77f"}]]);/**
 * @license lucide-react v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const fa=u("FolderOpen",[["path",{d:"m6 14 1.5-2.9A2 2 0 0 1 9.24 10H20a2 2 0 0 1 1.94 2.5l-1.54 6a2 2 0 0 1-1.95 1.5H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H18a2 2 0 0 1 2 2v2",key:"usdka0"}]]);/**
 * @license lucide-react v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ya=u("Forward",[["polyline",{points:"15 17 20 12 15 7",key:"1w3sku"}],["path",{d:"M4 18v-2a4 4 0 0 1 4-4h12",key:"jmiej9"}]]);/**
 * @license lucide-react v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ha=u("Globe",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20",key:"13o1zl"}],["path",{d:"M2 12h20",key:"9i4pu4"}]]);/**
 * @license lucide-react v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const pa=u("History",[["path",{d:"M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8",key:"1357e3"}],["path",{d:"M3 3v5h5",key:"1xhq8a"}],["path",{d:"M12 7v5l4 2",key:"1fdv2h"}]]);/**
 * @license lucide-react v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const va=u("House",[["path",{d:"M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8",key:"5wwlr5"}],["path",{d:"M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z",key:"1d0kgt"}]]);/**
 * @license lucide-react v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ma=u("Image",[["rect",{width:"18",height:"18",x:"3",y:"3",rx:"2",ry:"2",key:"1m3agn"}],["circle",{cx:"9",cy:"9",r:"2",key:"af1f0g"}],["path",{d:"m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21",key:"1xmnt7"}]]);/**
 * @license lucide-react v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ga=u("Inbox",[["polyline",{points:"22 12 16 12 14 15 10 15 8 12 2 12",key:"o97t9d"}],["path",{d:"M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z",key:"oot6mr"}]]);/**
 * @license lucide-react v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ka=u("Info",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"M12 16v-4",key:"1dtifu"}],["path",{d:"M12 8h.01",key:"e9boi3"}]]);/**
 * @license lucide-react v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ba=u("Link2",[["path",{d:"M9 17H7A5 5 0 0 1 7 7h2",key:"8i5ue5"}],["path",{d:"M15 7h2a5 5 0 1 1 0 10h-2",key:"1b9ql8"}],["line",{x1:"8",x2:"16",y1:"12",y2:"12",key:"1jonct"}]]);/**
 * @license lucide-react v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const wa=u("Link",[["path",{d:"M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71",key:"1cjeqo"}],["path",{d:"M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71",key:"19qd67"}]]);/**
 * @license lucide-react v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ea=u("List",[["path",{d:"M3 12h.01",key:"nlz23k"}],["path",{d:"M3 18h.01",key:"1tta3j"}],["path",{d:"M3 6h.01",key:"1rqtza"}],["path",{d:"M8 12h13",key:"1za7za"}],["path",{d:"M8 18h13",key:"1lx6n3"}],["path",{d:"M8 6h13",key:"ik3vkj"}]]);/**
 * @license lucide-react v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const xa=u("LoaderCircle",[["path",{d:"M21 12a9 9 0 1 1-6.219-8.56",key:"13zald"}]]);/**
 * @license lucide-react v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ma=u("LockOpen",[["rect",{width:"18",height:"11",x:"3",y:"11",rx:"2",ry:"2",key:"1w4ew1"}],["path",{d:"M7 11V7a5 5 0 0 1 9.9-1",key:"1mm8w8"}]]);/**
 * @license lucide-react v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ca=u("Lock",[["rect",{width:"18",height:"11",x:"3",y:"11",rx:"2",ry:"2",key:"1w4ew1"}],["path",{d:"M7 11V7a5 5 0 0 1 10 0v4",key:"fwvmzm"}]]);/**
 * @license lucide-react v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Sa=u("LogIn",[["path",{d:"M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4",key:"u53s6r"}],["polyline",{points:"10 17 15 12 10 7",key:"1ail0h"}],["line",{x1:"15",x2:"3",y1:"12",y2:"12",key:"v6grx8"}]]);/**
 * @license lucide-react v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Pa=u("LogOut",[["path",{d:"M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4",key:"1uf3rs"}],["polyline",{points:"16 17 21 12 16 7",key:"1gabdz"}],["line",{x1:"21",x2:"9",y1:"12",y2:"12",key:"1uyos4"}]]);/**
 * @license lucide-react v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Oa=u("MailOpen",[["path",{d:"M21.2 8.4c.5.38.8.97.8 1.6v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V10a2 2 0 0 1 .8-1.6l8-6a2 2 0 0 1 2.4 0l8 6Z",key:"1jhwl8"}],["path",{d:"m22 10-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 10",key:"1qfld7"}]]);/**
 * @license lucide-react v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ra=u("Mail",[["rect",{width:"20",height:"16",x:"2",y:"4",rx:"2",key:"18n3k1"}],["path",{d:"m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7",key:"1ocrg3"}]]);/**
 * @license lucide-react v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const _a=u("MapPin",[["path",{d:"M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0",key:"1r0f0z"}],["circle",{cx:"12",cy:"10",r:"3",key:"ilqhr7"}]]);/**
 * @license lucide-react v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Da=u("Menu",[["line",{x1:"4",x2:"20",y1:"12",y2:"12",key:"1e0a9i"}],["line",{x1:"4",x2:"20",y1:"6",y2:"6",key:"1owob3"}],["line",{x1:"4",x2:"20",y1:"18",y2:"18",key:"yk5zj1"}]]);/**
 * @license lucide-react v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Aa=u("MessageCircle",[["path",{d:"M7.9 20A9 9 0 1 0 4 16.1L2 22Z",key:"vv11sd"}]]);/**
 * @license lucide-react v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ta=u("MessageSquare",[["path",{d:"M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z",key:"1lielz"}]]);/**
 * @license lucide-react v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Na=u("Monitor",[["rect",{width:"20",height:"14",x:"2",y:"3",rx:"2",key:"48i651"}],["line",{x1:"8",x2:"16",y1:"21",y2:"21",key:"1svkeh"}],["line",{x1:"12",x2:"12",y1:"17",y2:"21",key:"vw1qmm"}]]);/**
 * @license lucide-react v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const La=u("OctagonAlert",[["path",{d:"M12 16h.01",key:"1drbdi"}],["path",{d:"M12 8v4",key:"1got3b"}],["path",{d:"M15.312 2a2 2 0 0 1 1.414.586l4.688 4.688A2 2 0 0 1 22 8.688v6.624a2 2 0 0 1-.586 1.414l-4.688 4.688a2 2 0 0 1-1.414.586H8.688a2 2 0 0 1-1.414-.586l-4.688-4.688A2 2 0 0 1 2 15.312V8.688a2 2 0 0 1 .586-1.414l4.688-4.688A2 2 0 0 1 8.688 2z",key:"1fd625"}]]);/**
 * @license lucide-react v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ja=u("Package",[["path",{d:"M11 21.73a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73z",key:"1a0edw"}],["path",{d:"M12 22V12",key:"d0xqtd"}],["path",{d:"m3.3 7 7.703 4.734a2 2 0 0 0 1.994 0L20.7 7",key:"yx3hmr"}],["path",{d:"m7.5 4.27 9 5.15",key:"1c824w"}]]);/**
 * @license lucide-react v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ia=u("Paperclip",[["path",{d:"m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48",key:"1u3ebp"}]]);/**
 * @license lucide-react v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Fa=u("Pen",[["path",{d:"M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z",key:"1a8usu"}]]);/**
 * @license lucide-react v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const za=u("Pencil",[["path",{d:"M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z",key:"1a8usu"}],["path",{d:"m15 5 4 4",key:"1mk7zo"}]]);/**
 * @license lucide-react v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ha=u("Percent",[["line",{x1:"19",x2:"5",y1:"5",y2:"19",key:"1x9vlm"}],["circle",{cx:"6.5",cy:"6.5",r:"2.5",key:"4mh3h7"}],["circle",{cx:"17.5",cy:"17.5",r:"2.5",key:"1mdrzq"}]]);/**
 * @license lucide-react v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Va=u("Phone",[["path",{d:"M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z",key:"foiqr5"}]]);/**
 * @license lucide-react v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const qa=u("Plus",[["path",{d:"M5 12h14",key:"1ays0h"}],["path",{d:"M12 5v14",key:"s699le"}]]);/**
 * @license lucide-react v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Wa=u("Receipt",[["path",{d:"M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1Z",key:"q3az6g"}],["path",{d:"M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8",key:"1h4pet"}],["path",{d:"M12 17.5v-11",key:"1jc1ny"}]]);/**
 * @license lucide-react v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ba=u("RefreshCw",[["path",{d:"M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8",key:"v9h5vc"}],["path",{d:"M21 3v5h-5",key:"1q7to0"}],["path",{d:"M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16",key:"3uifl3"}],["path",{d:"M8 16H3v5",key:"1cv678"}]]);/**
 * @license lucide-react v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ua=u("ReplyAll",[["polyline",{points:"7 17 2 12 7 7",key:"t83bqg"}],["polyline",{points:"12 17 7 12 12 7",key:"1g4ajm"}],["path",{d:"M22 18v-2a4 4 0 0 0-4-4H7",key:"1fcyog"}]]);/**
 * @license lucide-react v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const $a=u("Reply",[["polyline",{points:"9 17 4 12 9 7",key:"hvgpf2"}],["path",{d:"M20 18v-2a4 4 0 0 0-4-4H4",key:"5vmcpk"}]]);/**
 * @license lucide-react v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ka=u("Rocket",[["path",{d:"M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z",key:"m3kijz"}],["path",{d:"m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z",key:"1fmvmk"}],["path",{d:"M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0",key:"1f8sc4"}],["path",{d:"M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5",key:"qeys4"}]]);/**
 * @license lucide-react v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Za=u("RotateCw",[["path",{d:"M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8",key:"1p45f6"}],["path",{d:"M21 3v5h-5",key:"1q7to0"}]]);/**
 * @license lucide-react v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ga=u("Save",[["path",{d:"M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z",key:"1c8476"}],["path",{d:"M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7",key:"1ydtos"}],["path",{d:"M7 3v4a1 1 0 0 0 1 1h7",key:"t51u73"}]]);/**
 * @license lucide-react v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Xa=u("Search",[["circle",{cx:"11",cy:"11",r:"8",key:"4ej97u"}],["path",{d:"m21 21-4.3-4.3",key:"1qie3q"}]]);/**
 * @license lucide-react v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ya=u("Send",[["path",{d:"M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z",key:"1ffxy3"}],["path",{d:"m21.854 2.147-10.94 10.939",key:"12cjpa"}]]);/**
 * @license lucide-react v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Qa=u("Server",[["rect",{width:"20",height:"8",x:"2",y:"2",rx:"2",ry:"2",key:"ngkwjq"}],["rect",{width:"20",height:"8",x:"2",y:"14",rx:"2",ry:"2",key:"iecqi9"}],["line",{x1:"6",x2:"6.01",y1:"6",y2:"6",key:"16zg32"}],["line",{x1:"6",x2:"6.01",y1:"18",y2:"18",key:"nzw8ys"}]]);/**
 * @license lucide-react v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ja=u("Settings2",[["path",{d:"M20 7h-9",key:"3s1dr2"}],["path",{d:"M14 17H5",key:"gfn3mx"}],["circle",{cx:"17",cy:"17",r:"3",key:"18b49y"}],["circle",{cx:"7",cy:"7",r:"3",key:"dfmy0x"}]]);/**
 * @license lucide-react v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const eo=u("Settings",[["path",{d:"M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z",key:"1qme2f"}],["circle",{cx:"12",cy:"12",r:"3",key:"1v7zrd"}]]);/**
 * @license lucide-react v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const to=u("Shield",[["path",{d:"M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z",key:"oel41y"}]]);/**
 * @license lucide-react v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const no=u("ShoppingBag",[["path",{d:"M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z",key:"hou9p0"}],["path",{d:"M3 6h18",key:"d0wm0j"}],["path",{d:"M16 10a4 4 0 0 1-8 0",key:"1ltviw"}]]);/**
 * @license lucide-react v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ro=u("Smartphone",[["rect",{width:"14",height:"20",x:"5",y:"2",rx:"2",ry:"2",key:"1yt0o3"}],["path",{d:"M12 18h.01",key:"mhygvu"}]]);/**
 * @license lucide-react v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ao=u("Smile",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"M8 14s1.5 2 4 2 4-2 4-2",key:"1y1vjs"}],["line",{x1:"9",x2:"9.01",y1:"9",y2:"9",key:"yxxnd0"}],["line",{x1:"15",x2:"15.01",y1:"9",y2:"9",key:"1p4y9e"}]]);/**
 * @license lucide-react v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const oo=u("Sparkles",[["path",{d:"M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z",key:"4pj2yx"}],["path",{d:"M20 3v4",key:"1olli1"}],["path",{d:"M22 5h-4",key:"1gvqau"}],["path",{d:"M4 17v2",key:"vumght"}],["path",{d:"M5 18H3",key:"zchphs"}]]);/**
 * @license lucide-react v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const io=u("SquarePen",[["path",{d:"M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7",key:"1m0v6g"}],["path",{d:"M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z",key:"ohrbg2"}]]);/**
 * @license lucide-react v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const co=u("Star",[["path",{d:"M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z",key:"r04s7s"}]]);/**
 * @license lucide-react v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const so=u("Target",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["circle",{cx:"12",cy:"12",r:"6",key:"1vlfrh"}],["circle",{cx:"12",cy:"12",r:"2",key:"1c9p78"}]]);/**
 * @license lucide-react v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const lo=u("Trash2",[["path",{d:"M3 6h18",key:"d0wm0j"}],["path",{d:"M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6",key:"4alrt4"}],["path",{d:"M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2",key:"v07s0e"}],["line",{x1:"10",x2:"10",y1:"11",y2:"17",key:"1uufr5"}],["line",{x1:"14",x2:"14",y1:"11",y2:"17",key:"xtxkd"}]]);/**
 * @license lucide-react v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const uo=u("Trash",[["path",{d:"M3 6h18",key:"d0wm0j"}],["path",{d:"M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6",key:"4alrt4"}],["path",{d:"M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2",key:"v07s0e"}]]);/**
 * @license lucide-react v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const fo=u("TrendingDown",[["polyline",{points:"22 17 13.5 8.5 8.5 13.5 2 7",key:"1r2t7k"}],["polyline",{points:"16 17 22 17 22 11",key:"11uiuu"}]]);/**
 * @license lucide-react v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const yo=u("TrendingUp",[["polyline",{points:"22 7 13.5 15.5 8.5 10.5 2 17",key:"126l90"}],["polyline",{points:"16 7 22 7 22 13",key:"kwv8wd"}]]);/**
 * @license lucide-react v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ho=u("Type",[["polyline",{points:"4 7 4 4 20 4 20 7",key:"1nosan"}],["line",{x1:"9",x2:"15",y1:"20",y2:"20",key:"swin9y"}],["line",{x1:"12",x2:"12",y1:"4",y2:"20",key:"1tx1rr"}]]);/**
 * @license lucide-react v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const po=u("Upload",[["path",{d:"M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4",key:"ih7n3h"}],["polyline",{points:"17 8 12 3 7 8",key:"t8dd8p"}],["line",{x1:"12",x2:"12",y1:"3",y2:"15",key:"widbto"}]]);/**
 * @license lucide-react v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const vo=u("UserPen",[["path",{d:"M11.5 15H7a4 4 0 0 0-4 4v2",key:"15lzij"}],["path",{d:"M21.378 16.626a1 1 0 0 0-3.004-3.004l-4.01 4.012a2 2 0 0 0-.506.854l-.837 2.87a.5.5 0 0 0 .62.62l2.87-.837a2 2 0 0 0 .854-.506z",key:"1817ys"}],["circle",{cx:"10",cy:"7",r:"4",key:"e45bow"}]]);/**
 * @license lucide-react v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const mo=u("UserPlus",[["path",{d:"M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2",key:"1yyitq"}],["circle",{cx:"9",cy:"7",r:"4",key:"nufk8"}],["line",{x1:"19",x2:"19",y1:"8",y2:"14",key:"1bvyxn"}],["line",{x1:"22",x2:"16",y1:"11",y2:"11",key:"1shjgl"}]]);/**
 * @license lucide-react v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const go=u("User",[["path",{d:"M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2",key:"975kel"}],["circle",{cx:"12",cy:"7",r:"4",key:"17ys0d"}]]);/**
 * @license lucide-react v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ko=u("Users",[["path",{d:"M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2",key:"1yyitq"}],["circle",{cx:"9",cy:"7",r:"4",key:"nufk8"}],["path",{d:"M22 21v-2a4 4 0 0 0-3-3.87",key:"kshegd"}],["path",{d:"M16 3.13a4 4 0 0 1 0 7.75",key:"1da9ce"}]]);/**
 * @license lucide-react v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const bo=u("Video",[["path",{d:"m16 13 5.223 3.482a.5.5 0 0 0 .777-.416V7.87a.5.5 0 0 0-.752-.432L16 10.5",key:"ftymec"}],["rect",{x:"2",y:"6",width:"14",height:"12",rx:"2",key:"158x01"}]]);/**
 * @license lucide-react v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const wo=u("X",[["path",{d:"M18 6 6 18",key:"1bl5f8"}],["path",{d:"m6 6 12 12",key:"d8bk6v"}]]);/**
 * @license lucide-react v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Eo=u("Zap",[["path",{d:"M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z",key:"1xq2db"}]]);var mn=je[" useId ".trim().toString()]||(()=>{}),gn=0;function ae(e){const[t,n]=c.useState(mn());return q(()=>{n(r=>r??String(gn++))},[e]),t?`radix-${t}`:""}var ye=function(e,t){return ye=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(n,r){n.__proto__=r}||function(n,r){for(var a in r)Object.prototype.hasOwnProperty.call(r,a)&&(n[a]=r[a])},ye(e,t)};function Be(e,t){if(typeof t!="function"&&t!==null)throw new TypeError("Class extends value "+String(t)+" is not a constructor or null");ye(e,t);function n(){this.constructor=e}e.prototype=t===null?Object.create(t):(n.prototype=t.prototype,new n)}var S=function(){return S=Object.assign||function(t){for(var n,r=1,a=arguments.length;r<a;r++){n=arguments[r];for(var o in n)Object.prototype.hasOwnProperty.call(n,o)&&(t[o]=n[o])}return t},S.apply(this,arguments)};function J(e,t){var n={};for(var r in e)Object.prototype.hasOwnProperty.call(e,r)&&t.indexOf(r)<0&&(n[r]=e[r]);if(e!=null&&typeof Object.getOwnPropertySymbols=="function")for(var a=0,r=Object.getOwnPropertySymbols(e);a<r.length;a++)t.indexOf(r[a])<0&&Object.prototype.propertyIsEnumerable.call(e,r[a])&&(n[r[a]]=e[r[a]]);return n}function Ue(e,t,n,r){var a=arguments.length,o=a<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,n):r,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")o=Reflect.decorate(e,t,n,r);else for(var i=e.length-1;i>=0;i--)(s=e[i])&&(o=(a<3?s(o):a>3?s(t,n,o):s(t,n))||o);return a>3&&o&&Object.defineProperty(t,n,o),o}function $e(e,t){return function(n,r){t(n,r,e)}}function Ke(e,t,n,r,a,o){function s(g){if(g!==void 0&&typeof g!="function")throw new TypeError("Function expected");return g}for(var i=r.kind,y=i==="getter"?"get":i==="setter"?"set":"value",l=!t&&e?r.static?e:e.prototype:null,f=t||(l?Object.getOwnPropertyDescriptor(l,r.name):{}),h,m=!1,p=n.length-1;p>=0;p--){var k={};for(var d in r)k[d]=d==="access"?{}:r[d];for(var d in r.access)k.access[d]=r.access[d];k.addInitializer=function(g){if(m)throw new TypeError("Cannot add initializers after decoration has completed");o.push(s(g||null))};var v=(0,n[p])(i==="accessor"?{get:f.get,set:f.set}:f[y],k);if(i==="accessor"){if(v===void 0)continue;if(v===null||typeof v!="object")throw new TypeError("Object expected");(h=s(v.get))&&(f.get=h),(h=s(v.set))&&(f.set=h),(h=s(v.init))&&a.unshift(h)}else(h=s(v))&&(i==="field"?a.unshift(h):f[y]=h)}l&&Object.defineProperty(l,r.name,f),m=!0}function Ze(e,t,n){for(var r=arguments.length>2,a=0;a<t.length;a++)n=r?t[a].call(e,n):t[a].call(e);return r?n:void 0}function Ge(e){return typeof e=="symbol"?e:"".concat(e)}function Xe(e,t,n){return typeof t=="symbol"&&(t=t.description?"[".concat(t.description,"]"):""),Object.defineProperty(e,"name",{configurable:!0,value:n?"".concat(n," ",t):t})}function Ye(e,t){if(typeof Reflect=="object"&&typeof Reflect.metadata=="function")return Reflect.metadata(e,t)}function Qe(e,t,n,r){function a(o){return o instanceof n?o:new n(function(s){s(o)})}return new(n||(n=Promise))(function(o,s){function i(f){try{l(r.next(f))}catch(h){s(h)}}function y(f){try{l(r.throw(f))}catch(h){s(h)}}function l(f){f.done?o(f.value):a(f.value).then(i,y)}l((r=r.apply(e,t||[])).next())})}function Je(e,t){var n={label:0,sent:function(){if(o[0]&1)throw o[1];return o[1]},trys:[],ops:[]},r,a,o,s=Object.create((typeof Iterator=="function"?Iterator:Object).prototype);return s.next=i(0),s.throw=i(1),s.return=i(2),typeof Symbol=="function"&&(s[Symbol.iterator]=function(){return this}),s;function i(l){return function(f){return y([l,f])}}function y(l){if(r)throw new TypeError("Generator is already executing.");for(;s&&(s=0,l[0]&&(n=0)),n;)try{if(r=1,a&&(o=l[0]&2?a.return:l[0]?a.throw||((o=a.return)&&o.call(a),0):a.next)&&!(o=o.call(a,l[1])).done)return o;switch(a=0,o&&(l=[l[0]&2,o.value]),l[0]){case 0:case 1:o=l;break;case 4:return n.label++,{value:l[1],done:!1};case 5:n.label++,a=l[1],l=[0];continue;case 7:l=n.ops.pop(),n.trys.pop();continue;default:if(o=n.trys,!(o=o.length>0&&o[o.length-1])&&(l[0]===6||l[0]===2)){n=0;continue}if(l[0]===3&&(!o||l[1]>o[0]&&l[1]<o[3])){n.label=l[1];break}if(l[0]===6&&n.label<o[1]){n.label=o[1],o=l;break}if(o&&n.label<o[2]){n.label=o[2],n.ops.push(l);break}o[2]&&n.ops.pop(),n.trys.pop();continue}l=t.call(e,n)}catch(f){l=[6,f],a=0}finally{r=o=0}if(l[0]&5)throw l[1];return{value:l[0]?l[1]:void 0,done:!0}}}var ee=Object.create?function(e,t,n,r){r===void 0&&(r=n);var a=Object.getOwnPropertyDescriptor(t,n);(!a||("get"in a?!t.__esModule:a.writable||a.configurable))&&(a={enumerable:!0,get:function(){return t[n]}}),Object.defineProperty(e,r,a)}:function(e,t,n,r){r===void 0&&(r=n),e[r]=t[n]};function et(e,t){for(var n in e)n!=="default"&&!Object.prototype.hasOwnProperty.call(t,n)&&ee(t,e,n)}function X(e){var t=typeof Symbol=="function"&&Symbol.iterator,n=t&&e[t],r=0;if(n)return n.call(e);if(e&&typeof e.length=="number")return{next:function(){return e&&r>=e.length&&(e=void 0),{value:e&&e[r++],done:!e}}};throw new TypeError(t?"Object is not iterable.":"Symbol.iterator is not defined.")}function ge(e,t){var n=typeof Symbol=="function"&&e[Symbol.iterator];if(!n)return e;var r=n.call(e),a,o=[],s;try{for(;(t===void 0||t-- >0)&&!(a=r.next()).done;)o.push(a.value)}catch(i){s={error:i}}finally{try{a&&!a.done&&(n=r.return)&&n.call(r)}finally{if(s)throw s.error}}return o}function tt(){for(var e=[],t=0;t<arguments.length;t++)e=e.concat(ge(arguments[t]));return e}function nt(){for(var e=0,t=0,n=arguments.length;t<n;t++)e+=arguments[t].length;for(var r=Array(e),a=0,t=0;t<n;t++)for(var o=arguments[t],s=0,i=o.length;s<i;s++,a++)r[a]=o[s];return r}function ke(e,t,n){if(n||arguments.length===2)for(var r=0,a=t.length,o;r<a;r++)(o||!(r in t))&&(o||(o=Array.prototype.slice.call(t,0,r)),o[r]=t[r]);return e.concat(o||Array.prototype.slice.call(t))}function z(e){return this instanceof z?(this.v=e,this):new z(e)}function rt(e,t,n){if(!Symbol.asyncIterator)throw new TypeError("Symbol.asyncIterator is not defined.");var r=n.apply(e,t||[]),a,o=[];return a=Object.create((typeof AsyncIterator=="function"?AsyncIterator:Object).prototype),i("next"),i("throw"),i("return",s),a[Symbol.asyncIterator]=function(){return this},a;function s(p){return function(k){return Promise.resolve(k).then(p,h)}}function i(p,k){r[p]&&(a[p]=function(d){return new Promise(function(v,g){o.push([p,d,v,g])>1||y(p,d)})},k&&(a[p]=k(a[p])))}function y(p,k){try{l(r[p](k))}catch(d){m(o[0][3],d)}}function l(p){p.value instanceof z?Promise.resolve(p.value.v).then(f,h):m(o[0][2],p)}function f(p){y("next",p)}function h(p){y("throw",p)}function m(p,k){p(k),o.shift(),o.length&&y(o[0][0],o[0][1])}}function at(e){var t,n;return t={},r("next"),r("throw",function(a){throw a}),r("return"),t[Symbol.iterator]=function(){return this},t;function r(a,o){t[a]=e[a]?function(s){return(n=!n)?{value:z(e[a](s)),done:!1}:o?o(s):s}:o}}function ot(e){if(!Symbol.asyncIterator)throw new TypeError("Symbol.asyncIterator is not defined.");var t=e[Symbol.asyncIterator],n;return t?t.call(e):(e=typeof X=="function"?X(e):e[Symbol.iterator](),n={},r("next"),r("throw"),r("return"),n[Symbol.asyncIterator]=function(){return this},n);function r(o){n[o]=e[o]&&function(s){return new Promise(function(i,y){s=e[o](s),a(i,y,s.done,s.value)})}}function a(o,s,i,y){Promise.resolve(y).then(function(l){o({value:l,done:i})},s)}}function it(e,t){return Object.defineProperty?Object.defineProperty(e,"raw",{value:t}):e.raw=t,e}var kn=Object.create?function(e,t){Object.defineProperty(e,"default",{enumerable:!0,value:t})}:function(e,t){e.default=t},he=function(e){return he=Object.getOwnPropertyNames||function(t){var n=[];for(var r in t)Object.prototype.hasOwnProperty.call(t,r)&&(n[n.length]=r);return n},he(e)};function ct(e){if(e&&e.__esModule)return e;var t={};if(e!=null)for(var n=he(e),r=0;r<n.length;r++)n[r]!=="default"&&ee(t,e,n[r]);return kn(t,e),t}function st(e){return e&&e.__esModule?e:{default:e}}function lt(e,t,n,r){if(n==="a"&&!r)throw new TypeError("Private accessor was defined without a getter");if(typeof t=="function"?e!==t||!r:!t.has(e))throw new TypeError("Cannot read private member from an object whose class did not declare it");return n==="m"?r:n==="a"?r.call(e):r?r.value:t.get(e)}function ut(e,t,n,r,a){if(r==="m")throw new TypeError("Private method is not writable");if(r==="a"&&!a)throw new TypeError("Private accessor was defined without a setter");if(typeof t=="function"?e!==t||!a:!t.has(e))throw new TypeError("Cannot write private member to an object whose class did not declare it");return r==="a"?a.call(e,n):a?a.value=n:t.set(e,n),n}function dt(e,t){if(t===null||typeof t!="object"&&typeof t!="function")throw new TypeError("Cannot use 'in' operator on non-object");return typeof e=="function"?t===e:e.has(t)}function ft(e,t,n){if(t!=null){if(typeof t!="object"&&typeof t!="function")throw new TypeError("Object expected.");var r,a;if(n){if(!Symbol.asyncDispose)throw new TypeError("Symbol.asyncDispose is not defined.");r=t[Symbol.asyncDispose]}if(r===void 0){if(!Symbol.dispose)throw new TypeError("Symbol.dispose is not defined.");r=t[Symbol.dispose],n&&(a=r)}if(typeof r!="function")throw new TypeError("Object not disposable.");a&&(r=function(){try{a.call(this)}catch(o){return Promise.reject(o)}}),e.stack.push({value:t,dispose:r,async:n})}else n&&e.stack.push({async:!0});return t}var bn=typeof SuppressedError=="function"?SuppressedError:function(e,t,n){var r=new Error(n);return r.name="SuppressedError",r.error=e,r.suppressed=t,r};function yt(e){function t(o){e.error=e.hasError?new bn(o,e.error,"An error was suppressed during disposal."):o,e.hasError=!0}var n,r=0;function a(){for(;n=e.stack.pop();)try{if(!n.async&&r===1)return r=0,e.stack.push(n),Promise.resolve().then(a);if(n.dispose){var o=n.dispose.call(n.value);if(n.async)return r|=2,Promise.resolve(o).then(a,function(s){return t(s),a()})}else r|=1}catch(s){t(s)}if(r===1)return e.hasError?Promise.reject(e.error):Promise.resolve();if(e.hasError)throw e.error}return a()}function ht(e,t){return typeof e=="string"&&/^\.\.?\//.test(e)?e.replace(/\.(tsx)$|((?:\.d)?)((?:\.[^./]+?)?)\.([cm]?)ts$/i,function(n,r,a,o,s){return r?t?".jsx":".js":a&&(!o||!s)?n:a+o+"."+s.toLowerCase()+"js"}):e}const wn={__extends:Be,__assign:S,__rest:J,__decorate:Ue,__param:$e,__esDecorate:Ke,__runInitializers:Ze,__propKey:Ge,__setFunctionName:Xe,__metadata:Ye,__awaiter:Qe,__generator:Je,__createBinding:ee,__exportStar:et,__values:X,__read:ge,__spread:tt,__spreadArrays:nt,__spreadArray:ke,__await:z,__asyncGenerator:rt,__asyncDelegator:at,__asyncValues:ot,__makeTemplateObject:it,__importStar:ct,__importDefault:st,__classPrivateFieldGet:lt,__classPrivateFieldSet:ut,__classPrivateFieldIn:dt,__addDisposableResource:ft,__disposeResources:yt,__rewriteRelativeImportExtension:ht},xo=Object.freeze(Object.defineProperty({__proto__:null,__addDisposableResource:ft,get __assign(){return S},__asyncDelegator:at,__asyncGenerator:rt,__asyncValues:ot,__await:z,__awaiter:Qe,__classPrivateFieldGet:lt,__classPrivateFieldIn:dt,__classPrivateFieldSet:ut,__createBinding:ee,__decorate:Ue,__disposeResources:yt,__esDecorate:Ke,__exportStar:et,__extends:Be,__generator:Je,__importDefault:st,__importStar:ct,__makeTemplateObject:it,__metadata:Ye,__param:$e,__propKey:Ge,__read:ge,__rest:J,__rewriteRelativeImportExtension:ht,__runInitializers:Ze,__setFunctionName:Xe,__spread:tt,__spreadArray:ke,__spreadArrays:nt,__values:X,default:wn},Symbol.toStringTag,{value:"Module"}));var oe="focusScope.autoFocusOnMount",ie="focusScope.autoFocusOnUnmount",Se={bubbles:!1,cancelable:!0},En="FocusScope",pt=c.forwardRef((e,t)=>{const{loop:n=!1,trapped:r=!1,onMountAutoFocus:a,onUnmountAutoFocus:o,...s}=e,[i,y]=c.useState(null),l=V(a),f=V(o),h=c.useRef(null),m=N(t,d=>y(d)),p=c.useRef({paused:!1,pause(){this.paused=!0},resume(){this.paused=!1}}).current;c.useEffect(()=>{if(r){let d=function(x){if(p.paused||!i)return;const M=x.target;i.contains(M)?h.current=M:D(h.current,{select:!0})},v=function(x){if(p.paused||!i)return;const M=x.relatedTarget;M!==null&&(i.contains(M)||D(h.current,{select:!0}))},g=function(x){if(document.activeElement===document.body)for(const C of x)C.removedNodes.length>0&&D(i)};document.addEventListener("focusin",d),document.addEventListener("focusout",v);const E=new MutationObserver(g);return i&&E.observe(i,{childList:!0,subtree:!0}),()=>{document.removeEventListener("focusin",d),document.removeEventListener("focusout",v),E.disconnect()}}},[r,i,p.paused]),c.useEffect(()=>{if(i){Oe.add(p);const d=document.activeElement;if(!i.contains(d)){const g=new CustomEvent(oe,Se);i.addEventListener(oe,l),i.dispatchEvent(g),g.defaultPrevented||(xn(On(vt(i)),{select:!0}),document.activeElement===d&&D(i))}return()=>{i.removeEventListener(oe,l),setTimeout(()=>{const g=new CustomEvent(ie,Se);i.addEventListener(ie,f),i.dispatchEvent(g),g.defaultPrevented||D(d??document.body,{select:!0}),i.removeEventListener(ie,f),Oe.remove(p)},0)}}},[i,l,f,p]);const k=c.useCallback(d=>{if(!n&&!r||p.paused)return;const v=d.key==="Tab"&&!d.altKey&&!d.ctrlKey&&!d.metaKey,g=document.activeElement;if(v&&g){const E=d.currentTarget,[x,M]=Mn(E);x&&M?!d.shiftKey&&g===M?(d.preventDefault(),n&&D(x,{select:!0})):d.shiftKey&&g===x&&(d.preventDefault(),n&&D(M,{select:!0})):g===E&&d.preventDefault()}},[n,r,p.paused]);return b.jsx(_.div,{tabIndex:-1,...s,ref:m,onKeyDown:k})});pt.displayName=En;function xn(e,{select:t=!1}={}){const n=document.activeElement;for(const r of e)if(D(r,{select:t}),document.activeElement!==n)return}function Mn(e){const t=vt(e),n=Pe(t,e),r=Pe(t.reverse(),e);return[n,r]}function vt(e){const t=[],n=document.createTreeWalker(e,NodeFilter.SHOW_ELEMENT,{acceptNode:r=>{const a=r.tagName==="INPUT"&&r.type==="hidden";return r.disabled||r.hidden||a?NodeFilter.FILTER_SKIP:r.tabIndex>=0?NodeFilter.FILTER_ACCEPT:NodeFilter.FILTER_SKIP}});for(;n.nextNode();)t.push(n.currentNode);return t}function Pe(e,t){for(const n of e)if(!Cn(n,{upTo:t}))return n}function Cn(e,{upTo:t}){if(getComputedStyle(e).visibility==="hidden")return!0;for(;e;){if(t!==void 0&&e===t)return!1;if(getComputedStyle(e).display==="none")return!0;e=e.parentElement}return!1}function Sn(e){return e instanceof HTMLInputElement&&"select"in e}function D(e,{select:t=!1}={}){if(e&&e.focus){const n=document.activeElement;e.focus({preventScroll:!0}),e!==n&&Sn(e)&&t&&e.select()}}var Oe=Pn();function Pn(){let e=[];return{add(t){const n=e[0];t!==n&&n?.pause(),e=Re(e,t),e.unshift(t)},remove(t){e=Re(e,t),e[0]?.resume()}}}function Re(e,t){const n=[...e],r=n.indexOf(t);return r!==-1&&n.splice(r,1),n}function On(e){return e.filter(t=>t.tagName!=="A")}var ce=0;function Rn(){c.useEffect(()=>{const e=document.querySelectorAll("[data-radix-focus-guard]");return document.body.insertAdjacentElement("afterbegin",e[0]??_e()),document.body.insertAdjacentElement("beforeend",e[1]??_e()),ce++,()=>{ce===1&&document.querySelectorAll("[data-radix-focus-guard]").forEach(t=>t.remove()),ce--}},[])}function _e(){const e=document.createElement("span");return e.setAttribute("data-radix-focus-guard",""),e.tabIndex=0,e.style.outline="none",e.style.opacity="0",e.style.position="fixed",e.style.pointerEvents="none",e}var Z="right-scroll-bar-position",G="width-before-scroll-bar",_n="with-scroll-bars-hidden",Dn="--removed-body-scroll-bar-size";function se(e,t){return typeof e=="function"?e(t):e&&(e.current=t),e}function An(e,t){var n=c.useState(function(){return{value:e,callback:t,facade:{get current(){return n.value},set current(r){var a=n.value;a!==r&&(n.value=r,n.callback(r,a))}}}})[0];return n.callback=t,n.facade}var Tn=typeof window<"u"?c.useLayoutEffect:c.useEffect,De=new WeakMap;function Nn(e,t){var n=An(null,function(r){return e.forEach(function(a){return se(a,r)})});return Tn(function(){var r=De.get(n);if(r){var a=new Set(r),o=new Set(e),s=n.current;a.forEach(function(i){o.has(i)||se(i,null)}),o.forEach(function(i){a.has(i)||se(i,s)})}De.set(n,e)},[e]),n}function Ln(e){return e}function jn(e,t){t===void 0&&(t=Ln);var n=[],r=!1,a={read:function(){if(r)throw new Error("Sidecar: could not `read` from an `assigned` medium. `read` could be used only with `useMedium`.");return n.length?n[n.length-1]:e},useMedium:function(o){var s=t(o,r);return n.push(s),function(){n=n.filter(function(i){return i!==s})}},assignSyncMedium:function(o){for(r=!0;n.length;){var s=n;n=[],s.forEach(o)}n={push:function(i){return o(i)},filter:function(){return n}}},assignMedium:function(o){r=!0;var s=[];if(n.length){var i=n;n=[],i.forEach(o),s=n}var y=function(){var f=s;s=[],f.forEach(o)},l=function(){return Promise.resolve().then(y)};l(),n={push:function(f){s.push(f),l()},filter:function(f){return s=s.filter(f),n}}}};return a}function In(e){e===void 0&&(e={});var t=jn(null);return t.options=S({async:!0,ssr:!1},e),t}var mt=function(e){var t=e.sideCar,n=J(e,["sideCar"]);if(!t)throw new Error("Sidecar: please provide `sideCar` property to import the right car");var r=t.read();if(!r)throw new Error("Sidecar medium not found");return c.createElement(r,S({},n))};mt.isSideCarExport=!0;function Fn(e,t){return e.useMedium(t),mt}var gt=In(),le=function(){},te=c.forwardRef(function(e,t){var n=c.useRef(null),r=c.useState({onScrollCapture:le,onWheelCapture:le,onTouchMoveCapture:le}),a=r[0],o=r[1],s=e.forwardProps,i=e.children,y=e.className,l=e.removeScrollBar,f=e.enabled,h=e.shards,m=e.sideCar,p=e.noRelative,k=e.noIsolation,d=e.inert,v=e.allowPinchZoom,g=e.as,E=g===void 0?"div":g,x=e.gapMode,M=J(e,["forwardProps","children","className","removeScrollBar","enabled","shards","sideCar","noRelative","noIsolation","inert","allowPinchZoom","as","gapMode"]),C=m,O=Nn([n,t]),w=S(S({},M),a);return c.createElement(c.Fragment,null,f&&c.createElement(C,{sideCar:gt,removeScrollBar:l,shards:h,noRelative:p,noIsolation:k,inert:d,setCallbacks:o,allowPinchZoom:!!v,lockRef:n,gapMode:x}),s?c.cloneElement(c.Children.only(i),S(S({},w),{ref:O})):c.createElement(E,S({},w,{className:y,ref:O}),i))});te.defaultProps={enabled:!0,removeScrollBar:!0,inert:!1};te.classNames={fullWidth:G,zeroRight:Z};var zn=function(){if(typeof __webpack_nonce__<"u")return __webpack_nonce__};function Hn(){if(!document)return null;var e=document.createElement("style");e.type="text/css";var t=zn();return t&&e.setAttribute("nonce",t),e}function Vn(e,t){e.styleSheet?e.styleSheet.cssText=t:e.appendChild(document.createTextNode(t))}function qn(e){var t=document.head||document.getElementsByTagName("head")[0];t.appendChild(e)}var Wn=function(){var e=0,t=null;return{add:function(n){e==0&&(t=Hn())&&(Vn(t,n),qn(t)),e++},remove:function(){e--,!e&&t&&(t.parentNode&&t.parentNode.removeChild(t),t=null)}}},Bn=function(){var e=Wn();return function(t,n){c.useEffect(function(){return e.add(t),function(){e.remove()}},[t&&n])}},kt=function(){var e=Bn(),t=function(n){var r=n.styles,a=n.dynamic;return e(r,a),null};return t},Un={left:0,top:0,right:0,gap:0},ue=function(e){return parseInt(e||"",10)||0},$n=function(e){var t=window.getComputedStyle(document.body),n=t[e==="padding"?"paddingLeft":"marginLeft"],r=t[e==="padding"?"paddingTop":"marginTop"],a=t[e==="padding"?"paddingRight":"marginRight"];return[ue(n),ue(r),ue(a)]},Kn=function(e){if(e===void 0&&(e="margin"),typeof window>"u")return Un;var t=$n(e),n=document.documentElement.clientWidth,r=window.innerWidth;return{left:t[0],top:t[1],right:t[2],gap:Math.max(0,r-n+t[2]-t[0])}},Zn=kt(),F="data-scroll-locked",Gn=function(e,t,n,r){var a=e.left,o=e.top,s=e.right,i=e.gap;return n===void 0&&(n="margin"),`
  .`.concat(_n,` {
   overflow: hidden `).concat(r,`;
   padding-right: `).concat(i,"px ").concat(r,`;
  }
  body[`).concat(F,`] {
    overflow: hidden `).concat(r,`;
    overscroll-behavior: contain;
    `).concat([t&&"position: relative ".concat(r,";"),n==="margin"&&`
    padding-left: `.concat(a,`px;
    padding-top: `).concat(o,`px;
    padding-right: `).concat(s,`px;
    margin-left:0;
    margin-top:0;
    margin-right: `).concat(i,"px ").concat(r,`;
    `),n==="padding"&&"padding-right: ".concat(i,"px ").concat(r,";")].filter(Boolean).join(""),`
  }
  
  .`).concat(Z,` {
    right: `).concat(i,"px ").concat(r,`;
  }
  
  .`).concat(G,` {
    margin-right: `).concat(i,"px ").concat(r,`;
  }
  
  .`).concat(Z," .").concat(Z,` {
    right: 0 `).concat(r,`;
  }
  
  .`).concat(G," .").concat(G,` {
    margin-right: 0 `).concat(r,`;
  }
  
  body[`).concat(F,`] {
    `).concat(Dn,": ").concat(i,`px;
  }
`)},Ae=function(){var e=parseInt(document.body.getAttribute(F)||"0",10);return isFinite(e)?e:0},Xn=function(){c.useEffect(function(){return document.body.setAttribute(F,(Ae()+1).toString()),function(){var e=Ae()-1;e<=0?document.body.removeAttribute(F):document.body.setAttribute(F,e.toString())}},[])},Yn=function(e){var t=e.noRelative,n=e.noImportant,r=e.gapMode,a=r===void 0?"margin":r;Xn();var o=c.useMemo(function(){return Kn(a)},[a]);return c.createElement(Zn,{styles:Gn(o,!t,a,n?"":"!important")})},pe=!1;if(typeof window<"u")try{var B=Object.defineProperty({},"passive",{get:function(){return pe=!0,!0}});window.addEventListener("test",B,B),window.removeEventListener("test",B,B)}catch{pe=!1}var L=pe?{passive:!1}:!1,Qn=function(e){return e.tagName==="TEXTAREA"},bt=function(e,t){if(!(e instanceof Element))return!1;var n=window.getComputedStyle(e);return n[t]!=="hidden"&&!(n.overflowY===n.overflowX&&!Qn(e)&&n[t]==="visible")},Jn=function(e){return bt(e,"overflowY")},er=function(e){return bt(e,"overflowX")},Te=function(e,t){var n=t.ownerDocument,r=t;do{typeof ShadowRoot<"u"&&r instanceof ShadowRoot&&(r=r.host);var a=wt(e,r);if(a){var o=Et(e,r),s=o[1],i=o[2];if(s>i)return!0}r=r.parentNode}while(r&&r!==n.body);return!1},tr=function(e){var t=e.scrollTop,n=e.scrollHeight,r=e.clientHeight;return[t,n,r]},nr=function(e){var t=e.scrollLeft,n=e.scrollWidth,r=e.clientWidth;return[t,n,r]},wt=function(e,t){return e==="v"?Jn(t):er(t)},Et=function(e,t){return e==="v"?tr(t):nr(t)},rr=function(e,t){return e==="h"&&t==="rtl"?-1:1},ar=function(e,t,n,r,a){var o=rr(e,window.getComputedStyle(t).direction),s=o*r,i=n.target,y=t.contains(i),l=!1,f=s>0,h=0,m=0;do{if(!i)break;var p=Et(e,i),k=p[0],d=p[1],v=p[2],g=d-v-o*k;(k||g)&&wt(e,i)&&(h+=g,m+=k);var E=i.parentNode;i=E&&E.nodeType===Node.DOCUMENT_FRAGMENT_NODE?E.host:E}while(!y&&i!==document.body||y&&(t.contains(i)||t===i));return(f&&(Math.abs(h)<1||!a)||!f&&(Math.abs(m)<1||!a))&&(l=!0),l},U=function(e){return"changedTouches"in e?[e.changedTouches[0].clientX,e.changedTouches[0].clientY]:[0,0]},Ne=function(e){return[e.deltaX,e.deltaY]},Le=function(e){return e&&"current"in e?e.current:e},or=function(e,t){return e[0]===t[0]&&e[1]===t[1]},ir=function(e){return`
  .block-interactivity-`.concat(e,` {pointer-events: none;}
  .allow-interactivity-`).concat(e,` {pointer-events: all;}
`)},cr=0,j=[];function sr(e){var t=c.useRef([]),n=c.useRef([0,0]),r=c.useRef(),a=c.useState(cr++)[0],o=c.useState(kt)[0],s=c.useRef(e);c.useEffect(function(){s.current=e},[e]),c.useEffect(function(){if(e.inert){document.body.classList.add("block-interactivity-".concat(a));var d=ke([e.lockRef.current],(e.shards||[]).map(Le),!0).filter(Boolean);return d.forEach(function(v){return v.classList.add("allow-interactivity-".concat(a))}),function(){document.body.classList.remove("block-interactivity-".concat(a)),d.forEach(function(v){return v.classList.remove("allow-interactivity-".concat(a))})}}},[e.inert,e.lockRef.current,e.shards]);var i=c.useCallback(function(d,v){if("touches"in d&&d.touches.length===2||d.type==="wheel"&&d.ctrlKey)return!s.current.allowPinchZoom;var g=U(d),E=n.current,x="deltaX"in d?d.deltaX:E[0]-g[0],M="deltaY"in d?d.deltaY:E[1]-g[1],C,O=d.target,w=Math.abs(x)>Math.abs(M)?"h":"v";if("touches"in d&&w==="h"&&O.type==="range")return!1;var R=Te(w,O);if(!R)return!0;if(R?C=w:(C=w==="v"?"h":"v",R=Te(w,O)),!R)return!1;if(!r.current&&"changedTouches"in d&&(x||M)&&(r.current=C),!C)return!0;var H=r.current||C;return ar(H,v,d,H==="h"?x:M,!0)},[]),y=c.useCallback(function(d){var v=d;if(!(!j.length||j[j.length-1]!==o)){var g="deltaY"in v?Ne(v):U(v),E=t.current.filter(function(C){return C.name===v.type&&(C.target===v.target||v.target===C.shadowParent)&&or(C.delta,g)})[0];if(E&&E.should){v.cancelable&&v.preventDefault();return}if(!E){var x=(s.current.shards||[]).map(Le).filter(Boolean).filter(function(C){return C.contains(v.target)}),M=x.length>0?i(v,x[0]):!s.current.noIsolation;M&&v.cancelable&&v.preventDefault()}}},[]),l=c.useCallback(function(d,v,g,E){var x={name:d,delta:v,target:g,should:E,shadowParent:lr(g)};t.current.push(x),setTimeout(function(){t.current=t.current.filter(function(M){return M!==x})},1)},[]),f=c.useCallback(function(d){n.current=U(d),r.current=void 0},[]),h=c.useCallback(function(d){l(d.type,Ne(d),d.target,i(d,e.lockRef.current))},[]),m=c.useCallback(function(d){l(d.type,U(d),d.target,i(d,e.lockRef.current))},[]);c.useEffect(function(){return j.push(o),e.setCallbacks({onScrollCapture:h,onWheelCapture:h,onTouchMoveCapture:m}),document.addEventListener("wheel",y,L),document.addEventListener("touchmove",y,L),document.addEventListener("touchstart",f,L),function(){j=j.filter(function(d){return d!==o}),document.removeEventListener("wheel",y,L),document.removeEventListener("touchmove",y,L),document.removeEventListener("touchstart",f,L)}},[]);var p=e.removeScrollBar,k=e.inert;return c.createElement(c.Fragment,null,k?c.createElement(o,{styles:ir(a)}):null,p?c.createElement(Yn,{noRelative:e.noRelative,gapMode:e.gapMode}):null)}function lr(e){for(var t=null;e!==null;)e instanceof ShadowRoot&&(t=e.host,e=e.host),e=e.parentNode;return t}const ur=Fn(gt,sr);var xt=c.forwardRef(function(e,t){return c.createElement(te,S({},e,{ref:t,sideCar:ur}))});xt.classNames=te.classNames;var dr=function(e){if(typeof document>"u")return null;var t=Array.isArray(e)?e[0]:e;return t.ownerDocument.body},I=new WeakMap,$=new WeakMap,K={},de=0,Mt=function(e){return e&&(e.host||Mt(e.parentNode))},fr=function(e,t){return t.map(function(n){if(e.contains(n))return n;var r=Mt(n);return r&&e.contains(r)?r:(console.error("aria-hidden",n,"in not contained inside",e,". Doing nothing"),null)}).filter(function(n){return!!n})},yr=function(e,t,n,r){var a=fr(t,Array.isArray(e)?e:[e]);K[n]||(K[n]=new WeakMap);var o=K[n],s=[],i=new Set,y=new Set(a),l=function(h){!h||i.has(h)||(i.add(h),l(h.parentNode))};a.forEach(l);var f=function(h){!h||y.has(h)||Array.prototype.forEach.call(h.children,function(m){if(i.has(m))f(m);else try{var p=m.getAttribute(r),k=p!==null&&p!=="false",d=(I.get(m)||0)+1,v=(o.get(m)||0)+1;I.set(m,d),o.set(m,v),s.push(m),d===1&&k&&$.set(m,!0),v===1&&m.setAttribute(n,"true"),k||m.setAttribute(r,"true")}catch(g){console.error("aria-hidden: cannot operate on ",m,g)}})};return f(t),i.clear(),de++,function(){s.forEach(function(h){var m=I.get(h)-1,p=o.get(h)-1;I.set(h,m),o.set(h,p),m||($.has(h)||h.removeAttribute(r),$.delete(h)),p||h.removeAttribute(n)}),de--,de||(I=new WeakMap,I=new WeakMap,$=new WeakMap,K={})}},hr=function(e,t,n){n===void 0&&(n="data-aria-hidden");var r=Array.from(Array.isArray(e)?e:[e]),a=dr(e);return a?(r.push.apply(r,Array.from(a.querySelectorAll("[aria-live]"))),yr(r,a,n,"aria-hidden")):function(){return null}},ne="Dialog",[Ct,Mo]=Bt(ne),[pr,P]=Ct(ne),St=e=>{const{__scopeDialog:t,children:n,open:r,defaultOpen:a,onOpenChange:o,modal:s=!0}=e,i=c.useRef(null),y=c.useRef(null),[l,f]=dn({prop:r,defaultProp:a??!1,onChange:o,caller:ne});return b.jsx(pr,{scope:t,triggerRef:i,contentRef:y,contentId:ae(),titleId:ae(),descriptionId:ae(),open:l,onOpenChange:f,onOpenToggle:c.useCallback(()=>f(h=>!h),[f]),modal:s,children:n})};St.displayName=ne;var Pt="DialogTrigger",Ot=c.forwardRef((e,t)=>{const{__scopeDialog:n,...r}=e,a=P(Pt,n),o=N(t,a.triggerRef);return b.jsx(_.button,{type:"button","aria-haspopup":"dialog","aria-expanded":a.open,"aria-controls":a.contentId,"data-state":Ee(a.open),...r,ref:o,onClick:A(e.onClick,a.onOpenToggle)})});Ot.displayName=Pt;var be="DialogPortal",[vr,Rt]=Ct(be,{forceMount:void 0}),_t=e=>{const{__scopeDialog:t,forceMount:n,children:r,container:a}=e,o=P(be,t);return b.jsx(vr,{scope:t,forceMount:n,children:c.Children.map(r,s=>b.jsx(Q,{present:n||o.open,children:b.jsx(qe,{asChild:!0,container:a,children:s})}))})};_t.displayName=be;var Y="DialogOverlay",Dt=c.forwardRef((e,t)=>{const n=Rt(Y,e.__scopeDialog),{forceMount:r=n.forceMount,...a}=e,o=P(Y,e.__scopeDialog);return o.modal?b.jsx(Q,{present:r||o.open,children:b.jsx(gr,{...a,ref:t})}):null});Dt.displayName=Y;var mr=ve("DialogOverlay.RemoveScroll"),gr=c.forwardRef((e,t)=>{const{__scopeDialog:n,...r}=e,a=P(Y,n);return b.jsx(xt,{as:mr,allowPinchZoom:!0,shards:[a.contentRef],children:b.jsx(_.div,{"data-state":Ee(a.open),...r,ref:t,style:{pointerEvents:"auto",...r.style}})})}),T="DialogContent",At=c.forwardRef((e,t)=>{const n=Rt(T,e.__scopeDialog),{forceMount:r=n.forceMount,...a}=e,o=P(T,e.__scopeDialog);return b.jsx(Q,{present:r||o.open,children:o.modal?b.jsx(kr,{...a,ref:t}):b.jsx(br,{...a,ref:t})})});At.displayName=T;var kr=c.forwardRef((e,t)=>{const n=P(T,e.__scopeDialog),r=c.useRef(null),a=N(t,n.contentRef,r);return c.useEffect(()=>{const o=r.current;if(o)return hr(o)},[]),b.jsx(Tt,{...e,ref:a,trapFocus:n.open,disableOutsidePointerEvents:!0,onCloseAutoFocus:A(e.onCloseAutoFocus,o=>{o.preventDefault(),n.triggerRef.current?.focus()}),onPointerDownOutside:A(e.onPointerDownOutside,o=>{const s=o.detail.originalEvent,i=s.button===0&&s.ctrlKey===!0;(s.button===2||i)&&o.preventDefault()}),onFocusOutside:A(e.onFocusOutside,o=>o.preventDefault())})}),br=c.forwardRef((e,t)=>{const n=P(T,e.__scopeDialog),r=c.useRef(!1),a=c.useRef(!1);return b.jsx(Tt,{...e,ref:t,trapFocus:!1,disableOutsidePointerEvents:!1,onCloseAutoFocus:o=>{e.onCloseAutoFocus?.(o),o.defaultPrevented||(r.current||n.triggerRef.current?.focus(),o.preventDefault()),r.current=!1,a.current=!1},onInteractOutside:o=>{e.onInteractOutside?.(o),o.defaultPrevented||(r.current=!0,o.detail.originalEvent.type==="pointerdown"&&(a.current=!0));const s=o.target;n.triggerRef.current?.contains(s)&&o.preventDefault(),o.detail.originalEvent.type==="focusin"&&a.current&&o.preventDefault()}})}),Tt=c.forwardRef((e,t)=>{const{__scopeDialog:n,trapFocus:r,onOpenAutoFocus:a,onCloseAutoFocus:o,...s}=e,i=P(T,n),y=c.useRef(null),l=N(t,y);return Rn(),b.jsxs(b.Fragment,{children:[b.jsx(pt,{asChild:!0,loop:!0,trapped:r,onMountAutoFocus:a,onUnmountAutoFocus:o,children:b.jsx(me,{role:"dialog",id:i.contentId,"aria-describedby":i.descriptionId,"aria-labelledby":i.titleId,"data-state":Ee(i.open),...s,ref:l,onDismiss:()=>i.onOpenChange(!1)})}),b.jsxs(b.Fragment,{children:[b.jsx(wr,{titleId:i.titleId}),b.jsx(xr,{contentRef:y,descriptionId:i.descriptionId})]})]})}),we="DialogTitle",Nt=c.forwardRef((e,t)=>{const{__scopeDialog:n,...r}=e,a=P(we,n);return b.jsx(_.h2,{id:a.titleId,...r,ref:t})});Nt.displayName=we;var Lt="DialogDescription",jt=c.forwardRef((e,t)=>{const{__scopeDialog:n,...r}=e,a=P(Lt,n);return b.jsx(_.p,{id:a.descriptionId,...r,ref:t})});jt.displayName=Lt;var It="DialogClose",Ft=c.forwardRef((e,t)=>{const{__scopeDialog:n,...r}=e,a=P(It,n);return b.jsx(_.button,{type:"button",...r,ref:t,onClick:A(e.onClick,()=>a.onOpenChange(!1))})});Ft.displayName=It;function Ee(e){return e?"open":"closed"}var zt="DialogTitleWarning",[Co,Ht]=Wt(zt,{contentName:T,titleName:we,docsSlug:"dialog"}),wr=({titleId:e})=>{const t=Ht(zt),n=`\`${t.contentName}\` requires a \`${t.titleName}\` for the component to be accessible for screen reader users.

If you want to hide the \`${t.titleName}\`, you can wrap it with our VisuallyHidden component.

For more information, see https://radix-ui.com/primitives/docs/components/${t.docsSlug}`;return c.useEffect(()=>{e&&(document.getElementById(e)||console.error(n))},[n,e]),null},Er="DialogDescriptionWarning",xr=({contentRef:e,descriptionId:t})=>{const r=`Warning: Missing \`Description\` or \`aria-describedby={undefined}\` for {${Ht(Er).contentName}}.`;return c.useEffect(()=>{const a=e.current?.getAttribute("aria-describedby");t&&a&&(document.getElementById(t)||console.warn(r))},[r,e,t]),null},So=St,Po=Ot,Oo=_t,Ro=Dt,_o=At,Do=Nt,Ao=jt,To=Ft;export{To as $,Tr as A,Rr as B,Yr as C,me as D,aa as E,sa as F,ha as G,go as H,Ca as I,oa as J,ia as K,Sa as L,Da as M,Sr as N,co as O,_ as P,jr as Q,Or as R,Xa as S,Va as T,ko as U,Ta as V,Ro as W,wo as X,_o as Y,Eo as Z,Qe as _,ve as a,ya as a$,Do as a0,Ao as a1,Oo as a2,So as a3,Mo as a4,Po as a5,Co as a6,hr as a7,Rn as a8,xt as a9,Xr as aA,Ya as aB,ta as aC,fo as aD,Fa as aE,Wa as aF,na as aG,$r as aH,Gr as aI,Dr as aJ,so as aK,za as aL,ca as aM,fa as aN,ba as aO,Ha as aP,Jr as aQ,_a as aR,Ea as aS,da as aT,eo as aU,ga as aV,Ia as aW,Oa as aX,Ar as aY,$a as aZ,Ua as a_,pt as aa,ae as ab,Vr as ac,Br as ad,ma as ae,bo as af,wa as ag,ra as ah,Qt as ai,oo as aj,Kr as ak,ho as al,ao as am,xa as an,Fr as ao,Ga as ap,lo as aq,_r as ar,qa as as,yo as at,Pa as au,va as av,ea as aw,io as ax,ja as ay,Ie as az,dn as b,La as b0,uo as b1,ka as b2,Qa as b3,Ba as b4,Zr as b5,mo as b6,Ur as b7,Ma as b8,po as b9,ua as ba,Ir as bb,Ja as bc,vo as bd,pa as be,Za as bf,to as bg,Lr as bh,Bt as c,Q as d,V as e,A as f,qe as g,q as h,Yt as i,Pr as j,Aa as k,Ra as l,ro as m,Na as n,Nr as o,no as p,zr as q,la as r,Qr as s,Ka as t,N as u,qr as v,Wr as w,Hr as x,xo as y,J as z};
