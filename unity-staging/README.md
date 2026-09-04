# Unity Staging — Mythos Gates Game-Feel Top-3

Engine-agnostic mirror of the Godot implementation (scripts/gamefeel/). Same constants
(GameFeelConstants.cs = gamefeel_constants.gd), same mechanics:
1. Footstep weight — crack+bass at contact, dust ring-burst, 40ms-delayed camera trauma
2. Ground-slam shockwave — 0.45s windup (pull-back + FOV), 18m expanding ring, crack decals, ant-launch
3. Low titan camera — 1.6m eye height (never above the knee), 50 FOV, +8 up-tilt, trauma^2 shake

Spec: docs/GAMEFEEL_TOP3_SPEC.md. STAGED ONLY per BudE404 — no Unity project build, no
migrations, no spend without explicit go.
