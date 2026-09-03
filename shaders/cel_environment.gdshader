// Cel-shading shader for Mythos Gates environment
// Godot 4 spatial shader with quantized lighting
shader_type spatial;

render_mode blend_mix, depth_draw_opaque, cull_back;

uniform vec4 albedo : source_color = vec4(0.15, 0.13, 0.11, 1.0);
uniform int light_steps : hint_range(2, 6) = 3;
uniform float rim_power : hint_range(0.5, 8.0) = 3.0;
uniform float rim_intensity : hint_range(0.0, 1.5) = 0.3;
uniform vec4 rim_color : source_color = vec4(0.6, 0.4, 0.15, 1.0);
uniform float roughness_val : hint_range(0.0, 1.0) = 0.8;
uniform float metallic_val : hint_range(0.0, 1.0) = 0.1;

void fragment() {
	ALBEDO = albedo.rgb;
	ROUGHNESS = roughness_val;
	METALLIC = metallic_val;
	
	// Rim lighting
	float rim = 1.0 - max(dot(NORMAL, VIEW), 0.0);
	rim = pow(rim, rim_power) * rim_intensity;
	ALBEDO += rim_color.rgb * rim;
}

void light() {
	// Cel-shading: quantize diffuse into discrete steps
	float NdotL = dot(NORMAL, LIGHT);
	float step_size = 1.0 / float(light_steps);
	
	if (NdotL > 0.0) {
		float cel = floor(NdotL * float(light_steps)) * step_size;
		cel = cel * 0.7 + 0.3;
		DIFFUSE_LIGHT += ALBEDO * LIGHT_COLOR * cel * ATTENUATION;
	} else {
		DIFFUSE_LIGHT += ALBEDO * LIGHT_COLOR * 0.15 * ATTENUATION;
	}
	
	// Quantized specular
	vec3 half_vec = normalize(LIGHT + VIEW);
	float NdotH = max(dot(NORMAL, half_vec), 0.0);
	float spec = step(0.5, pow(NdotH, 20.0));
	SPECULAR_LIGHT += LIGHT_COLOR * spec * ATTENUATION * metallic_val;
}
