function l(i){return typeof i=="number"}function h(i){return typeof i=="string"}function T(i){return typeof i=="boolean"}function v(i){return Array.isArray(i)&&i.length===2&&i.every(l)}function y(i){return Array.isArray(i)&&i.length===3&&i.every(l)}function b(i){return Array.isArray(i)&&i.length===4&&i.every(l)}function E(i){let r=[".jpg",".jpeg",".png",".gif",".bmp",".webp",".svg",".tiff",".ico"],t=i.toLowerCase();return r.some(e=>t.endsWith(e))}function x(i){let r=[".mp4",".avi",".mov",".mkv",".wmv",".flv",".webm",".ts"],t=i.toLowerCase();return r.some(e=>t.endsWith(e))}function w(i){let r=i.getContext("webgl");if(!r)throw new Error("WebGL not supported");return r}function u(i,r){let{TEXTURE_2D:t,RGBA:e,UNSIGNED_BYTE:s}=i,o=new Uint8Array([0,0,0,255]);r?i.texImage2D(i.TEXTURE_2D,0,e,e,s,r):i.texImage2D(t,0,e,1,1,0,e,s,o);}function m(i,r){U(r.width)&&U(r.height)?i.generateMipmap(i.TEXTURE_2D):(i.texParameteri(i.TEXTURE_2D,i.TEXTURE_WRAP_S,i.CLAMP_TO_EDGE),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_WRAP_T,i.CLAMP_TO_EDGE),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_MIN_FILTER,i.LINEAR));}function U(i){return i>0&&(i&i-1)===0}function L(i){return typeof i=="string"?E(i)?{valid:true,type:"image"}:x(i)?{valid:true,type:"video"}:i==="webcam"?{valid:true,type:"webcam"}:!isNaN(Number(i))&&i.includes(".")?{valid:true,type:"float"}:!isNaN(Number(i))&&!i.includes(".")?{valid:true,type:"int"}:{valid:false,message:`Unknown uniform type: ${i}`}:Array.isArray(i)?i.length>=2&&i.length<=4?{valid:true,type:`vec${i.length}`}:{valid:false,message:`Invalid vector length: ${i.length}`}:typeof i=="number"?{valid:true,type:"float"}:typeof i=="boolean"?{valid:true,type:"bool"}:{valid:false,message:`Unknown uniform type: ${i}`}}var g=class{constructor(r,t,e={}){this.uniforms=new Map;this.staticTextures=new Map;this.dynamicTextures=new Map;this.gl=r,this.program=t,this.initializeDefaultUniforms(),this.initializeCustomUniforms(e);}initializeDefaultUniforms(){let r=this.gl.getUniformLocation(this.program,"u_time");r&&this.uniforms.set("u_time",{type:"float",location:r});let t=this.gl.getUniformLocation(this.program,"u_resolution");t&&this.uniforms.set("u_resolution",{type:"vec2",location:t});let e=this.gl.getUniformLocation(this.program,"u_mouse");e&&this.uniforms.set("u_mouse",{type:"vec2",location:e});}initializeCustomUniforms(r){for(let[t,e]of Object.entries(r)){let s=this.gl.getUniformLocation(this.program,`u_${t}`);if(!s)continue;let o=L(e);if(!o.valid){console.error(o.message);continue}this.uniforms.set(t,{type:o.type,location:s}),this.setUniformValue(t,e);}}setUniformValue(r,t){let e=this.uniforms.get(r);if(!e){console.warn(`Uniform ${r} not found`);return}let s=`u_${r}`,{type:o,location:n}=e;switch(o){case "float":l(t)?this.gl.uniform1f(n,t):console.warn(`Couldn't update ${s}, value must be a number`);break;case "vec2":v(t)?this.gl.uniform2fv(n,t):console.warn(`Couldn't update ${s}, value must be a Vec2`);break;case "vec3":y(t)?this.gl.uniform3fv(n,t):console.warn(`Couldn't update ${s}, value must be a Vec3`);break;case "vec4":b(t)?this.gl.uniform4fv(n,t):console.warn(`Couldn't update ${s}, value must be a Vec4`);break;case "int":l(t)?this.gl.uniform1i(n,t):console.warn(`Couldn't update ${s}, value must be a number`);break;case "bool":T(t)?this.gl.uniform1i(n,t?1:0):console.warn(`Couldn't update ${s}, value must be a boolean`);break;case "image":h(t)?this.loadStaticTexture(s,t):console.warn(`Couldn't update ${s}, value must be a string`);break;case "video":h(t)?this.loadDynamicTexture(s,t):console.warn(`Couldn't update ${s}, value must be a string`);break;case "webcam":this.loadDynamicTexture(s);break;default:console.warn(`Unsupported uniform type for ${s}`);}}getTextureUnit(){return this.staticTextures.size+this.dynamicTextures.size}getUniformLocation(r){let t=this.gl.getUniformLocation(this.program,r);if(!t)throw new Error(`Failed to retrieve unform loaction for ${r}`);return t}initializeTexture(r){let t=this.getUniformLocation(r),e=this.gl.createTexture(),s=this.getTextureUnit();return this.gl.uniform1i(t,s),this.gl.activeTexture(this.gl.TEXTURE0+s),this.gl.bindTexture(this.gl.TEXTURE_2D,e),u(this.gl),[e,s]}loadStaticTexture(r,t){let[e,s]=this.initializeTexture(r);this.staticTextures.set(r,{asset:e,unit:s});let o=new Image;o.crossOrigin="anonymous",o.onload=()=>{try{let n=this.staticTextures.get(r),c=`${r}_size`,a=this.gl.getUniformLocation(this.program,c);a&&n&&(this.uniforms.set(c,{type:"vec2",location:a}),this.gl.uniform2f(a,o.width,o.height),this.gl.activeTexture(this.gl.TEXTURE0+n.unit),this.gl.bindTexture(this.gl.TEXTURE_2D,n.asset),m(this.gl,o),u(this.gl,o));}catch(n){console.error(`Error loading texture ${r}:`,n);}},o.onerror=()=>{console.error(`Failed to load texture: ${t}`);},o.src=t;}async loadDynamicTexture(r,t){let e=document.createElement("video");if(e.muted=true,e.onloadeddata=()=>{let[s,o]=this.initializeTexture(r);this.dynamicTextures.set(r,{video:e,asset:s,unit:o}),e.play();try{let n=this.dynamicTextures.get(r),c=`${r}_size`,a=this.gl.getUniformLocation(this.program,c);a&&n&&(this.uniforms.set(c,{type:"vec2",location:a}),this.gl.uniform2f(a,e.videoWidth,e.videoHeight),this.gl.activeTexture(this.gl.TEXTURE0+n.unit),this.gl.bindTexture(this.gl.TEXTURE_2D,n.asset),m(this.gl,n.video),u(this.gl,n.video));}catch(n){console.error(`Error loading texture ${r}:`,n);}},e.onerror=()=>{console.error(`Failed to load texture: ${t}`);},t)e.loop=true,e.autoplay=true,e.playsInline=true,e.crossOrigin="anonymous",e.src=t,console.log(e);else {let s=await navigator.mediaDevices.getUserMedia({video:true});e.autoplay=true,e.srcObject=s;}}renderDynamicTextures(){for(let r of Array.from(this.dynamicTextures.values()))this.gl.activeTexture(this.gl.TEXTURE0+r.unit),this.gl.bindTexture(this.gl.TEXTURE_2D,r.asset),this.gl.texImage2D(this.gl.TEXTURE_2D,0,this.gl.RGBA,this.gl.RGBA,this.gl.UNSIGNED_BYTE,r.video);}destroy(){this.staticTextures.forEach(r=>this.gl.deleteTexture(r.asset)),this.staticTextures.clear();for(let r of Array.from(this.dynamicTextures.values())){let t=r.video.srcObject;t instanceof MediaStream?t.getTracks().forEach(e=>e.stop()):r.video.srcObject=null;}this.dynamicTextures.clear();}},_=g;var R=`
    attribute vec2 a_position;
    void main() {
      gl_Position = vec4(a_position, 0.0, 1.0);
    }
  `,C=`
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
  `;var d=new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]),f=class{constructor(r,t){this.container=r,this.canvas=document.createElement("canvas"),this.canvas.style.display="block",this.canvas.style.width=this.canvas.style.height="100%",this.container.appendChild(this.canvas),this.gl=w(this.canvas);let e=this.compileShader(this.gl.VERTEX_SHADER,R),s=this.compileShader(this.gl.FRAGMENT_SHADER,t??C);this.program=this.createProgram(e,s),this.gl.useProgram(this.program),this.createBuffer(d);let o=this.gl.getAttribLocation(this.program,"a_position");this.gl.enableVertexAttribArray(o),this.gl.vertexAttribPointer(o,2,this.gl.FLOAT,false,0,0);}compileShader(r,t){let e=this.gl.createShader(r);if(!e)throw new Error("Shader creation failed");if(this.gl.shaderSource(e,t),this.gl.compileShader(e),!this.gl.getShaderParameter(e,this.gl.COMPILE_STATUS))throw this.gl.deleteShader(e),new Error(`Shader compilation error: ${this.gl.getShaderInfoLog(e)}`);return e}createProgram(r,t){let e=this.gl.createProgram();if(!e)throw new Error("Error creating WebGL Program");if(this.gl.attachShader(e,r),this.gl.attachShader(e,t),this.gl.linkProgram(e),!this.gl.getProgramParameter(e,this.gl.LINK_STATUS))throw new Error(`Program linking error: ${this.gl.getProgramInfoLog(e)}`);return e}createBuffer(r){let t=this.gl.createBuffer();return this.gl.bindBuffer(this.gl.ARRAY_BUFFER,t),this.gl.bufferData(this.gl.ARRAY_BUFFER,r,this.gl.STATIC_DRAW),t}resizeCanvas(){let r=this.container.getBoundingClientRect();this.canvas.width=r.width,this.canvas.height=r.height;}destroy(){this.container.innerHTML="";}},S=f;var p=class extends S{constructor(t,e,s={}){super(t,e);this.mousePos=[0,0];this.controller=new AbortController;this.rafId=null;this.assets=new _(this.gl,this.program,s),this.handleResize(),this.addEventListeners();}render(t){this.gl.clearColor(0,0,0,1),this.gl.clear(this.gl.COLOR_BUFFER_BIT);let e=this.assets.uniforms.get("u_time");e&&this.gl.uniform1f(e.location,t*.001);let s=this.assets.uniforms.get("u_mouse");s&&this.gl.uniform2f(s.location,this.mousePos[0],this.mousePos[1]),this.assets.renderDynamicTextures(),this.gl.drawArrays(this.gl.TRIANGLES,0,d.length/2),requestAnimationFrame(o=>this.render(o));}handleResize(){super.resizeCanvas();let t=this.assets.uniforms.get("u_resolution")??null;if(!t){console.warn("Could not find resolution uniform (u_resolution) location when resizing canvas");return}this.gl.viewport(0,0,this.canvas.width,this.canvas.height),this.gl.uniform2f(t.location,this.canvas.width,this.canvas.height);}addEventListeners(){let{signal:t}=this.controller;this.canvas.addEventListener("mousemove",e=>{let s=this.canvas.getBoundingClientRect();this.mousePos[0]=e.clientX-s.left,this.mousePos[1]=s.height-(e.clientY-s.top);},{signal:t}),this.canvas.addEventListener("touchmove",e=>{let{clientX:s,clientY:o}=e.touches[0],n=this.canvas.getBoundingClientRect();this.mousePos[0]=s-n.left,this.mousePos[1]=n.height-(o-n.top);},{signal:t}),window.addEventListener("resize",()=>this.handleResize(),{signal:t});}play(){this.rafId=requestAnimationFrame(t=>this.render(t));}pause(){typeof this.rafId=="number"&&(cancelAnimationFrame(this.rafId),this.rafId=null);}updateUniform(t,e){this.assets.setUniformValue(t,e);}destroy(){super.destroy(),this.assets.destroy(),this.controller.abort();}};export{p as default};//# sourceMappingURL=index.js.map
//# sourceMappingURL=index.js.map