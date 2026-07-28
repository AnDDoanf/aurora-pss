---
title: "Introduction"
order: 1
level: "beginner"
---

### Introduction

Room layout, protection, support, bonus stats, saved layouts, medical rooms, utility rooms, and the distinction between combat and non-combat rooms are covered together here.

# Rooms and Room's Bonus Stat
## Combat Rooms vs. Non-Combat Rooms
Understanding rooms is one of the key foundations that influence ship design, AI design, and tactical planning.

First, you need to distinguish between two types of rooms: combat rooms and non-combat rooms, or rooms with HP and without HP, or rooms that can be targeted and those that cannot. Note that armor, elevators, and tunnels do not fall into either of these two categories.

Saying that non-combat rooms "cannot be targeted" isn’t entirely accurate, but it’s close. You cannot configure the AI to aim at these rooms, and their defensive stats are too high (80% damage reduction) to make them worthwhile targets. These include all rooms that do not display an HP bar, excluding armor, elevators, and tunnels.

They are called non-combat rooms because they do not play any role in combat and do not benefit from crew stats. There is one exception, which is the BRD room — the Pilot stat of the crew inside it affects your ship’s escape chance.

In contrast, targetable (combat) rooms:
- Have HP bars
- Have relatively low innate defense and thus need armor support
- Serve specific combat functions
- Are enhanced by the stats of crew members inside
- Are all valid targets for attacks

![Combat room and non-combat room comparison](/guide-images/en/introduction.png)
**Example of combat room (left) and non-combat room (right):**

#### **II. Room's Bonus Stat**

Rooms Can Be Buffed — Improving Their Performance — Through Three Sources: Armor, Modules, and the Stats of the Crew Standing in the Room’s Slot.

**1. Armor**
- Armor reduces both system damage and hull damage caused by any destructive force — including guns, cannons, lasers, missiles, etc. — for the room it is attached to.
- Armor reduces the damage taken by crew members standing in the room from external destructive sources.
- Armor also reduces damage caused by enemy boarding crews and fires inside the room.
- Armor does *not* reduce damage your crew members receive from enemy crew in direct combat inside the room.
- Armor does *not* reduce EMP effects.
- Armor does *not* reduce burn duration from fires.

Damage resistance produced by armors can be calculate as:

$$
\text{DamageTaken} = \frac{1}{1 + \left(\text{CombinedArmorStat} \times 0.01\right)}\times\text{ShotDamage}
$$

**2. Modules**

Currently, there are four types of modules:

**HP Boosters** 

![HP booster modules](/guide-images/en/introduction-2.png)

- Sandbags, bricks, concrete walls, energy barriers
- They absorb damage before the room’s HP is affected.
- They do not absorb damage from armor-piercing missiles or EMP blasts.
- In combat, they are single-use items — once destroyed, they’re gone.
- Crew cannot repair them during battle.
- You can repair them after combat ends.

**Fire Suppression Modules**

![Fire suppression modules](/guide-images/en/introduction-3.png)

- They help crew extinguish fires faster and reduce poision damage to the crews inside
- They do not put out fires on their own — crew presence is still required.
- They cannot be destroyed and do not need repairs.

**Mines** 

![Mine modules](/guide-images/en/introduction-4.png)

- They are triggered when enemy crew pass through the room.
- They damage or freeze enemy crew, but no longer affect friendly crew as of V0.999.55.
- They do not damage the room itself.
- Like HP boosters, they are single-use during combat, and cannot be repaired by crew.
- You can repair/reload them after combat.

Source: [Hull 14 Major Update, V0.999.55](https://blog.pixelstarships.com/2026/06/17/hull-14-major-update-patch-notes-v0-999-55/).

**Recall Beacon** 

![Recall beacon modules](/guide-images/en/introduction-5.png)

- They immediately teleport friendly crew into the friendly room containing them if the crew is far away and is targeting that room
- They have 1 second cooldown each time they are activated.
- They reset the Crew Action Timers when activated.
- They can be used 1-3 times a battle based on their tier.
- You can repair/reload them after combat.

**3. Crew Stats**
Crew members have two sets of stats, commonly referred to as the left-side stats and the right-side stats.

The left-side stats do not provide buffs to rooms, so in this post, we will focus on the right-side stats, which include:
- Pilot (PLT)
- Science (SCI)
- Engine (ENG)
- Weapons (WPN)

Except for the reactor rooms (REA, FRE, PC, CR), the rooms that participate in combat have a support stat, which information tells which room is buffed by which stats from the crew. 

- **PLT** reduce the charge time of every rooms that deploy crafts and increase the attack/repair speed of the crafts. PLT also reduce the charge time of Anti-craft rooms as AA, BT, GDS, etc.
- **SCI** reduce the charge time of Shield , Super Laser, Teleport and Anti-Teleport rooms.
- **ENG** reduce the charge time of Missle rooms and the evasion regenerate of Engine rooms.
- **WPN** increase fire rate of Laser and Cannon rooms.

Look at the image below, to see that Shield is buffed by the SCI stat.  

![Science stat buffing a room](/guide-images/en/introduction-6.png)

##### Reinforcement and Auxiliary Booster

Crew can **reinforce** a room, temporarily increasing its maximum HP according to the crew's Repair stat. **Urgent Repair** can reinforce by up to `ABL / 4` HP. AP damage ignores the reinforced maximum.

Auxiliary Booster can specialize into:

- **Flight Assist Controller** for connected hangars and craft.
- **Gunnery Overdrive Core** for connected gun and cannon rooms.
- **Missile Reload Matrix** for connected missile rooms.

![Auxiliary Booster specializations](/guide-images/en/introduction-7.gif)

The current maximum Auxiliary Booster effect is **12%**. Mine modules no longer damage or freeze friendly crew. Sources: [Level 14 room preview](https://blog.pixelstarships.com/2026/05/04/sneak-peek-level-14-rooms-crew-wishlists/), [Hull 14 V0.999.55](https://blog.pixelstarships.com/2026/06/17/hull-14-major-update-patch-notes-v0-999-55/), and [V0.999.57](https://blog.pixelstarships.com/2026/07/06/galaxy-patch-notes-v0-999-57/).

# Basic mechanisms {#basic-mechanisms}

## Rooms and room buffs {#rooms-and-room-buffs}

#### Room participating in combat, and defense not participating in combat {#room-engaged-in-combat,-and-defense-not-participating-in-combat}

Understanding room is one of the important foundations that affects ship design, AI design, and tactical design.

First, you need to distinguish two types of rooms: rooms that participate in combat and rooms that do not participate in combat, or rooms that have HP and do not have HP, or rooms that can be shot into and rooms that cannot be shot into. Note that armor, elevators, and tunnels do not belong to either of the above two categories.

Saying that anti-aircraft guns can shoot at it is not very accurate, but it is almost like that. We cannot set the AI ​​to target these rooms, and their defense is too high to be a target worth shooting at. These include all rooms without HP bars that you see, excluding armor, elevators, and tunnels.

The reason they are called anti-combat is because they do not play any role in combat, and do not benefit from any crew stats. The only exception is the BRD room, this room and the Crew Pilot stat standing in it affect your escape rate.

Shootable rooms, on the other hand, they have a health bar, they have fairly low coverage and need to be supplemented by armor, they have specific functions in combat, their functions are supported by the crew's stats, and they are all viable targets to hit.

#### **1. Identify your High-Value Rooms and Protect them**

All rooms with HP can potentially become targets for enemy fire. However, some rooms are consistently targeted or destroyed more frequently, such as SHL, TLP, EMP, AA, etc. The reason is that without these rooms, the ship:
- Loses operational capability
- Loses defensive ability
- Loses offensive power
- Loses the ability to execute tactics

Or because these rooms are:
- Easier to destroy (e.g., rooms with only 2 HP)
- Dangerous to the opponent’s strategy (e.g., a cloaking ship will try to disable Radar; a ship with weak defense will try to disable the Teleport Gate, etc.)

**Rooms That Should Be Prioritized for Defense:**
- Are critical to your strategy
- Are effective against current meta strategies
- Have low HP

**Ways to Prioritize Defense:**
- Use more armor (e.g., a 2HP room covered with 5 armor plates, versus a 3HP room with 4 armor)
- Install better protection modules (e.g., if there isn’t enough armor, compensate with higher-grade modules)
- Place the room near protective/repair crews (closer means fewer elevator trips and faster response)

#### **2. Room Placement General Rules**
There are several rules for room placement, which will be covered below:

**Rule #1: Rooms Must Be Connected**

Take a look at the layout below. All combat rooms are connected, allowing crew members to move freely between them. This is a prerequisite for your tank crew to be able to support the entire ship. Whether you're manually controlling them or using AI, rooms must be reachable in order to be accessed.

Conversely, the second image below is an example of disconnected rows. In theory, this layout has some advantages:
- Since certain rooms aren’t connected, each crew member only has to manage a small number of rooms,
- They can respond quickly, with less running back and forth.
- Additionally, disconnected rooms make it harder for boarding enemies to destroy your ship completely, since they can't access everything easily.

However, that’s all in theory. At higher-level cups, these pros and cons barely matter. Enemy ships focus fire with high intelligence, and if you can’t save your own ship, then nothing else matters.
Boarding crews also don’t come in ones or twos anymore — and their targets vary widely.

Therefore, the recommendation is: keep all your combat rooms connected.

**Rule #2: Cluster High-Value Rooms Together**

![1785160342066](/guide-images/en/introduction-8.png)

No matter what, you’ll often set AI to return your tank crew to a “waiting room.” This waiting room can either be a high-value room itself or a room nearby.

So if your high-value rooms are scattered far apart, your tank crew will have to constantly run long distances. As a result, they’ll run out of stamina quickly, and you'll lose the ability to maintain a stable combat state.

The recommendation: Cluster high-value rooms close to each other.
They don’t need to be directly adjacent (see Rule 3), but you shouldn’t place each high-value room in a separate corner of the ship.

**Rule #3: Distribute Waiting Rooms Across the Ship**

A waiting room refers to a fallback spot for tank crew or anti-boarding crew, where they return after completing their task.
For example: if you have a gunner who also plays a defensive role against boarders, then after the defense is done, you may have them return to the nearest laser room. In that case, the laser room acts as their waiting room.

How you define a waiting room and how you set up return logic via AI is up to you. But no matter how you set it, waiting rooms should be placed close to and intermixed with high-value rooms. They should surround high-value rooms like satellites, so that:

When an incident happens (e.g., a high-value room is damaged or boarded), the crew in waiting rooms can react quickly, and after dealing with the situation, they can return quickly without wasting too much time or stamina.

**Rule #4: Avoid Elevators Trapping Your Crew (If Possible)**

Here’s a common mistake: letting elevators trap your crew.

If an elevator ends up blocking access, it can turn into a cage, trapping your crew, or if that area then becomes the focus of enemy fire, the result can be disastrous.

**Rule #5: Elevators Must Be Accessible from Both Ends**

Avoid layouts where elevators are only placed in the center. These can quickly become choke points, which are extremely problematic.

Instead, design your layout so that there are at least two routes to access any room on a different floor. Only then will the number of elevators be sufficient for smooth movement.

**Rule #6: Place Defensive Crew Behind the Room They’re Meant to Protect**

This rule doesn't mean placing the waiting and protected rooms at opposite ends of the ship. Rather, it refers to their relative positions.

If two rooms are near each other, the waiting room (where your tank or anti-boarding crew stays) should be located toward the left rear of the ship, relative to the room it defends.

The reason involves room slot mechanics:
- Slot A for your crew is positioned toward the rear of your ship.
- Slot A for enemy crew is placed toward the left rear of their ship, which is the front of yours.

So, if you design accordingly:
- Your crew will have shorter distances to run
- Your crew will also enter the correct combat slot faster

For example (based on the image mentioned):

- Elf can quickly defend the TLP room,
- Witch can quickly defend the REA room.
- However, if Elf had to defend REA instead, she would not only have to run a longer distance, but also expose herself to enemy fire for a much longer time.

**Rule #7: Follow Your Own Playstyle**

![1785160366431](/guide-images/en/introduction-9.png)

This layout guide should not be consider as a goal that you aim for, but a foundation that you can rely on and build your own style. In Summit, we do not want to create an empire of clones but encourage a diversity of strategies. 

Remember, **no rule suits your ship better than your own rules.**

#### Saved layouts and current high-level constraints

Ship Layout Saving stores room, crew, module, and AI configurations. Slots are unlocked through research and are specific to the current hull and level.

![Saved ship-layout interface](/guide-images/en/introduction-10.png)

Hull 14 adds three crew-cap slots and new room footprints, so saved lower-hull layouts should be reviewed rather than copied blindly. Current room values that directly affect layout planning include:

- Engine Room evasion capacity **25** and Ship Thrusters **15**.
- Security Gate maximum HP/power **2** and Teleport Repulsor **4**.
- Hangar, Defense Hangar, and Drone Hangar maximum HP/power **5**.
- Plasma Discharger and Missile Pod room limits increased from 2 to 3.

Sources: [layout-saving preview](https://blog.pixelstarships.com/2025/06/06/sneak-peek-layout-saving-wargames-more/), [Hull 14 V0.999.55](https://blog.pixelstarships.com/2026/06/17/hull-14-major-update-patch-notes-v0-999-55/), and [V0.999.57](https://blog.pixelstarships.com/2026/07/06/galaxy-patch-notes-v0-999-57/).

#### Expanded medical room {#expanded-medical-room}

![PSS guide illustration 107](/guide-images/en/introduction-11.png)

Toilet (WC, 2×2) – WC

![PSS guide illustration 108](/guide-images/en/introduction-12.png)

Flower Gardens(FG, 3×2) – flower garden

##### Current medical-room mechanics

Medbays are passive rooms that heal crew continuously. Medical rooms and healing abilities also remove status effects.

The Hull 14 **Revivification Chamber** is a 3×2 defensive room with 4 HP. It resurrects crew killed during the current ship battle, and its reload is improved by SCI or the Rush ability.

![Revivification Chamber](/guide-images/en/introduction-13.gif)

AI can use the **Is Healing** condition for medical rooms. Sources: [V0.999](https://blog.pixelstarships.com/2024/05/16/galaxy-patch-notes-v0-999/), [Level 14 room preview](https://blog.pixelstarships.com/2026/05/04/sneak-peek-level-14-rooms-crew-wishlists/), and [V0.999.57](https://blog.pixelstarships.com/2026/07/06/galaxy-patch-notes-v0-999-57/).

##### High-value room {#high-value-room}

All rooms with HP have the ability to become enemy shooting targets. But there are always some rooms that are frequent targets for shooting/destroying. Such as SHL, TLP, EMP, AA rooms... Reason, lack of them, ship:

* Loss of ability to function  
* Loss of defense ability  
* Loss of attack power  
* Loss of ability to deploy tactics

Or, they:

* Easy targets to destroy (rooms with 2HP)  
* Dangerous to the enemy's tactics (for example, ships using cloaks will try to disable the Radar, weak defense ships will try to disable the Portal...)

Rooms that need defense/protection priority over others would be:

* Important for your strategy  
* Dangerous to counter strategies currently in the meta  
* Low HP

Defense prioritization can be through:

* More armor (for example, a 2HP room covers 5 armor, a 3HP room covers 4 armor)  
* Place a better protection module (for example, if the room doesn't have enough armor, make up for it with a better module)  
* Placed closer to the security/repair crew, taking less elevators to get there

There are some rules when arranging rooms as follows.

###### Rule 1: rooms must be connected

Take a look at the layout below. All the battle rooms there are connected, so the crew can move back and forth. This is a prerequisite for your tank crew to be able to support throughout the ship. Whether you control manually or the crew follows the AI, the room still needs to have a way to reach it.

![PSS guide illustration 5](/guide-images/en/introduction-14.png)

On the other hand, below is an example of a non-connected room. In theory, this arrangement still has advantages, because it is impossible to reach unconnected rooms, so each crew is only responsible for operating on a very small number of rooms. They will react quickly, less need to run for long. Besides, interconnected air defenses also make it more difficult for landing crews to destroy the entire enemy ship.

But that's in theory, in high cups, the advantages and disadvantages mentioned above no longer have much meaning. The enemy ship's gun focus fire is very smart and if you don't have the ability to save your own ship then there's nothing more to say. The landing crew does not stop at just one or two in number, and the targets are also very diverse. So the advice is to keep all battle rooms connected.

![PSS guide illustration 6](/guide-images/en/introduction-15.png)

###### Rule 2: high-value rooms cluster close together

Either way, you'll often have the AI return to the crew tank's lounge. Lounges can be high-value rooms or nearby rooms.

So if you place high-value rooms far away from each other, your tank will often have to run very long distances. Running out of stamina will happen quickly. And you will quickly lose the ability to maintain a steady state to fight.

The advice here is to cluster high-value rooms close together. It is not necessary that high-value rooms must be close together or adjacent to each other (see rule 3), but at least you cannot place high-value rooms in one corner.

###### Rule 3: spread lounges evenly throughout the ship

The waiting room here is the room to return to the old place, for tank crews and landing crews, after they have completed their tasks. For example, if you have a gunner with the ability to defend landings, then after defending, we usually let that gunner run to the nearest laser. So the laser is the crew's waiting room.

It's up to you what room you define as the waiting room, and how you set the AI to return. But whatever they are, they need to be close, interspersed with high-value rooms, surrounding high-value rooms, becoming satellite rooms of high-value rooms. Thanks to that, when an incident occurs (a high-value room is damaged, an enemy crew lands...), the crew in the waiting room can quickly react, and when the job is done, they can quickly return, without wasting too much time and physical strength.

###### Rule 4: avoid letting the elevator imprison your crew, if possible

The following is death. Elevators turn into traps that trap your crew. It would be bad if that cell was subjected to concentrated fire.

![PSS guide illustration 7](/guide-images/en/introduction-16.png)Crew detention ladder

###### Rule 5: must have a ladder covering both ends

Avoid elevator layouts that only have elevators in the middle. Those ladders will turn into very bad bottlenecks. Ladders like the one below ensure there are always at least two ways to get to the same room on another floor. Maybe just enough stairs to go.

![PSS guide illustration 8](/guide-images/en/introduction-17.png)

###### Rule 6: have the defending crew stand on the stern side of the ship from the room it protects

This rule does not say that you put the above two types of rooms at either end of the ship, but rather talks about their relative position to each other. That if there are two rooms close together, the waiting room (the room containing the crew tank and landing craft) should be the room located at the stern of the ship.

The reason for this is related to the room slot (refer to [mechanism of crew combat](http://local.nguyenbinhson.com/co-che/808/crew-combat-101/)). Slot A for your crew will be at the stern of your ship. Slot A for the enemy crew will be at the rear of the enemy ship, that is, at the front of your ship. If you design properly, the crew's path will be significantly reduced, and your crew will also be in a fighting position sooner.

![PSS guide illustration 9](/guide-images/en/introduction-18.png)

In the picture above, the female crew can quickly defend the TLP, and the male crew can quickly defend the REA. However, if the female crew has to defend the REA, she not only has to run a longer distance, but also has to expose herself to the enemy crew for quite a long time.

The rooms below are not available in the game's store but are only sold by bux through the daily shop; by dove via shop dove; or with a bonus when depositing. They may or may not be an important part of the ship, may be part of the gameplay, or may not be. And they affect your plan to use bux, dove, and your plan to participate in the season (tour) to get your dove.

Note, the list below is not guaranteed to be complete, some rooms have equivalent functions to those listed here, are no longer for sale, or are not for sale and will not be listed.

##### Extended bed room {#extended-bed-room}

There are a total of 9 extra beds, helping to expand 10 crew. There is one bed that is not sold daily, two beds that are sold very rarely, and the remaining beds that are sold more frequently, every 4-6 months.

![PSS guide illustration 93](/guide-images/en/introduction-19.png)

Dog House (DH, 2×2) – dog house, only sold with late support package ($45 on homepage)

![PSS guide illustration 94](/guide-images/en/introduction-20.png)

Aquarium (AQU, 2×3) – fish tank, squid house, single extended bed room that can level up and accommodate 2 crew. Sold in dove shops and rarely sold through daily sales.

![PSS guide illustration 95](/guide-images/en/introduction-21.png)

Captain’s Quarters (CAP, 3×2) – the captain’s private room

![PSS guide illustration 96](/guide-images/en/introduction-22.png)

XMas Tree (XMA, 2×2) – Christmas tree

![PSS guide illustration 97](/guide-images/en/introduction-23.png)

Graveyard (GRA, 2×2) – grave

![PSS guide illustration 98](/guide-images/en/introduction-24.png)

Cat House (CAT, 2×2) – cat house, home of Meowy, the mascot of this site

![PSS guide illustration 99](/guide-images/en/introduction-25.png)Oven (OVE, 2×2) – oven, home of Turkey

![PSS guide illustration 100](/guide-images/en/introduction-26.png)Cryopod / Zakian Cryopod (CP / ZCP, 2×2) – sold through dove shops and rarely sold through daily sales

![PSS guide illustration 101](/guide-images/en/introduction-27.png)

Car Garage (CAR, 2×2) – garage

##### Expanded practice room {#expanded-practice-room}

![PSS guide illustration 103](/guide-images/en/introduction-28.png)

Galaxy Gym (GYM, 3×2) – Ngan Ha Gym, equivalent to a level 9 Gym, but can train 3 crews at the same time

![PSS guide illustration 104](/guide-images/en/introduction-29.png)

Lunar College (LUN, 2×2) – Moonlight Academy Equivalent to a level 9 academy, can train 2 crews at the same time

##### Expansion Reactor {#expansion-reactor}

![PSS guide illustration 109](/guide-images/en/introduction-30.png)

Coal Reactor (CR, 2×2) – Coal-powered reactor, can be upgraded to level 2, grants 2 energy

##### Expanded AI Room {#expanded-ai-room}

![PSS guide illustration 110](/guide-images/en/introduction-31.png)

Computer Room (COM, 2×2) – Computer room, allows saving 25 lines of AI, more than CMD level 7 but less than CMD level 8, and saves 2 squares of ship space

##### Expanded warehouse {#expanded-warehouse}

![PSS guide illustration 111](/guide-images/en/introduction-32.png)

Workshop (WOR, 2×2) – Workshop, capacity 150\. Can be updated to level 2 to have a capacity of 400

##### Expanded Mineral Mining Machine {#Extended-mining-mining-machine}

Just to list it all, the rooms below are generally misleading people.

![PSS guide illustration 116](/guide-images/en/introduction-33.png)

Prototype Mining Drill (MIN, 2×3)

![PSS guide illustration 117](/guide-images/en/introduction-34.png)

Prototype Gas Extractor (GAS, 2×3)

##### Some skins {#some-skins}

There are quite a few skins, and their number is increasing over time, after each season, so it's too tiring to list them all. But roughly the skin looks like this:

![PSS guide illustration 118](/guide-images/en/introduction-35.png)

Love Quarter Apply – Love room, CAP room skin.

![PSS guide illustration 119](/guide-images/en/introduction-36.png)

Velvet Sanctuary (LOV) – Brocade room, skin of CAP room.

##### Current account skin system

Skins are permanent account unlocks rather than inventory-bound skin kits. Room, missile, laser, shield, and craft skins are selected from the relevant room, ammunition, or craft information panel.

![Account skin unlocked](/guide-images/en/introduction-37.png)

Source: [new skin system](https://blog.pixelstarships.com/2023/08/11/introducing-a-new-skin-system/).

Current references: [V0.999](https://blog.pixelstarships.com/2024/05/16/galaxy-patch-notes-v0-999/), [V0.999.16](https://blog.pixelstarships.com/2024/12/17/ugc-stickers-galaxy-patch-notes-v0-999-16/), [Hull 14 V0.999.55](https://blog.pixelstarships.com/2026/06/17/hull-14-major-update-patch-notes-v0-999-55/), and [V0.999.57](https://blog.pixelstarships.com/2026/07/06/galaxy-patch-notes-v0-999-57/).
