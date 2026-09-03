// Cel-shading shader for Mythos Gates
// Creates a stylized, hand-drawn look with hard light steps
shader_type spatial;

render_mode blend_mix, depth_draw_opaque, cull_back;

group_uniforms base;
uniform vec4 albedo : source_color = vec4(0.5, 0.4, 0.3, 1.0);
uniform float metallic : hint_range(0.0, 1.0) = 0.5;
uniform float roughness : hint_range(0.0, 1.0) = 0.6;
uniform vec4 emission : source_color = vec4(0.0, 0.0, 0.0, 1.0);
uniform float emission_energy : hint_range(0.0, 10.0) = 0.0;

group_uniforms cel;
uniform int light_steps : hint_range(2, 8) = 3;
uniform float rim_power : hint_range(0.0, 10.0) = 2.0;
uniform float rim_intensity : hint_range(0.0, 2.0) = 0.5;
uniform vec4 rim_color : source_color = vec4(0.8, 0.6, 0.2, 1.0);
uniform float outline_width : hint_range(0.0, 0.01) = 0.002;
uniform vec4 outline_color : source_color = vec4(0.05, 0.03, 0.02, 1.0);

void fragment() {
	vec3 normal = NORMAL;
	vec3 view_dir = VIEW;
	vec3 light_dir = LIGHT;
	
	// Diffuse lighting with cel steps
	float NdotL = dot(normal, light_dir);
	NdotL = max(NdotL, 0.0);
	
	// Quantize the light into discrete steps
	float step_size = 1.0 / float(light_steps);
	float cel_light = floor(NdotL * float(light_steps)) * step_size;
	
	// Smooth the transitions slightly
	cel_light = mix(cel_light, cel_light + step_size * 0.5, smoothstep(0.0, step_size * 0.3, fract(NdotL * float(light_steps))));
	
	// Apply albedo with cel lighting
	vec3 diffuse = albedo.rgb * (cel_light * 0.7 + 0.3);
	
	// Specular with cel quantization
	vec3 half_vec = normalize(light_dir + view_dir);
	float NdotH = max(dot(normal, half_vec), 0.0);
	float spec = pow(NdotH, mix(20.0, 2.0, roughness));
	spec = step(0.5, spec) * metallic;
	vec3 specular = vec3(spec);
	
	// Rim lighting for dramatic edges
	float rim = 1.0 - max(dot(normal, view_dir), 0.0);
	rim = pow(rim, rim_power);
	vec3 rim_light = rim_color.rgb * rim * rim_intensity;
	
	// Emission
	vec3 emi = emission.rgb * emission_energy;
	
	// Combine all lighting
	vec3 final_color = diffuse + specular + rim_light + emi;
	
	// Outline (using view-space normal edge detection)
	float edge = 1.0 - max(dot(normal, view_dir), 0.0);
	edge = smoothstep(0.95, 1.0, edge);
	final_color = mix(final_color, outline_color.rgb, edge * 0.5);
	
	ALBEDO = final_color;
	ROUGHNESS = roughness;
	METALLIC = metallic;
}
