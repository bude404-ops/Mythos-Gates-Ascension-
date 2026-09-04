shader_type spatial;
// Shockwave ring — expanding faction-colored impact ring for TitanGroundSlam.
// Radial alpha: bright at leading edge, soft trailing falloff. Single uniform drive.
uniform vec3 faction_glow : source_color = vec3(0.55, 0.75, 1.0); // F002 ice-blue default
uniform float ring_sharpness : hint_range(0.05, 1.0) = 0.35;

void fragment() {
    float r = length(UV - vec2(0.5)) * 2.0;       // 0 center -> 1 edge
    float edge = smoothstep(1.0 - ring_sharpness, 1.0, r);
    float trail = (1.0 - smoothstep(0.0, 1.0, r)) * 0.25;
    float a = clamp(edge + trail, 0.0, 1.0);
    ALBEDO = faction_glow;
    ALPHA = a * 0.85;
    EMISSION = faction_glow * a;
}
