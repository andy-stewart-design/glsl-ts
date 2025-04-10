function l(i){return typeof i=="number"}function h(i){return typeof i=="string"}function T(i){return typeof i=="boolean"}function v(i){return Array.isArray(i)&&i.length===2&&i.every(l)}function y(i){return Array.isArray(i)&&i.length===3&&i.every(l)}function x(i){return Array.isArray(i)&&i.length===4&&i.every(l)}function E(i){let r=[".jpg",".jpeg",".png",".gif",".bmp",".webp",".svg",".tiff",".ico"],e=i.toLowerCase();return r.some(t=>e.endsWith(t))}function b(i){let r=[".mp4",".avi",".mov",".mkv",".wmv",".flv",".webm",".ts"],e=i.toLowerCase();return r.some(t=>e.endsWith(t))}function w(i){let r=i.getContext("webgl");if(!r)throw new Error("WebGL not supported");return r}function u(i,r){let{TEXTURE_2D:e,RGBA:t,UNSIGNED_BYTE:s}=i,o=new Uint8Array([0,0,0,255]);r?i.texImage2D(i.TEXTURE_2D,0,t,t,s,r):i.texImage2D(e,0,t,1,1,0,t,s,o);}function m(i,r){U(r.width)&&U(r.height)?i.generateMipmap(i.TEXTURE_2D):(i.texParameteri(i.TEXTURE_2D,i.TEXTURE_WRAP_S,i.CLAMP_TO_EDGE),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_WRAP_T,i.CLAMP_TO_EDGE),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_MIN_FILTER,i.LINEAR));}function U(i){return i>0&&(i&i-1)===0}function L(i){return typeof i=="string"?E(i)?{valid:true,type:"image"}:b(i)?{valid:true,type:"video"}:i==="webcam"?{valid:true,type:"webcam"}:!isNaN(Number(i))&&i.includes(".")?{valid:true,type:"float"}:!isNaN(Number(i))&&!i.includes(".")?{valid:true,type:"int"}:{valid:false,message:`Unknown uniform type: ${i}`}:Array.isArray(i)?i.length>=2&&i.length<=4?{valid:true,type:`vec${i.length}`}:{valid:false,message:`Invalid vector length: ${i.length}`}:typeof i=="number"?{valid:true,type:"float"}:typeof i=="boolean"?{valid:true,type:"bool"}:{valid:false,message:`Unknown uniform type: ${i}`}}var f=class{constructor(r,e,t,s){this.uniforms=new Map;this.staticTextures=new Map;this.dynamicTextures=new Map;this.uniformPrefix="u_";this.gl=r,this.program=e,this.uniformPrefix=s,this.initializeDefaultUniforms(),this.initializeCustomUniforms(t);}initializeDefaultUniforms(){let r=this.gl.getUniformLocation(this.program,`${this.uniformPrefix}time`);r&&this.uniforms.set(`${this.uniformPrefix}time`,{type:"float",location:r});let e=this.gl.getUniformLocation(this.program,`${this.uniformPrefix}resolution`);e&&this.uniforms.set(`${this.uniformPrefix}resolution`,{type:"vec2",location:e});let t=this.gl.getUniformLocation(this.program,`${this.uniformPrefix}mouse`);t&&this.uniforms.set(`${this.uniformPrefix}mouse`,{type:"vec2",location:t});}initializeCustomUniforms(r){for(let[e,t]of Object.entries(r)){let s=this.gl.getUniformLocation(this.program,`${this.uniformPrefix}${e}`);if(!s){console.warn(`Couldn't init uniform (${e}). Did you set it?`);continue}let o=L(t);if(!o.valid){console.error(o.message);continue}this.uniforms.set(e,{type:o.type,location:s}),this.setUniformValue(e,t);}}setUniformValue(r,e){let t=this.uniforms.get(r);if(!t){console.warn(`Uniform ${r} not found`);return}let s=`${this.uniformPrefix}${r}`,{type:o,location:n}=t;switch(o){case "float":l(e)?this.gl.uniform1f(n,e):console.warn(`Couldn't update ${s}, value must be a number`);break;case "vec2":v(e)?this.gl.uniform2fv(n,e):console.warn(`Couldn't update ${s}, value must be a Vec2`);break;case "vec3":y(e)?this.gl.uniform3fv(n,e):console.warn(`Couldn't update ${s}, value must be a Vec3`);break;case "vec4":x(e)?this.gl.uniform4fv(n,e):console.warn(`Couldn't update ${s}, value must be a Vec4`);break;case "int":l(e)?this.gl.uniform1i(n,e):console.warn(`Couldn't update ${s}, value must be a number`);break;case "bool":T(e)?this.gl.uniform1i(n,e?1:0):console.warn(`Couldn't update ${s}, value must be a boolean`);break;case "image":h(e)?this.loadStaticTexture(s,e):console.warn(`Couldn't update ${s}, value must be a string`);break;case "video":h(e)?this.loadDynamicTexture(s,e):console.warn(`Couldn't update ${s}, value must be a string`);break;case "webcam":this.loadDynamicTexture(s);break;default:console.warn(`Unsupported uniform type for ${s}`);}}getTextureUnit(){return this.staticTextures.size+this.dynamicTextures.size}getUniformLocation(r){let e=this.gl.getUniformLocation(this.program,r);if(!e)throw new Error(`Failed to retrieve unform loaction for ${r}`);return e}initializeTexture(r){let e=this.getUniformLocation(r),t=this.gl.createTexture(),s=this.getTextureUnit();return this.gl.uniform1i(e,s),this.gl.activeTexture(this.gl.TEXTURE0+s),this.gl.bindTexture(this.gl.TEXTURE_2D,t),u(this.gl),[t,s]}loadStaticTexture(r,e){let[t,s]=this.initializeTexture(r);this.staticTextures.set(r,{asset:t,unit:s});let o=new Image;o.crossOrigin="anonymous",o.onload=()=>{try{let n=this.staticTextures.get(r),c=`${r}_size`,a=this.gl.getUniformLocation(this.program,c);a&&n&&(this.uniforms.set(c,{type:"vec2",location:a}),this.gl.uniform2f(a,o.width,o.height),this.gl.activeTexture(this.gl.TEXTURE0+n.unit),this.gl.bindTexture(this.gl.TEXTURE_2D,n.asset),m(this.gl,o),u(this.gl,o));}catch(n){console.error(`Error loading texture ${r}:`,n);}},o.onerror=()=>{console.error(`Failed to load texture: ${e}`);},o.src=e;}async loadDynamicTexture(r,e){let t=document.createElement("video");if(t.muted=true,t.autoplay=true,t.playsInline=true,t.onloadeddata=()=>{let[s,o]=this.initializeTexture(r);this.dynamicTextures.set(r,{video:t,asset:s,unit:o}),t.play();try{let n=this.dynamicTextures.get(r),c=`${r}_size`,a=this.gl.getUniformLocation(this.program,c);a&&n&&(this.uniforms.set(c,{type:"vec2",location:a}),this.gl.uniform2f(a,t.videoWidth,t.videoHeight),this.gl.activeTexture(this.gl.TEXTURE0+n.unit),this.gl.bindTexture(this.gl.TEXTURE_2D,n.asset),m(this.gl,n.video),u(this.gl,n.video));}catch(n){console.error(`Error loading texture ${r}:`,n);}},t.onerror=()=>{console.error(`Failed to load texture: ${e}`);},e)t.loop=true,t.crossOrigin="anonymous",t.src=e,console.log(t);else {let s=await navigator.mediaDevices.getUserMedia({video:true});t.srcObject=s;}}renderDynamicTextures(){for(let r of Array.from(this.dynamicTextures.values()))this.gl.activeTexture(this.gl.TEXTURE0+r.unit),this.gl.bindTexture(this.gl.TEXTURE_2D,r.asset),this.gl.texImage2D(this.gl.TEXTURE_2D,0,this.gl.RGBA,this.gl.RGBA,this.gl.UNSIGNED_BYTE,r.video);}destroy(){this.staticTextures.forEach(r=>this.gl.deleteTexture(r.asset)),this.staticTextures.clear();for(let r of Array.from(this.dynamicTextures.values())){let e=r.video.srcObject;e instanceof MediaStream?e.getTracks().forEach(t=>t.stop()):r.video.srcObject=null;}this.dynamicTextures.clear();}},R=f;var P=`
    attribute vec2 a_position;
    void main() {
      gl_Position = vec4(a_position, 0.0, 1.0);
    }
  `,_=`
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
  `;var d=new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]),g=class{constructor(r,e){this.container=r,this.canvas=document.createElement("canvas"),this.canvas.style.display="block",this.canvas.style.width=this.canvas.style.height="100%",this.container.appendChild(this.canvas),this.gl=w(this.canvas);let t=this.compileShader(this.gl.VERTEX_SHADER,P),s=this.compileShader(this.gl.FRAGMENT_SHADER,e??_);this.program=this.createProgram(t,s),this.gl.useProgram(this.program),this.createBuffer(d);let o=this.gl.getAttribLocation(this.program,"a_position");this.gl.enableVertexAttribArray(o),this.gl.vertexAttribPointer(o,2,this.gl.FLOAT,false,0,0);}compileShader(r,e){let t=this.gl.createShader(r);if(!t)throw new Error("Shader creation failed");if(this.gl.shaderSource(t,e),this.gl.compileShader(t),!this.gl.getShaderParameter(t,this.gl.COMPILE_STATUS))throw this.gl.deleteShader(t),new Error(`Shader compilation error: ${this.gl.getShaderInfoLog(t)}`);return t}createProgram(r,e){let t=this.gl.createProgram();if(!t)throw new Error("Error creating WebGL Program");if(this.gl.attachShader(t,r),this.gl.attachShader(t,e),this.gl.linkProgram(t),!this.gl.getProgramParameter(t,this.gl.LINK_STATUS))throw new Error(`Program linking error: ${this.gl.getProgramInfoLog(t)}`);return t}createBuffer(r){let e=this.gl.createBuffer();return this.gl.bindBuffer(this.gl.ARRAY_BUFFER,e),this.gl.bufferData(this.gl.ARRAY_BUFFER,r,this.gl.STATIC_DRAW),e}resizeCanvas(){let r=this.container.getBoundingClientRect();this.canvas.width=r.width,this.canvas.height=r.height;}destroy(){this.container.innerHTML="";}},S=g;var p=class extends S{constructor({container:e,frag:t,uniforms:s={},uniformPrefix:o="u_"}){super(e,t);this.mousePos=[0,0];this.controller=new AbortController;this.rafId=null;this.assets=new R(this.gl,this.program,s,o),this.handleResize(),this.addEventListeners();}render(e){this.gl.clearColor(0,0,0,1),this.gl.clear(this.gl.COLOR_BUFFER_BIT);let t=this.assets.uniforms.get(`${this.assets.uniformPrefix}time`);t&&this.gl.uniform1f(t.location,e*.001);let s=this.assets.uniforms.get(`${this.assets.uniformPrefix}mouse`);s&&this.gl.uniform2f(s.location,this.mousePos[0],this.mousePos[1]),this.assets.renderDynamicTextures(),this.gl.drawArrays(this.gl.TRIANGLES,0,d.length/2),requestAnimationFrame(o=>this.render(o));}handleResize(){super.resizeCanvas();let e=this.assets.uniforms.get(`${this.assets.uniformPrefix}resolution`)??null;if(!e){console.warn(`Could not find resolution uniform (${this.assets.uniformPrefix}resolution) location when resizing canvas`);return}this.gl.viewport(0,0,this.canvas.width,this.canvas.height),this.gl.uniform2f(e.location,this.canvas.width,this.canvas.height);}addEventListeners(){let{signal:e}=this.controller;this.canvas.addEventListener("mousemove",t=>{let s=this.canvas.getBoundingClientRect();this.mousePos[0]=t.clientX-s.left,this.mousePos[1]=s.height-(t.clientY-s.top);},{signal:e}),this.canvas.addEventListener("touchmove",t=>{let{clientX:s,clientY:o}=t.touches[0],n=this.canvas.getBoundingClientRect();this.mousePos[0]=s-n.left,this.mousePos[1]=n.height-(o-n.top);},{signal:e}),window.addEventListener("resize",()=>this.handleResize(),{signal:e});}play(){this.rafId=requestAnimationFrame(e=>this.render(e));}pause(){typeof this.rafId=="number"&&(cancelAnimationFrame(this.rafId),this.rafId=null);}updateUniform(e,t){this.assets.setUniformValue(e,t);}destroy(){super.destroy(),this.assets.destroy(),this.controller.abort();}};export{p as default};//# sourceMappingURL=index.js.map
//# sourceMappingURL=index.js.map