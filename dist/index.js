function u(e){return typeof e=="number"}function f(e){return typeof e=="string"}function y(e){return typeof e=="boolean"}function x(e){return Array.isArray(e)&&e.length===2&&e.every(u)}function E(e){return Array.isArray(e)&&e.length===3&&e.every(u)}function b(e){return Array.isArray(e)&&e.length===4&&e.every(u)}function U(e){let r=[".jpg",".jpeg",".png",".gif",".bmp",".webp",".svg",".tiff",".ico"],t=e.toLowerCase();return r.some(i=>t.endsWith(i))}function S(e){let r=[".mp4",".avi",".mov",".mkv",".wmv",".flv",".webm",".ts"],t=e.toLowerCase();return r.some(i=>t.endsWith(i))}function w(e){let r=e.getContext("webgl2");if(!r)throw new Error("WebGL not supported");return r}function m(e,r){let{TEXTURE_2D:t,RGBA:i,UNSIGNED_BYTE:s}=e,n=new Uint8Array([0,0,0,255]);r?e.texImage2D(e.TEXTURE_2D,0,i,i,s,r):e.texImage2D(t,0,i,1,1,0,i,s,n)}function d(e,r){L(r.width)&&L(r.height)?e.generateMipmap(e.TEXTURE_2D):(e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.LINEAR))}function L(e){return e>0&&(e&e-1)===0}function h(e){return typeof e=="string"?U(e)?{valid:!0,type:"image",value:e}:S(e)?{valid:!0,type:"video",value:e}:e==="webcam"?{valid:!0,type:"webcam",value:e}:!isNaN(Number(e))&&e.includes(".")?{valid:!0,type:"float",value:parseFloat(e)}:!isNaN(Number(e))&&!e.includes(".")?{valid:!0,type:"int",value:parseInt(e)}:{valid:!1,message:`Unknown uniform type: ${e}`}:Array.isArray(e)?e.length>=2&&e.length<=4?{valid:!0,type:`vec${e.length}`,value:e}:{valid:!1,message:`Invalid vector length: ${e.length}`}:typeof e=="number"?{valid:!0,type:"float",value:e}:typeof e=="boolean"?{valid:!0,type:"bool",value:e}:{valid:!1,message:`Unknown uniform type: ${e}`}}function c(e,r){return`[GLSL.TS]: Couldn't update ${e}, value must be a ${r}`}var g=class{constructor(r,t,i,s){this.uniforms=new Map;this.staticTextures=new Map;this.dynamicTextures=new Map;this.uniformPrefix="u_";this.gl=r,this.program=t,this.uniformPrefix=s,this.initializeDefaultUniforms(),this.initializeCustomUniforms(i)}initializeDefaultUniforms(){let r=this.gl.getUniformLocation(this.program,`${this.uniformPrefix}time`);r&&this.uniforms.set(`${this.uniformPrefix}time`,{type:"float",location:r});let t=this.gl.getUniformLocation(this.program,`${this.uniformPrefix}resolution`);t&&this.uniforms.set(`${this.uniformPrefix}resolution`,{type:"vec2",location:t});let i=this.gl.getUniformLocation(this.program,`${this.uniformPrefix}mouse`);i&&this.uniforms.set(`${this.uniformPrefix}mouse`,{type:"vec2",location:i})}initializeCustomUniforms(r){for(let[t,i]of Object.entries(r)){let s=this.gl.getUniformLocation(this.program,`${this.uniformPrefix}${t}`);if(!s){console.warn(`[GLSL.TS]: couldn't init uniform (${t}). Most likely, it was not used in shader and was optimized out.`);continue}let n=h(i);if(!n.valid){console.error(n.message);continue}this.uniforms.set(t,{type:n.type,location:s}),this.setUniformValue(t,n.value)}}setUniformValue(r,t){let i=this.uniforms.get(r);if(!i){console.warn(`[GLSL.TS]: uniform ${r} not found`);return}let s=`${this.uniformPrefix}${r}`,{type:n,location:o}=i;switch(n){case"float":u(t)?this.gl.uniform1f(o,t):console.warn(c(s,"number"));break;case"vec2":x(t)?this.gl.uniform2fv(o,t):console.warn(c(s,"Vec2"));break;case"vec3":E(t)?this.gl.uniform3fv(o,t):console.warn(c(s,"Vec3"));break;case"vec4":b(t)?this.gl.uniform4fv(o,t):console.warn(c(s,"Vec4"));break;case"int":u(t)?this.gl.uniform1i(o,t):console.warn(c(s,"number"));break;case"bool":y(t)?this.gl.uniform1i(o,t?1:0):console.warn(c(s,"boolean"));break;case"image":f(t)?this.loadStaticTexture(s,t):console.warn(c(s,"string"));break;case"video":f(t)?this.loadDynamicTexture(s,t):console.warn(c(s,"string"));break;case"webcam":this.loadDynamicTexture(s);break;default:console.warn(`Unsupported uniform type for ${s}`)}}getTextureUnit(){return this.staticTextures.size+this.dynamicTextures.size}getUniformLocation(r){let t=this.gl.getUniformLocation(this.program,r);if(!t)throw new Error(`Failed to retrieve unform loaction for ${r}`);return t}initializeTexture(r){let t=this.getUniformLocation(r),i=this.gl.createTexture(),s=this.getTextureUnit();return this.gl.uniform1i(t,s),this.gl.activeTexture(this.gl.TEXTURE0+s),this.gl.bindTexture(this.gl.TEXTURE_2D,i),m(this.gl),[i,s]}loadStaticTexture(r,t){let[i,s]=this.initializeTexture(r);this.staticTextures.set(r,{asset:i,unit:s});let n=new Image;n.crossOrigin="anonymous",n.onload=()=>{try{let o=this.staticTextures.get(r),a=`${r}_size`,l=this.gl.getUniformLocation(this.program,a);if(o){l?(this.uniforms.set(a,{type:"vec2",location:l}),this.gl.uniform2f(l,n.width,n.height)):console.info(`[GLSL.TS]: Could not set "${a}" Uniform. Most likely, it was not used in shader and was optimized out.`),this.gl.activeTexture(this.gl.TEXTURE0+o.unit),this.gl.bindTexture(this.gl.TEXTURE_2D,o.asset),this.gl.pixelStorei(this.gl.UNPACK_FLIP_Y_WEBGL,!0),d(this.gl,n),m(this.gl,n);let I=this.getUniformLocation(r);this.gl.uniform1i(I,o.unit)}else console.warn(`[GLSL.TS]: no texture found for name: ${r}`)}catch(o){console.error(`[GLSL.TS]: error loading texture ${r}:`,o)}},n.onerror=o=>{console.error(`[GLSL.TS]: error loading texture ${r}:`,o)},n.src=t}async loadDynamicTexture(r,t){let i=document.createElement("video");if(i.muted=!0,i.autoplay=!0,i.playsInline=!0,i.onloadeddata=()=>{let[s,n]=this.initializeTexture(r);this.dynamicTextures.set(r,{video:i,asset:s,unit:n}),i.play();try{let o=this.dynamicTextures.get(r),a=`${r}_size`,l=this.gl.getUniformLocation(this.program,a);this.gl.pixelStorei(this.gl.UNPACK_FLIP_Y_WEBGL,!0),o&&(l?(this.uniforms.set(a,{type:"vec2",location:l}),this.gl.uniform2f(l,i.videoWidth,i.videoHeight)):console.info(`[GLSL.TS]: Could not set "${a}" Uniform. Most likely, it was not used in shader and was optimized out.`),this.gl.activeTexture(this.gl.TEXTURE0+o.unit),this.gl.bindTexture(this.gl.TEXTURE_2D,o.asset),d(this.gl,o.video),m(this.gl,o.video))}catch(o){console.error(`Error loading texture ${r}:`,o)}},i.onerror=()=>{console.error(`Failed to load texture: ${t}`)},t)i.loop=!0,i.crossOrigin="anonymous",i.src=t;else{let s=await navigator.mediaDevices.getUserMedia({video:!0});i.srcObject=s}}renderDynamicTextures(){for(let r of Array.from(this.dynamicTextures.values()))this.gl.activeTexture(this.gl.TEXTURE0+r.unit),this.gl.bindTexture(this.gl.TEXTURE_2D,r.asset),this.gl.texImage2D(this.gl.TEXTURE_2D,0,this.gl.RGBA,this.gl.RGBA,this.gl.UNSIGNED_BYTE,r.video)}destroy(){this.staticTextures.forEach(r=>this.gl.deleteTexture(r.asset)),this.staticTextures.clear();for(let r of Array.from(this.dynamicTextures.values())){let t=r.video.srcObject;t instanceof MediaStream?t.getTracks().forEach(i=>i.stop()):r.video.srcObject=null}this.dynamicTextures.clear()}},_=g;var P=`
    attribute vec2 a_position;
    void main() {
      gl_Position = vec4(a_position, 0.0, 1.0);
    }
  `,R=`#version 300 es
    in vec2 a_position;
    
    void main() {
      gl_Position = vec4(a_position, 0.0, 1.0);
    }`,C=`
    #ifdef GL_ES
    precision mediump float;
    #endif

    uniform float u_time;
    uniform vec2 u_resolution;
    uniform vec2 u_mouse;

    void main() {
      vec2 st = gl_FragCoord.xy / u_resolution;
      vec2 mouse = u_mouse / u_resolution;

      // Distance from the mouse
      float dist = distance(st, mouse);
      
      // Color based on time and distance
      vec3 color = vec3(0.5 + 0.5 * cos(u_time + dist * 10.0), dist, st.x);
      gl_FragColor = vec4(color, 1.0);
    }
  `,A=`#version 300 es
    precision mediump float;

    uniform float u_time;
    uniform vec2 u_resolution;
    uniform vec2 u_mouse;

    void main() {
      vec2 st = gl_FragCoord.xy / u_resolution;
      vec2 mouse = u_mouse / u_resolution;

      // Distance from the mouse
      float dist = distance(st, mouse);
      
      // Color based on time and distance
      vec3 color = vec3(0.5 + 0.5 * cos(u_time + dist * 10.0), dist, st.x);
      gl_FragColor = vec4(color, 1.0);
    }
  `;var T=new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]),p=class{constructor(r,t,i){this.container=r,this.canvas=document.createElement("canvas"),this.canvas.style.display="block",this.canvas.style.width=this.canvas.style.height="100%",this.container.appendChild(this.canvas),this.gl=w(this.canvas),this.gl.clearColor(0,0,0,1),"drawingBufferColorSpace"in this.gl&&(this.gl.drawingBufferColorSpace="display-p3"),"unpackColorSpace"in this.gl&&(this.gl.unpackColorSpace="display-p3");let s=t===3?A:C,n=t===3?R:P,o=this.compileShader(n,"vert"),a=this.compileShader(i??s,"frag");this.program=this.createProgram(o,a),this.gl.useProgram(this.program),this.createBuffer(T);let l=this.gl.getAttribLocation(this.program,"a_position");this.gl.enableVertexAttribArray(l),this.gl.vertexAttribPointer(l,2,this.gl.FLOAT,!1,0,0)}compileShader(r,t){let i=this.gl.createShader(t==="frag"?this.gl.FRAGMENT_SHADER:this.gl.VERTEX_SHADER);if(!i)throw new Error("Shader creation failed");if(this.gl.shaderSource(i,r),this.gl.compileShader(i),!this.gl.getShaderParameter(i,this.gl.COMPILE_STATUS)){let s=`Shader compilation error: ${this.gl.getShaderInfoLog(i)}`;throw this.gl.deleteShader(i),new Error(s)}return i}createProgram(r,t){let i=this.gl.createProgram();if(this.gl.attachShader(i,r),this.gl.attachShader(i,t),this.gl.linkProgram(i),!this.gl.getProgramParameter(i,this.gl.LINK_STATUS))throw new Error(`Program linking error: ${this.gl.getProgramInfoLog(i)}`);return i}createBuffer(r){let t=this.gl.createBuffer();return this.gl.bindBuffer(this.gl.ARRAY_BUFFER,t),this.gl.bufferData(this.gl.ARRAY_BUFFER,r,this.gl.STATIC_DRAW),t}resizeCanvas(){let r=this.container.getBoundingClientRect();this.canvas.width=r.width,this.canvas.height=r.height}destroy(){this.container.innerHTML=""}},V=p;var v=class extends V{constructor({container:t,frag:i,uniforms:s={},uniformPrefix:n="u_",glVersion:o=3}){super(t,o,i);this.mousePos=[0,0];this.controller=new AbortController;this.rafId=null;this.startTime=null;this.pauseStartTime=null;this.lastRenderTime=0;this.totalPausedTime=0;this.assets=new _(this.gl,this.program,s,n),this.handleResize(),this.addEventListeners()}render(t,i=!0){if(this.startTime===null)return;this.gl.clear(this.gl.COLOR_BUFFER_BIT),this.lastRenderTime=t;let s=this.assets.uniforms.get(`${this.assets.uniformPrefix}time`);if(s){let a=t-this.totalPausedTime-this.startTime;this.gl.uniform1f(s.location,a*.001)}let n=this.assets.uniforms.get(`${this.assets.uniformPrefix}mouse`);n&&this.gl.uniform2f(n.location,this.mousePos[0],this.mousePos[1]),this.assets.renderDynamicTextures(),this.gl.drawArrays(this.gl.TRIANGLES,0,T.length/2),i&&(this.rafId=requestAnimationFrame(o=>this.render(o)))}handleResize(){super.resizeCanvas();let t=this.assets.uniforms.get(`${this.assets.uniformPrefix}resolution`)??null;if(!t){console.warn(`Could not find resolution uniform (${this.assets.uniformPrefix}resolution) location when resizing canvas`);return}this.gl.viewport(0,0,this.canvas.width,this.canvas.height),this.gl.uniform2f(t.location,this.canvas.width,this.canvas.height),this.render(this.lastRenderTime,!1)}addEventListeners(){let{signal:t}=this.controller;this.canvas.addEventListener("mousemove",i=>{let s=this.canvas.getBoundingClientRect();this.mousePos[0]=i.clientX-s.left,this.mousePos[1]=s.height-(i.clientY-s.top)},{signal:t}),this.canvas.addEventListener("touchmove",i=>{let{clientX:s,clientY:n}=i.touches[0],o=this.canvas.getBoundingClientRect();this.mousePos[0]=s-o.left,this.mousePos[1]=o.height-(n-o.top)},{signal:t}),window.addEventListener("resize",()=>this.handleResize(),{signal:t})}play(t=!0){this.paused&&(console.log(this.pauseStartTime),this.pauseStartTime!==null?(this.totalPausedTime+=performance.now()-this.pauseStartTime,this.pauseStartTime=null):this.totalPausedTime=performance.now(),this.startTime===null&&(this.startTime=performance.now()),this.assets.dynamicTextures.size>0&&this.assets.dynamicTextures.forEach(i=>{i.video.play()}),t?this.rafId=requestAnimationFrame(i=>this.render(i,t)):this.render(performance.now(),t))}pause(){typeof this.rafId!="number"||this.paused||(this.pauseStartTime=performance.now(),cancelAnimationFrame(this.rafId),this.rafId=null,this.assets.dynamicTextures.size>0&&this.assets.dynamicTextures.forEach(t=>{t.video.pause()}))}updateUniform(t,i){let s=h(i);if(!s.valid){console.warn(s.message);return}this.assets.setUniformValue(t,s.value)}destroy(){super.destroy(),this.assets.destroy(),this.controller.abort()}get paused(){return this.rafId===null}};export{v as default};
//# sourceMappingURL=index.js.map