export const blobVertexShader = /* glsl */ `
uniform float uTime;
uniform float uSpeed;
uniform float uFrequency;
uniform float uAmplitude;
uniform float uImageScale;

varying vec2 vMatcapUv;
varying vec2 vBlobUv;
varying vec3 vEyeVector;
varying vec3 vWorldNormal;

vec4 mod289(vec4 x) {
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}

float mod289(float x) {
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec4 permute(vec4 x) {
  return mod289(((x * 34.0) + 1.0) * x);
}

float permute(float x) {
  return mod289(((x * 34.0) + 1.0) * x);
}

vec4 taylorInvSqrt(vec4 r) {
  return 1.79284291400159 - 0.85373472095314 * r;
}

float taylorInvSqrt(float r) {
  return 1.79284291400159 - 0.85373472095314 * r;
}

vec4 grad4(float j, vec4 ip) {
  const vec4 ones = vec4(1.0, 1.0, 1.0, -1.0);
  vec4 p,s;

  p.xyz = floor( fract (vec3(j) * ip.xyz) * 7.0) * ip.z - 1.0;
  p.w = 1.5 - dot(abs(p.xyz), ones.xyz);
  s = vec4(lessThan(p, vec4(0.0)));
  p.xyz = p.xyz + (s.xyz*2.0 - 1.0) * s.www;

  return p;
}

#define F4 0.309016994374947451

float snoise(vec4 v) {
  const vec4  C = vec4( 0.138196601125011,
                        0.276393202250021,
                        0.414589803375032,
                       -0.447213595499958);

  vec4 i  = floor(v + dot(v, vec4(F4)) );
  vec4 x0 = v -   i + dot(i, C.xxxx);

  vec4 i0;
  vec3 isX = step( x0.yzw, x0.xxx );
  vec3 isYZ = step( x0.zww, x0.yyz );
  i0.x = isX.x + isX.y + isX.z;
  i0.yzw = 1.0 - isX;
  i0.y += isYZ.x + isYZ.y;
  i0.zw += 1.0 - isYZ.xy;
  i0.z += isYZ.z;
  i0.w += 1.0 - isYZ.z;

  vec4 i3 = clamp( i0, 0.0, 1.0 );
  vec4 i2 = clamp( i0-1.0, 0.0, 1.0 );
  vec4 i1 = clamp( i0-2.0, 0.0, 1.0 );

  vec4 x1 = x0 - i1 + C.xxxx;
  vec4 x2 = x0 - i2 + C.yyyy;
  vec4 x3 = x0 - i3 + C.zzzz;
  vec4 x4 = x0 + C.wwww;

  i = mod289(i);
  float j0 = permute( permute( permute( permute(i.w) + i.z) + i.y) + i.x);
  vec4 j1 = permute( permute( permute( permute (
             i.w + vec4(i1.w, i2.w, i3.w, 1.0 ))
           + i.z + vec4(i1.z, i2.z, i3.z, 1.0 ))
           + i.y + vec4(i1.y, i2.y, i3.y, 1.0 ))
           + i.x + vec4(i1.x, i2.x, i3.x, 1.0 ));

  vec4 ip = vec4(1.0/294.0, 1.0/49.0, 1.0/7.0, 0.0) ;

  vec4 p0 = grad4(j0,   ip);
  vec4 p1 = grad4(j1.x, ip);
  vec4 p2 = grad4(j1.y, ip);
  vec4 p3 = grad4(j1.z, ip);
  vec4 p4 = grad4(j1.w, ip);

  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
  p0 *= norm.x;
  p1 *= norm.y;
  p2 *= norm.z;
  p3 *= norm.w;
  p4 *= taylorInvSqrt(dot(p4,p4));

  vec3 m0 = max(0.6 - vec3(dot(x0,x0), dot(x1,x1), dot(x2,x2)), 0.0);
  vec2 m1 = max(0.6 - vec2(dot(x3,x3), dot(x4,x4)            ), 0.0);
  m0 = m0 * m0;
  m1 = m1 * m1;
  return 49.0 * ( dot(m0*m0, vec3( dot( p0, x0 ), dot( p1, x1 ), dot( p2, x2 )))
               + dot(m1*m1, vec2( dot( p3, x3 ), dot( p4, x4 ) ) ) ) ;
}

vec3 orthogonal(vec3 value) {
  return normalize(
    abs(value.x) > abs(value.z)
      ? vec3(-value.y, value.x, 0.0)
      : vec3(0.0, -value.z, value.y)
  );
}

vec3 distorted(vec3 point) {
  float noise = snoise(vec4(point * uFrequency, uTime * 0.1 * uSpeed));
  return point * (1.0 + noise * 0.05 * uAmplitude);
}

void main() {
  vec3 displaced = distorted(position);
  vec3 tangent1 = orthogonal(normal);
  vec3 tangent2 = normalize(cross(normal, tangent1));
  vec3 displaced1 = distorted(position + tangent1 * 0.005);
  vec3 displaced2 = distorted(position + tangent2 * 0.005);
  vec3 displacedNormal = normalize(
    cross(displaced1 - displaced, displaced2 - displaced)
  );

  vec4 basePosition = vec4(position, 1.0);
  vec3 viewPosition = normalize(vec3(modelViewMatrix * basePosition));
  vec3 viewNormal = normalize(normalMatrix * displacedNormal);
  vec3 reflection = reflect(viewPosition, viewNormal);
  float matcapScale = 2.0 * sqrt(
    reflection.x * reflection.x +
    reflection.y * reflection.y +
    (reflection.z + 1.0) * (reflection.z + 1.0)
  );
  vMatcapUv = reflection.xy / matcapScale + 0.5;

  vec4 worldCenter = modelMatrix * vec4(0.0, 0.0, 0.0, 1.0);
  vec4 viewCenter = viewMatrix * worldCenter;
  vec4 worldPosition = modelMatrix * vec4(displaced, 1.0);
  vec4 viewPos = viewMatrix * worldPosition;
  
  vec2 viewOffset = viewPos.xy - viewCenter.xy;
  vBlobUv = viewOffset / uImageScale + 0.5;

  vEyeVector = normalize(worldPosition.xyz - cameraPosition);
  vWorldNormal = normalize(mat3(modelMatrix) * displacedNormal);

  gl_Position = projectionMatrix * viewPos;
}
`;

export const blobFragmentShader = /* glsl */ `
uniform sampler2D uTexture;
uniform sampler2D uNextTexture;
uniform float uMixTexture;
uniform vec2 uResolution;
uniform vec2 uTextureSize;
uniform vec3 uReflectionColor;
uniform float uIor;
uniform float uLightFactor;
uniform float uImageScale;
uniform vec2 uImageOffset;

varying vec2 vMatcapUv;
varying vec2 vBlobUv;
varying vec3 vEyeVector;
varying vec3 vWorldNormal;

vec2 coverUv(vec2 uv) {
  float canvasAspect = uResolution.x / max(uResolution.y, 1.0);
  float textureAspect = uTextureSize.x / max(uTextureSize.y, 1.0);
  vec2 scale = canvasAspect > textureAspect
    ? vec2(1.0, textureAspect / canvasAspect)
    : vec2(canvasAspect / textureAspect, 1.0);
  return (uv - 0.5) * scale + 0.5;
}

float fresnel(vec3 eyeVector, vec3 worldNormal) {
  return pow(1.0 + dot(eyeVector, worldNormal), 3.0);
}

void main() {
  vec3 normal = normalize(vWorldNormal);
  vec3 eyeVector = normalize(vEyeVector);
  vec3 refracted = refract(eyeVector, normal, 1.0 / uIor);
  
  // Calculate UV for the still image inside the blob
  vec3 viewRefracted = (viewMatrix * vec4(refracted, 0.0)).xyz;
  
  // Add refraction to the UV. 2.5 is roughly the distance to the center.
  vec2 textureUv = vBlobUv + uImageOffset + (viewRefracted.xy * 2.5) / uImageScale;
  
  vec4 imageColor1 = texture2D(uTexture, textureUv);
  vec4 imageColor2 = texture2D(uNextTexture, textureUv);
  vec4 imageColor = mix(imageColor1, imageColor2, uMixTexture);
  
  // Mask out the whiteish background of the image
  float logoMask = smoothstep(0.12, 0.34, length(imageColor.rgb - vec3(0.96)));
  
  // Fade out logo mask near the edges to prevent clamp artifacts
  float distFromCenter = length(textureUv - 0.5);
  logoMask *= smoothstep(0.48, 0.45, distFromCenter);

  float edge = clamp(fresnel(eyeVector, normal), 0.0, 1.0);
  float matcapLight = smoothstep(0.05, 0.95, vMatcapUv.y) * 0.34 + 0.72;
  
  vec3 glassBaseColor = uReflectionColor * matcapLight;
  vec3 refractedLogoColor = imageColor.rgb * matcapLight;
  
  vec3 baseRefraction = mix(glassBaseColor, refractedLogoColor, logoMask);
  
  // Premium glass edge highlight
  vec3 color = mix(baseRefraction, vec3(1.0), edge * 0.65);
  color *= uLightFactor;

  // Transparent glass body with opaque logo and solid edges
  float alpha = mix(0.2 + edge * 0.7, 1.0, logoMask);

  gl_FragColor = vec4(color, alpha);
}
`;
