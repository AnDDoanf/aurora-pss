---
title: "Trigger condition"
order: 12
level: "beginner"
---

### Trigger condition {#trigger-condition}

An AI implementation is a statement of the form `IF <CONDITION> THEN <ACTION>` .

The game calculates the entire game state 40 times per second, called 40 frames. At each frame, if `<CONDITION>` is true, the room or crew will receive `<ACTION>` to perform at that frame.

*We see a crew going from room A to room B in 1 second. In reality, that crew received 40 consecutive orders to move in 1 second.*

Here are examples of some conditions:

![PSS guide illustration 24](/guide-images/en/trigger-condition.png)

It looks like there are many, but actually there are only two or three different types:

* No conditions, just do it anytime  
* The SHIP's HP is something like that  
* This CREW's HP is somehow like that  
* HP of this ROOM / room the crew is standing in / room of a certain type \- something like that  
* This ROOM / the room where the crew is standing / the room is of a certain type \- has something (has own crew, has enemy crew, no own crew, no enemy crew...)

Conditions are always checked from top to bottom, if you set AI as follows:

1. 1\. If you're TIRED, rest  
2. 2\. DO NOT \- stand

Then it's okay, if you're tired, you rest, if you're not tired, that setting is not activated, and line 2 is activated, and you stand. But if you set:

1. 1\. DO NOT \- stand  
2. 2\. If you're TIRED, rest

The condition in order 1 is always true and you will never get a break. That is the conflict of conditions, it can be disadvantageous or beneficial, depending on how you take advantage of it.

Now let's look at a basic installation of the MSL (missile) room:

1. 1\. NO\- maximum power  
2. 2\. DON'T choose cheap items  
3. 3\. NO \- look at random enemy rooms

The word NO above means there are no conditions, it means you can do it, not you can't. And with AI on, all three actions are performed. MSL will fire cheap items, with maximum energy, into random enemy rooms.

Upgrading the above example:

1. 1\. NO\- maximum power  
2. 2\. DON'T choose cheap items  
3. 3\. DO NOT \- aim at enemy missile defenses  
4. 4\. NO \- look at random enemy rooms

Similar to the previous example, but the SIGHT action on line three has been selected, so even though the condition on line 4 is still true, your department will always execute the command on line 3 first if the enemy ship has MSL(missiles). Thus your MSL will destroy enemy missile room after enemy missile room, UNTIL YOUR DEFENSE CAN NO LONGER SIGHT THE ENEMY MISSILE ROOM due to:

1. The enemy ship has no missiles  
2. All enemy missile defenses have been broken

… then action line 4 will be selected.

Let's look at another example:

1. 1\. NO\- maximum power  
2. 2\. DON'T choose cheap items  
3. 3\. Your ship's HP \< 100% \ - watch for enemy missiles  
4. 4\. NO \- look at random enemy rooms

Here, right from the beginning of the fight, your HP is 100%, line 3 is not activated, your MSL will fire random missile defenses, but once you have received hull damage, your HP will now always be 100% low and the MSL will fire enemy missile defenses. However, once there are no more missiles to aim at, the MSL will fire at random missiles again.

Of course we don't want to shoot room after room, we want to destroy the hull, so we need to do something else.

#### Current condition groups

Research and later patches added conditions beyond the original HP and room-presence checks:

- **Ship:** shields, available power, crew presence, and ship side.
- **Room:** HP, EMP, assigned power, reload, queue state, queued crew, and collective **all rooms** checks.
- **Crew:** HP, stamina, combat, healing, queue, destination arrival, and current ship.
- **Ammunition:** selected ammo, ammo count, depleted/reloading state, active missiles, and charge-weapon ammo.
- **Craft:** friendly or enemy counts, separated into assault, defensive, and default craft.
- **Status and targets:** target-room type, superweapons, Bridge, freeze, weaken, vulnerability, suppression, poison, and healing.

Availability depends on research and the selected room or entity. Invalid checks are hidden when the entity has no matching power, target, ammunition, or queue property.

Sources: [V0.999](https://blog.pixelstarships.com/2024/05/16/galaxy-patch-notes-v0-999/), [V0.999.20](https://blog.pixelstarships.com/2025/04/15/galaxy-patch-notes-v0-999-20/), [V0.999.50](https://blog.pixelstarships.com/2026/04/10/galaxy-patch-notes-v0-999-50/), and [V0.999.57](https://blog.pixelstarships.com/2026/07/06/galaxy-patch-notes-v0-999-57/).
