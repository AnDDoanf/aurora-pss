---
title: "Action"
order: 13
level: "intermediate"
---

### Action {#action}

![PSS guide illustration 25](/guide-images/en/action.png)

When the condition is matched, the action is performed. There are quite a few action settings, but in general there are a few groups:

* Energy management (AI room)  
* Choose ammo type (AI room)  
* Select target (both room and crew have it)  
* Use abilities (Crew AI)

#### When is ACTION ignored

* If the condition does not match, the action is not performed  
* The target room does not exist, has run out of HP, is being upgraded, or cannot be reached (due to lack of roads, ladders, or ducts, in the case of placing AI on the crew), the action cannot be performed.  
* An ACTION of the same type (one of the 4 types listed above) has been selected for execution

#### What happens when there is no ACTION of “looking” that satisfies

If no target command is selected, the gun room will continue to fire on the last room it fired at. If from the beginning there are no conditions to satisfy any target, then the room or crew will not do anything.

#### Increase or decrease energy by 1 and set energy min/max

The command “increase energy by 1” is almost synonymous with the command “set maximum energy” for the room. The difference is that you will not be able to perceive the energy increase for the "maximum energy" order and this order has higher execution priority than the order to increase energy by 1.

In case your ship does not have enough power to set all rooms to the highest power state, the "maximum power" rooms will be prioritized for power concentration. Rooms that "increase 1 energy" will equally share the remaining energy.

Similar to above, the command to reduce energy by 1 will have the same effect as the command to set the lowest energy level, and because the AI loop runs very fast, you cannot detect the change.

#### Practical example

Now observe a practical example:

1. NO: set maximum power  
2. DON'T: choose cheap items  
3. DON'T: look at random rooms

This AI will blow up room after room, and we don't want that (read articles about military art), so we'll choose a specific room, to aim at:

1. NO: set maximum power  
2. DON'T: choose cheap items  
3. DON'T: aim at enemy lasers

The above AI is a little better, but still not enough. After destroying the laser room, MSL will shoot another laser room until it's gone, and it will be disastrous if the enemy has a crew to repair it (for sure). So we choose a room type that only has one or two rooms:

1. NO: set maximum power  
2. DON'T: choose cheap items  
3. NO: look at the enemy's shield room

In the above AI, when the enemy shield room is broken, MSL has no AI settings telling it to shoot any other room, and it will shoot the last room that it just received the order to fire, which means shooting the enemy shield room forever, and causing damage to the ship's hull - what we want.

\*The above AI has the disadvantage that if the enemy ship does not have a shield room (because the enemy does not install one), the MSL will not fire any shields. However, that case rarely happens, there is a radical solution, but that is not "basic" content, and is not included in this article.

Regarding AI for crew, there are some notes as follows:

1. CONDITIONS of crew AI are not much different from room AI.  
2. The action of selecting a target will indicate where the crew runs to.  
3. Once running to a friend room, the crew will perform the following four tasks, automatically, and in order of priority:  
   1. Take enemy crew if any.  
   2. Put out the fire if there is one.  
   3. Repair the room if necessary.  
   4. Use your index to help the department perform better.  
4. Once reaching an enemy room, the crew will perform one of the following two tasks, in order of priority:  
   1. Take enemy crew if any.  
   2. Vandalism of the room.  
5. Note that the above tasks are automatic, and have priority order, and do not happen at the same time (so if a room is on fire and there is an enemy standing, the room will not receive support from the crew).  
6. In addition to the above tasks, the crew can also use abilities, and depending on the characteristics of the ability, it may or may not affect the room.  
7. There must be a path for the crew to go.

Let's look at an example of Crew AI and ponder what it does:

1. Your room's HP \< 100%: choose a room that meets the conditions  
2. Random room HP \< 50%: choose a room that meets the conditions  
3. DON'T: choose MLZ room

Suppose Crew is standing in MLZ room and is improving (buffing) the room's fire rate. At this time, your REA room is hit by enemy fire and the REA's HP has decreased by more than 50%. At this time, because your shield room is still safe, the crew will run to repair the REA. While running, the REA will be completely destroyed and receive damage to the ship's hull. Your Crew repairs the REA until the REA has 50% HP, then line 2 will no longer meet the conditions and the crew will return to MLZ. At this point you probably understand, continue to assume that the REA has been destroyed and the enemy continues to aim at your shield room, right now because line 1 has higher priority, your Crew will turn 180 degrees to go to the shield room to perform repairs first, even though the REA has been destroyed.

#### Current actions and power priority

- **Keep Current Ammo** prevents unnecessary ammunition switching.
- **Target Bridge Room** is available to entities with valid targeting.
- **Set Target Mode** controls anti-craft targeting and has a matching manual command.
- Origin-room and current-room targeting support teleport and movement logic.
- **System Synchronization** research sets room-action priority. If reactors are damaged, this priority determines which rooms lose power first.

Build emergency survival lines first, then ammunition and target-mode choices, movement/return behavior, and finally general fallback actions. Always test the finished AI in battle because a line may be unavailable or permanently false for an entity without the checked property.

Sources: [V0.999.15](https://blog.pixelstarships.com/2024/12/04/galaxy-patch-notes-v0-999-15/), [V0.999.43](https://blog.pixelstarships.com/2026/01/20/fleet-wars-patch-notes-v0-999-43/), [V0.999.46](https://blog.pixelstarships.com/2026/02/11/galaxy-patch-notes-v0-999-46/), and [V0.999.55](https://blog.pixelstarships.com/2026/06/17/hull-14-major-update-patch-notes-v0-999-55/).
