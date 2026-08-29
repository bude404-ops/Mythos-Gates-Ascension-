using UnrealBuildTool;

public class MythosGates : ModuleRules
{
	public MythosGates(ReadOnlyTargetRules Target) : base(Target)
	{
		PCHUsage = PCHUsageMode.UseExplicitOrSharedPCHs;
		
		PublicDependencyModuleNames.AddRange(new string[] {
			"Core",
			"CoreUObject",
			"Engine",
			"InputCore",
			"Paper2D",
			"Niagara",
			"NavigationSystem",
			"AIModule",
			"GameplayTasks",
			"AnimGraph",
			"AnimGraphRuntime"
		});
		
		PrivateDependencyModuleNames.AddRange(new string[] {
			"Slate",
			"SlateCore",
			"BehaviorTree",
			"Blackboard"
		});
	}
}
