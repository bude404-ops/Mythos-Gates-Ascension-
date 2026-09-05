// Ground-slam shockwave ring — unlit emissive expanding ring (placeholder-grade, URP-safe via ShaderLab fallback)
Shader "MythosGates/ShockwaveRing"
{
    Properties
    {
        _RingColor ("Ring Color", Color) = (1.0, 0.62, 0.25, 1.0)
        _RingWidth ("Ring Width", Range(0.02, 0.5)) = 0.08
        _Progress ("Expand Progress 0-1", Range(0,1)) = 0.0
    }
    SubShader
    {
        Tags { "RenderType"="Transparent" "Queue"="Transparent" "RenderPipeline"="UniversalPipeline" }
        Blend SrcAlpha OneMinusSrcAlpha
        ZWrite Off
        Pass
        {
            HLSLPROGRAM
            #pragma vertex vert
            #pragma fragment frag
            #include "UnityCG.cginc"

            struct Attributes { float4 positionOS : POSITION; float2 uv : TEXCOORD0; };
            struct Varyings  { float4 positionCS : SV_POSITION; float2 uv : TEXCOORD0; };

            float4 _RingColor; float _RingWidth; float _Progress;

            Varyings vert(Attributes IN)
            {
                Varyings OUT;
                OUT.positionCS = UnityObjectToClipPos(IN.positionOS);
                OUT.uv = IN.uv * 2.0 - 1.0;   // -1..1 plane coords
                return OUT;
            }

            float4 frag(Varyings IN) : SV_Target
            {
                float dist = length(IN.uv);
                float ringAt = _Progress;                       // ring edge radius
                float edge = smoothstep(_RingWidth, 0.0, abs(dist - ringAt));
                float fade = 1.0 - _Progress;                   // dims as it expands
                return float4(_RingColor.rgb, edge * fade * 0.9);
            }
            ENDHLSL
        }
    }
}
