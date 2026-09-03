extends Node3D

# Procedural Dungeon Generator — uses standard materials for web compatibility

@export var grid_width: int = 20
@export var grid_height: int = 20
@export var cell_size: float = 4.0
@export var wall_height: float = 4.0
@export var max_rooms: int = 8
@export var min_room_size: int = 3
@export var max_room_size: int = 7

var grid: Array = []

var floor_mat: StandardMaterial3D
var wall_mat: StandardMaterial3D
var pillar_mat: StandardMaterial3D

func _ready():
	print("Dungeon: _ready() called")
	_create_materials()
	_init_grid()
	_generate_rooms()
	_generate_corridors()
	_build_meshes()
	print("Dungeon: Generated ", _count_floor_cells(), " floor cells")

func _create_materials():
	floor_mat = StandardMaterial3D.new()
	floor_mat.albedo_color = Color(0.28, 0.24, 0.20, 1.0)
	floor_mat.roughness = 0.9
	floor_mat.metallic = 0.0
	
	wall_mat = StandardMaterial3D.new()
	wall_mat.albedo_color = Color(0.40, 0.34, 0.28, 1.0)
	wall_mat.roughness = 0.85
	wall_mat.metallic = 0.1
	
	pillar_mat = StandardMaterial3D.new()
	pillar_mat.albedo_color = Color(0.55, 0.40, 0.18, 1.0)
	pillar_mat.roughness = 0.5
	pillar_mat.metallic = 0.7

func _init_grid():
	grid.clear()
	for y in range(grid_height):
		var row: Array = []
		for x in range(grid_width):
			row.append(0)
		grid.append(row)

func _generate_rooms():
	var rooms_placed: int = 0
	var attempts: int = 0
	var rng = RandomNumberGenerator.new()
	rng.seed = hash("mythos_gates_dungeon_v2")
	
	while rooms_placed < max_rooms and attempts < 100:
		attempts += 1
		var w = rng.randi_range(min_room_size, max_room_size)
		var h = rng.randi_range(min_room_size, max_room_size)
		var x = rng.randi_range(1, grid_width - w - 2)
		var y = rng.randi_range(1, grid_height - h - 2)
		
		var overlap = false
		for ry in range(y - 1, y + h + 1):
			for rx in range(x - 1, x + w + 1):
				if ry >= 0 and ry < grid_height and rx >= 0 and rx < grid_width:
					if grid[ry][rx] == 1:
						overlap = true
						break
			if overlap:
				break
		
		if not overlap:
			for ry in range(y, y + h):
				for rx in range(x, x + w):
					grid[ry][rx] = 1
			rooms_placed += 1
	
	print("Dungeon: Placed ", rooms_placed, " rooms in ", attempts, " attempts")

func _generate_corridors():
	var rng = RandomNumberGenerator.new()
	rng.seed = hash("mythos_gates_corridors_v2")
	
	var room_centers: Array = _find_room_centers()
	print("Dungeon: Found ", room_centers.size(), " room centers")
	
	for i in range(room_centers.size() - 1):
		var start = room_centers[i]
		var end = room_centers[i + 1]
		
		if rng.randf() > 0.5:
			_carve_h_corridor(start.x, end.x, start.y)
			_carve_v_corridor(start.y, end.y, end.x)
		else:
			_carve_v_corridor(start.y, end.y, start.x)
			_carve_h_corridor(start.x, end.x, end.y)

func _find_room_centers() -> Array:
	var centers: Array = []
	var visited: Dictionary = {}
	
	for y in range(grid_height):
		for x in range(grid_width):
			if grid[y][x] == 1 and not visited.has(Vector2i(x, y)):
				var room_cells: Array = []
				var queue: Array = [Vector2i(x, y)]
				while queue.size() > 0:
					var cell = queue.pop_front()
					if visited.has(cell):
						continue
					visited[cell] = true
					room_cells.append(cell)
					
					for d in [Vector2i(1,0), Vector2i(-1,0), Vector2i(0,1), Vector2i(0,-1)]:
						var n = cell + d
						if n.x >= 0 and n.x < grid_width and n.y >= 0 and n.y < grid_height:
							if grid[n.y][n.x] == 1 and not visited.has(n):
								queue.append(n)
				
				var sum_x = 0
				var sum_y = 0
				for c in room_cells:
					sum_x += c.x
					sum_y += c.y
				centers.append(Vector2i(sum_x / room_cells.size(), sum_y / room_cells.size()))
	
	return centers

func _carve_h_corridor(x1: int, x2: int, y: int):
	var x_start = min(x1, x2)
	var x_end = max(x1, x2)
	for x in range(x_start, x_end + 1):
		if x >= 0 and x < grid_width and y >= 0 and y < grid_height:
			grid[y][x] = 1

func _carve_v_corridor(y1: int, y2: int, x: int):
	var y_start = min(y1, y2)
	var y_end = max(y1, y2)
	for y in range(y_start, y_end + 1):
		if x >= 0 and x < grid_width and y >= 0 and y < grid_height:
			grid[y][x] = 1

func _build_meshes():
	var floor_parent = Node3D.new()
	floor_parent.name = "Floors"
	add_child(floor_parent)
	
	var wall_parent = Node3D.new()
	wall_parent.name = "Walls"
	add_child(wall_parent)
	
	var pillar_parent = Node3D.new()
	pillar_parent.name = "Pillars"
	add_child(pillar_parent)
	
	var floor_box = BoxMesh.new()
	floor_box.size = Vector3(cell_size, 0.2, cell_size)
	floor_box.material = floor_mat
	
	var wall_box = BoxMesh.new()
	wall_box.size = Vector3(cell_size, wall_height, cell_size)
	wall_box.material = wall_mat
	
	var pillar_cyl = CylinderMesh.new()
	pillar_cyl.top_radius = 0.4
	pillar_cyl.bottom_radius = 0.4
	pillar_cyl.height = wall_height
	pillar_cyl.material = pillar_mat
	
	var floor_count = 0
	var wall_count = 0
	var pillar_count = 0
	
	for y in range(grid_height):
		for x in range(grid_width):
			var world_x = (x - grid_width / 2.0) * cell_size
			var world_z = (y - grid_height / 2.0) * cell_size
			
			if grid[y][x] == 1:
				var floor_mi = MeshInstance3D.new()
				floor_mi.mesh = floor_box
				floor_mi.position = Vector3(world_x, -0.1, world_z)
				floor_parent.add_child(floor_mi)
				floor_count += 1
				
				var dirs = [Vector2i(0,-1), Vector2i(0,1), Vector2i(-1,0), Vector2i(1,0)]
				for d in dirs:
					var nx = x + d.x
					var ny = y + d.y
					if nx < 0 or nx >= grid_width or ny < 0 or ny >= grid_height or grid[ny][nx] == 0:
						var wall = MeshInstance3D.new()
						wall.mesh = wall_box
						var wall_offset = Vector3(d.x, 0, d.y) * cell_size * 0.5
						wall.position = Vector3(world_x, wall_height / 2, world_z) + wall_offset
						wall_parent.add_child(wall)
						wall_count += 1
				
				if x % 4 == 0 and y % 4 == 0:
					var has_floor_neighbor = false
					for d in dirs:
						var nx2 = x + d.x
						var ny2 = y + d.y
						if nx2 >= 0 and nx2 < grid_width and ny2 >= 0 and ny2 < grid_height and grid[ny2][nx2] == 1:
							has_floor_neighbor = true
							break
					if has_floor_neighbor:
						var pillar = MeshInstance3D.new()
						pillar.mesh = pillar_cyl
						pillar.position = Vector3(world_x, wall_height / 2, world_z)
						pillar_parent.add_child(pillar)
						pillar_count += 1
	
	print("Dungeon: Built ", floor_count, " floors, ", wall_count, " walls, ", pillar_count, " pillars")

func _count_floor_cells() -> int:
	var count = 0
	for y in range(grid_height):
		for x in range(grid_width):
			if grid[y][x] == 1:
				count += 1
	return count

func get_spawn_point() -> Vector3:
	for y in range(grid_height):
		for x in range(grid_width):
			if grid[y][x] == 1:
				var world_x = (x - grid_width / 2.0) * cell_size
				var world_z = (y - grid_height / 2.0) * cell_size
				return Vector3(world_x, 0, world_z)
	return Vector3.ZERO
