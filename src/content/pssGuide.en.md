# PSS Player Handbook

Kafka@2023

This document is compiled from old articles on the website vietnamstarwalkers.com (now downloaded), written during the year 2019 \~ 2020\. Some content may be out-dated, please note when referencing.

# Basic mechanisms {#basic-mechanisms}

## Rooms and room buffs {#rooms-and-room-buffs}

### Room participating in combat, and defense not participating in combat {#room-engaged-in-combat,-and-defense-not-participating-in-combat}

Understanding room is one of the important foundations that affects ship design, AI design, and tactical design.

First, you need to distinguish two types of rooms: rooms that participate in combat and rooms that do not participate in combat, or rooms that have HP and do not have HP, or rooms that can be shot into and rooms that cannot be shot into. Note that armor, elevators, and tunnels do not belong to either of the above two categories.

Saying that anti-aircraft guns can shoot at it is not very accurate, but it is almost like that. We cannot set the AI ​​to target these rooms, and their defense is too high to be a target worth shooting at. These include all rooms without HP bars that you see, excluding armor, elevators, and tunnels.

The reason they are called anti-combat is because they do not play any role in combat, and do not benefit from any crew stats. The only exception is the BRD room, this room and the Crew Pilot stat standing in it affect your escape rate.

Shootable rooms, on the other hand, they have a health bar, they have fairly low coverage and need to be supplemented by armor, they have specific functions in combat, their functions are supported by the crew's stats, and they are all viable targets to hit.

### Room buff {#buff-room}

Rooms can be buffed \- thereby performing better \- through three sources: armor, modules, and (the stats of) the crew standing in the room slot.

#### Armor

* Armor reduces both system damage and hull damage, from any destructive force, including guns, artillery, lasers, missiles, etc., to the room it comes into contact with.  
* Armor reduces damage to crew standing in the room against outside destructive forces  
* Armor also reduces damage from sabotage by landing enemy crews, or from fire in the room  
* Armor does not reduce the damage your crew takes from enemy crews in the room  
* Armor does not reduce EMP  
* Armor does not reduce burning time

Let's look at the information of some types of armor:

![PSS guide illustration 1](/guide-images/image1.png)![PSS guide illustration 2](/guide-images/image2.png)

Armor will increase the room's defense, by a percentage, and the percentage increase is calculated according to the defense stat in the information above.

#### Module

Modules are a new addition to the game, and will probably last a long time. Currently there are only three types of modules:

* Increase HP:  
  * Sandbags, bricks, concrete walls, energy barriers fall into this category  
  * They take damage before the room's HP is affected  
  * They do not take damage from penetrating missiles or receive EMP  
  * In combat, they are disposable items, if they are broken, they cannot be repaired by the crew  
  * You can fix them after the fight ends  
* Fire rescue  
  * They help the crew put out fires faster  
  * They do not put out fires without a crew  
  * They are not destroyed and do not need repair  
* Mines  
  * They are activated when an enemy crew passes by  
  * They deal damage to all crew in the room, including their own crew  
  * They do not destroy the room  
  * They are disposable in combat and cannot be repaired by the crew  
  * You can fix them after combat

#### Crew stats

Crew has two sets of indexes that people often call the left indexes and the right indexes.

The stats on the left do not buff the room, so in this article we talk about the stats on the right, including:

* Pilot  
* Shield  
* Engine  
* Weapons  
* and a dead index called Research

![PSS guide illustration 3](/guide-images/image3.png)

Except for REA rooms, rooms participating in combat have a support stat, which information indicates which stat the room is buffed by from the crew. Take a look at the image below, to see that the Shield is buffed by the K.Learning stat.

![PSS guide illustration 4](/guide-images/image4.png)

Pilots, Shields, and Weapons will reduce the room's charge time, while Engines increase the dodge rate of the ENGINE room. This room helps the ship dodge (at a certain rate) all missile weapons - basically rooms that throw "stones" of something, including:

* Types of missiles from missile defense (MSL, MML)  
* Bullets from Firehawk and Cosair aircraft  
* Roket from CML  
* Drones from HDL  
* Atomic bomb from NUC

### High-value room {#high-value-room}

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

#### Rule 1: rooms must be connected

Take a look at the layout below. All the battle rooms there are connected, so the crew can move back and forth. This is a prerequisite for your tank crew to be able to support throughout the ship. Whether you control manually or the crew follows the AI, the room still needs to have a way to reach it.

![PSS guide illustration 5](/guide-images/image5.png)

On the other hand, below is an example of a non-connected room. In theory, this arrangement still has advantages, because it is impossible to reach unconnected rooms, so each crew is only responsible for operating on a very small number of rooms. They will react quickly, less need to run for long. Besides, interconnected air defenses also make it more difficult for landing crews to destroy the entire enemy ship.

But that's in theory, in high cups, the advantages and disadvantages mentioned above no longer have much meaning. The enemy ship's gun focus fire is very smart and if you don't have the ability to save your own ship then there's nothing more to say. The landing crew does not stop at just one or two in number, and the targets are also very diverse. So the advice is to keep all battle rooms connected.

![PSS guide illustration 6](/guide-images/image6.png)

#### Rule 2: high-value rooms cluster close together

Either way, you'll often have the AI return to the crew tank's lounge. Lounges can be high-value rooms or nearby rooms.

So if you place high-value rooms far away from each other, your tank will often have to run very long distances. Running out of stamina will happen quickly. And you will quickly lose the ability to maintain a steady state to fight.

The advice here is to cluster high-value rooms close together. It is not necessary that high-value rooms must be close together or adjacent to each other (see rule 3), but at least you cannot place high-value rooms in one corner.

#### Rule 3: spread lounges evenly throughout the ship

The waiting room here is the room to return to the old place, for tank crews and landing crews, after they have completed their tasks. For example, if you have a gunner with the ability to defend landings, then after defending, we usually let that gunner run to the nearest laser. So the laser is the crew's waiting room.

It's up to you what room you define as the waiting room, and how you set the AI to return. But whatever they are, they need to be close, interspersed with high-value rooms, surrounding high-value rooms, becoming satellite rooms of high-value rooms. Thanks to that, when an incident occurs (a high-value room is damaged, an enemy crew lands...), the crew in the waiting room can quickly react, and when the job is done, they can quickly return, without wasting too much time and physical strength.

#### Rule 4: avoid letting the elevator imprison your crew, if possible

The following is death. Elevators turn into traps that trap your crew. It would be bad if that cell was subjected to concentrated fire.

![PSS guide illustration 7](/guide-images/image7.png)Crew detention ladder

#### Rule 5: must have a ladder covering both ends

Avoid elevator layouts that only have elevators in the middle. Those ladders will turn into very bad bottlenecks. Ladders like the one below ensure there are always at least two ways to get to the same room on another floor. Maybe just enough stairs to go.

![PSS guide illustration 8](/guide-images/image8.png)

#### Rule 6: have the defending crew stand on the stern side of the ship from the room it protects

This rule does not say that you put the above two types of rooms at either end of the ship, but rather talks about their relative position to each other. That if there are two rooms close together, the waiting room (the room containing the crew tank and landing craft) should be the room located at the stern of the ship.

The reason for this is related to the room slot (refer to [mechanism of crew combat](http://local.nguyenbinhson.com/co-che/808/crew-combat-101/)). Slot A for your crew will be at the stern of your ship. Slot A for the enemy crew will be at the rear of the enemy ship, that is, at the front of your ship. If you design properly, the crew's path will be significantly reduced, and your crew will also be in a fighting position sooner.

![PSS guide illustration 9](/guide-images/image9.png)

In the picture above, the female crew can quickly defend the TLP, and the male crew can quickly defend the REA. However, if the female crew has to defend the REA, she not only has to run a longer distance, but also has to expose herself to the enemy crew for quite a long time.

## Crew and crew roles {#crew-and-crew-roles}

Crew and tactics (AI) are equally important. You need both to win the fight.

Like any other strategy game, the answer to the question is which crew is the strongest? will ask the question: how can there be such a thing\!. Most starwalkers have not found a set of crew that is definitely the strongest.

However, there are some crews that are actually more useful than others. And you need to identify this set of acceptable crews. And that is the purpose of this article.

First, you should know that Crew has 7 levels:

1. Normally, one star, gray  
2. Elite, two stars, white  
3. Unique, three stars, blue color  
4. Epic, four stars, purple  
5. Hero, five stars, orange  
6. In particular, a shield, bright yellow  
7. Legend, one wing, dark yellow

Levels from 1-5 stars can be obtained from the store, in which minerals can buy crews from 1-3 stars, and the price will increase by 50% for each crew you have:

![PSS guide illustration 10](/guide-images/image10.png)

Bux can buy 3-5 star crew, and the price will increase by 10% for each 4-5 star crew you have:

![PSS guide illustration 11](/guide-images/image11.png)

Because of the increased price factor, you should get rid of the 1-2 star crews.

Level 6 crews cannot be formed and can only be received by depositing money or winning events.

Level 7 crews can only be obtained through fusion.

You can also get crew through purchasing from the daily supply ship, or through selling from the shop. If you're not sure about the usefulness of Crew, ask the community.

Do not abandon crews of 3 stars or higher unless you really understand what you are doing.

### Indicators {#indicators}

#### Core index

![PSS guide illustration 12](/guide-images/image12.png)

* HP: amount of crew's hp  
* Attack: amount of damage that can be dealt to the enemy crew, per second, while the crew is standing in place  
* Repair: the amount of room hp the crew can restore, per second, when the crew stands in place in the room  
* Skills: affects the effectiveness of skills that the crew has

#### Room buff index

![PSS guide illustration 13](/guide-images/image13.png)

You can see the article about [Rooms and Room Buffs](http://27.73.126.49/ship/phong-va-buff-phong/), but briefly:

* The Weapon stat increases the rate of fire for laser defense, missile defense, air defense, and artillery  
* Science stat reduces waiting time for shield, teleport, cloak, radar, photon technology rooms  
* Pilot stat reduces waiting time for the flight room, and increases the escape rate for the captain's room  
* Only the Engineer number for the robot room, and the engine room when calculating the missile avoidance rate

#### Auxiliary index

![PSS guide illustration 14](/guide-images/image14.png)![PSS guide illustration 15](/guide-images/image15.png)![PSS guide illustration 16](/guide-images/image16.png)

* Stamina: each stamina point helps the crew run for 1 second  
* Walking/running speed: as the name suggests  
* Fire Resistance: reduces the damage the crew takes from fire, by a percentage. If a crew's fire resistance exceeds 100%, the fire will heal that crew. We often use items to do this.  
* Training Points: number represents the amount of training through the gym or energy boosters that the crew can endure.  
* Collection: collection provides a passive ability (cannot be actively activated) to the crew when you have a sufficient number of crew of that collection in the combat squad.  
* Equipment: Crew can equip one item for each equipment slot it has. Some crews don't have any slots. Captain is the only crew with 6 equipment slots.

### Crew Skills {#crew-skills}

Each crew of three stars or more has a special skill that they can use when they reach level 10\. Each crew can use skills once per battle.

There are a total of 11 types of skills:

1. Death Fist: deals damage to an enemy crew in the room  
2. Toxic gas: deals damage to all enemy crews in the room  
3. Recovery: automatically restores HP  
4. Healing: restores HP to all teammates in the room  
5. Shock welding: not welding in blow welding, but ice welding. Freezes an enemy crew for a period of time  
6. Fire step: wherever you go, it causes fire in the room there, always activated  
7. Hack: EMP current room for a period of time  
8. Burn: cause fire in the current room  
9. Destroy: deals system damage to the current room  
10. Emergency repair: quick repair  
11. Urgency: reduce the charging time of the current room

Skills 1-6 can be used anywhere, 7-9 can only be used on enemy ships, and 10-11 can only be used on friendly ships.

The strategy for using the skills will be written in another article, this article only explains the meaning.

### Roles {#roles}

Depending on the ship's tactics, there will be different roles for your crew. Overall, there are about 8 different roles in the current meta:

* Stand gun: use weapon index  
* Science: use science index  
* Engineer: use engineer index  
* Pilot: uses pilot index  
* Repair: use the ability to survive, run strong, and quickly repair skills  
* Urging: use urging skills  
* Landing: using attack stats, sure-kill skills, destruction skills, freezing, incendiary, fire steps, and longevity are also an advantage  
* Anti-landing: using attack stats, sure-kill skills, freezing, and longevity is an advantage

And crews are ranked on their suitability for each role. The best reference source for each crew's rank for each role is [Pixel Perfect Guide – Crew Card](https://pixelperfectguide.com/crew/cards/). You can go there to see the details of each crew, but in general there are 5 rank levels:

* Best: Crew deserves to play until the endgame in this role  
* Good: crew can take on this role, you can use it, but on long distances, think about pres crew  
* Average: Crew reluctantly meets the role. Most of the crews you have at the beginning of the game are at this rank. Think about gradually replacing them with higher ranked crews.  
* Poor: cannot be used.

Some players let all crews do the same thing, typically everyone repairs and repairs until the last one runs out, thus not effectively exploiting the crew's abilities. We should divide roles and responsibilities among the crew.

Some crews can be used in multiple roles, but usually you will end up choosing one and only one role to focus on, this is the pursuit of the science of [training and equipment](https://pixelperfectguide.com/crew/training-items/), to help the crew perform the role of pawn as well as possible.

To know what a crew can be used for, look at its information:

![PSS guide illustration 17](/guide-images/image17.png)![PSS guide illustration 18](/guide-images/image18.png)

A male nurse is suitable to be a repair crew, it has a good repair index, not too low health and when combined with skills will give the ability to live long.

Admiral Serena is a potential gun crew with extremely high Weapons stats, and the Death Fist skill gives this crew the ability to destroy landing enemy crews.

#### How many crew for each role

Hard to say. But the general way of thinking is reasonable and balanced, to make the ship's tactics effective. If you often lose because you can't fire in time, not because of weak repair defenses, then increase your ship's shooting ability, by changing the crew to better gun positions, or increasing the guns and lowering the defense.

* On average, the repair crew ratio should fluctuate around 1/5 of your crew number.  
* The number of landing crew is at least 3, less than that is not worth placing a tele room on your ship (when you have a landing droid, from level 8, the number of landing crew can go to 0, depending on your strategy). The maximum number of landing crew is limited by your teleport ability. If you don't have a crew rush, usually in a fight you will not be able to teleport more than 5 crews (due to the tele defense being destroyed, EMP, due to waiting too long, the tele crew running out, or due to running out of time). If you are in a rush, you can arrange more.  
* The number of shielding crew is equal to the number of crew your shield rooms can accommodate. From 2-3, until you have a shield battery room, then go up to 4-5.  
* Scientists can also buff rooms that use Photon technology so they can destroy enemy shields faster, teleport rooms so your crew can land faster.  
* Number of remaining crew to stand guns. They are the most important crews for dealing damage to enemy ships. Even in extreme attack tactics, shield crews are removed to have more gun crews.  
* In an attack-oriented strategy, you will need more crew to take on the role of urging, to help you land as quickly as possible at the beginning of the fight.  
* In a defensive strategy, you will need many crews with the ability to heal and heal to help the crew live longer  
* If you have problems with enemy ships specializing in amphibious landings, then add additional crews that have the additional role of anti-landing. Serena above is a prime example. Avoid using crews that only have anti-landing effects without any defense buffs, because they will be useless when you fight ships that do not play landings.  
* The list of crew skills above is arranged in order of importance. So the roles at the bottom of the list should be the crew's secondary roles instead of the main roles.

Each role has a suggested associated skill. However, for crews that have secondary roles, their skills should be related skills of the secondary role. The list of related skills is as follows:

* Gun, science, engine: should have healing or healing skills. The gun crew may have additional roles in urging, defending, or repairing.  
* Pilot: should have urging, healing, and healing skills. Can play an additional role in repair and anti-landing.  
* Repair: should have healing, healing, and instant repair skills. Can play an additional role in urging and preventing landings.  
* Urging: must have urging skills  
* Landing: should have skills of toxic gas, death power, hacking, destruction, freezing, incendiary, fire step, and healing. Before landing, landing crews can play any other role appropriate to their stats.  
* Anti-landing: it is best to have freezing, death rights, toxic gas, and healing. The anti-landing crew does NOT have a secondary role, rather, the anti-landing crew IS a secondary role, you should have a lot of crews that can play this secondary role, in addition to their main role.

### “seniority” index {#index-“seniority”}

This chapter has specs, which is no longer correct.

Although there is no obvious evidence, it seems that the game gives each crew a seniority index every time a fight begins. This stat affects which crew will be the first to run to repair the room if both crews have satisfactory AI conditions; as well as affecting the slot where the crew will stand in the room; The crew with the highest seniority will come to repair the room first, and stand on the leftmost side.

Crew captains always have the highest seniority.

We cannot change the seniority index, but we can detect it and take advantage of it. This is described in more detail in the article on ship repair AI.

## Operational mechanism of amphibious and anti-landing engagement {#operational mechanism-of-landing-and-anti-landing-engagement}

Landing refers to our ship's crew going through the teleportation door located in the TLP room to teleport into a designated room on the enemy ship, activating the ability to attack the enemy ship's room and crew. Thereby disrupting the enemy ship's ability to operate, reducing the pressure the enemy ship puts on your ship and creating conditions for the weapons on your ship to create damage on the ship's hull leading to victory.

Landing can be considered one of the most dangerous tactics in PSS. So having an anti-landing plan is also a part of the job that you must pay attention to. This article clarifies the game's mechanics surrounding landing and anti-landing combat, to serve as a premise before going into landing and anti-landing AI.

### Crew combat mechanics {#crew combat mechanics}

#### Slot room

We know that each room has a limited number of crew that can stand to buff. We call each standing position a slot, and the number of crew that can stand for buffs is the slot number. In this article we name them A, B, C... in order of seniority.

![PSS guide illustration 19](/guide-images/image19.png)A, B, C

Each room has two sets of A/B/C slots for each faction. That means a 2×3 room can accommodate 6 crews – including 3 friendly factions and 3 enemy factions. Sets A, B, C for your crew are arranged in order from left to right, and sets for the enemy crew are from right to left, meaning C', B', A'. This helps create the scene of two crews standing on either side and snarling at each other like you often see in pvp.

![PSS guide illustration 20](/guide-images/image20.png)A and A’

The crew's slots in the room are arranged according to the crew's [seniority](http://local.nguyenbinhson.com/crew/seniority-101/). That means, suppose the room has slots A and B with two young crew standing. If an old crew enters, the two young crews will move to slots B and C, giving slot A to the old crew. Similarly, when the old crew is no longer in the room, the two young crews will move to reclaim slots A and B.

#### Get into position

Crews need to stand in a slot to be able to participate in hand-to-hand combat – including both attacking and being an attack target. This means that the crew cannot walk and shoot at the same time. And the crew moving across the room will also not be able to be targeted by the enemy crew standing in the room.

Any crew that enters the room on their own (not using TLP to enter the room) will have to continue until they reach the slot. Crew teleporting into a room will immediately reach the slot, but in return will have to endure 0.5 seconds of freezing. Crews that are already in the slot can of course immediately start combat.

#### Lock on target and fight

You must lock on the target before you can attack. When fighting hand-to-hand, the target chosen for each side to attack first will always be the crew at A and A'. Whenever the crew at A dies, the crew at B will step forward to take over that slot and become the new target.

It is not necessary for the crew to stand in the slot to start being targeted, in fact they begin to have the ability to be targeted from the moment they intend to stand in slot A.

So if the crew is running business and passes by a room with an enemy crew, they will not be able to be shot at by the enemy crew. However, if the crew intends to run into the exact room where the enemy crew is (the target room has the enemy crew), then as soon as the two crews face each other, they will start targeting each other. Of course, the new one running into the room will be at a slight disadvantage because it has to run to its slot to start shooting.

As mentioned above, crews that are not targeted will not be attacked. But they can be affected by skills from combat in the room, such as healing, toxic gas, ice waves...

Crews will attack, once every second, on the locked crew. This means that a crew can be attacked by the group, but it will always only attack the locked crew. The amount of damage dealt in hand-to-hand combat will be equal to the crew's attack stat.

### Skill usage mechanism {#skill-usage mechanism}

The skill usage mechanism is not part of the duel mechanics. This means that the use of skills is limited by constraints different from those of a duel. Specifically as follows.

#### Skill activation conditions

Crews level 10 or higher can use skills once per battle. Skills are always disabled by default so that they cannot easily be activated wastefully (except for the Fire Step skill), for example by the No: use skill setting. Conditions to activate the skill are described as follows:

* Rush: The target room is your side's room. Crew is already in the target room. The target room is capable of charging.  
* Emergency repair: The target room is your faction's room. Crew is already in the target room. The target room has damage.  
* Toxic gas: Crew is already in the target room. The target room has an enemy crew.  
* Death: Crew is already in the target room. The target room has an enemy crew.  
* Hack: The target room is the enemy's room. Crew is already in the target room. The target room has the potential to consume energy, but is not necessarily consuming energy.  
* Destroy: The target room is the enemy's room. Crew is already in the target room.  
* Treat wounds: Crew is damaged  
* Heal: the crew itself is damaged  
* Arson: The target room is the enemy's room. Crew is already in the target room, the target room has not been destroyed or affected by fire from other sources.  
* Fire step: always active  
* Welding: Crew is already in the target room. The target room has an enemy crew.

#### Use skills during combat

Crew does not need to wait until entering a slot in the room to use skills. Instead it can use the skill immediately after entering the target room. Furthermore, skill use actions are also given priority before combat actions. If a crew with the poison gas ability enters a target room filled with enemy crews, it will be able to use the ability before any duel response occurs, and it will most likely clear that room's crew with its ability.

Crew also does not need to wait for the opposing crew to target the same room as them before they can use the skill. TLP is a place full of crews targeting another room and it would be absolutely fine if a crew brought in a gas bomb and detonated it there. Or a gunner with deadly authority will immediately execute a landing crew, even though the other crew is actually targeting a different target room and just happened to run by.

Because of the “immediate” mechanism above, it will be dangerous for a landing crew if it teleports into a room with a crew with defensive skills. Because 0.5 seconds of standing still is enough for the defensive crew to end everything.

Dead fist, toxic gas can aim and kill crews running across the room, regardless of whether that crew intends to target the room or not. But the cold crew is different, the crew running across the room will still be frozen, but the skill-casting crew cannot lock on the frozen crew to shoot it to death (read the section on target lock), if you can't lock on the target, you can't shoot, and at the end of the freezing time, the frozen crew will run away to continue its work.

#### Attack

Considering the case of two crews on opposing sides with the same skills that satisfy the conditions for using the skills (see previous section), the crew entering from outside the room will be able to use the skill before the crew standing inside the room.

#### Priority

If multiple crews of the same faction are in the same room and meet the conditions to use the skill, those crews will determine the crew that can use the skill first based on seniority.

### Mechanism of TLP room {#mechanism-of-TLP room}

![PSS guide illustration 21](/guide-images/image21.png)

The Teleport Room (TLP) is a 2×3 room, it has three slots where the crew on each side can stand. In the TLP room there is a teleportation portal, this is also a position that the crew can stand in. Once the crew has entered the teleportation portal and the portal is fully charged and not subject to EMP, the crew will be teleported to the target room on the enemy ship's side.

All crews, after receiving orders to target the target room on the enemy ship, will head towards the TLP room, more specifically towards the teleportation gate in that room. The first crew to reach the gate will stand at the gate and the other crews will wait in line. But the special thing here is that they do not stand in any room slots in the teleportation room, because their target room is not a teleportation room.

Due to not standing in the room slot, the crews waiting in line at the teleportation gate will not participate in hand-to-hand combat. They do not shoot at each other with enemy crews, nor are they targeted by enemy crews. They also do not target the room the TLP is standing in, so they will not use attack skills in the room the TLP is standing in. However, they will still receive crew damage from enemy ships' guns hitting the TLP room, or from skills from combat occurring between the two sides in the room.

Invisibility will make it impossible for the enemy's portal to locate and land the crew.

And finally, when the landing crew returns to the old ship, they will return to the portal itself and then move from there to the target room.

## AI basics {#ai-basics}

Everything in the game is controlled by AI (artificial intelligence), of course we can still adjust and coordinate the sailors, but AI is not only convenient but also helps us shape our fighting style.

### How to install AI {#how-to-install-ai}

At level 4, you have the CMD room, this room has a Capacity value and that is the number of AI commands you can place for your rooms or crew.

![PSS guide illustration 22](/guide-images/image22.png)

The number of AI command lines here is 2:

![PSS guide illustration 23](/guide-images/image23.png)

### Trigger condition {#trigger-condition}

An AI implementation is a statement of the form `IF <CONDITION> THEN <ACTION>` .

The game calculates the entire game state 40 times per second, called 40 frames. At each frame, if `<CONDITION>` is true, the room or crew will receive `<ACTION>` to perform at that frame.

*We see a crew going from room A to room B in 1 second. In reality, that crew received 40 consecutive orders to move in 1 second.*

Here are examples of some conditions:

![PSS guide illustration 24](/guide-images/image24.png)

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

### Action {#action}

![PSS guide illustration 25](/guide-images/image25.png)

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

### Manual control {#manual-control}

When you take manual control, you're actually adding a NO:do-whatever AI setting to the top of the AI settings list. Your command to do something falls into one of four action groups, just like other AI settings, and the effect when you override it will be different in each group:

#### Adjust energy consumption

You adjust the room's energy consumption by scrolling up and down.

The maximum amount of energy you can pull is equal to the room's current HP. In the opposite direction, the maximum energy level that the reactor provides is equal to its current HP.

\*Energy is a shared resource in all rooms. When you override the energy usage in one room, all energy management AIs in other rooms will no longer function, which is extremely dangerous if you encounter an opponent who is equal or stronger than you.

#### Choose ammo

You choose bullets by choosing bullets, that's all. And the room will shoot with that bullet forever. This setting does not affect other rooms.

#### Select target

When you select a target for a room or crew, the room will shoot targets that match the conditions you set until all possible rooms are destroyed. For crew, the crew will choose the room closest to them that satisfies the conditions.

#### Use abilities

You can force a crew to use an ability manually, by double-tapping the crew. This only works when the crew is in a place where they can use their abilities. Understandably, you cannot use the Destroy/Fire/Hack skill on your own ship.

\*\*\*A very important note about the mechanism:  
Crew's priority in using skills depends on their standing position inside or outside the room. To make it easier to understand, let's assume: Your Crew A is standing inside MLZ and has the skill Crit/Poison Gas. Your ship now has an enemy Crew B landing on it with the purpose of destroying your ship. The enemy crew also has the Crit/Gas skill. Crew B went to Crew A's room, the 2 Crew found each other \<3. At this point, you would probably think that 2 crews A and B would perform the Death Fist at the same time\!? But NO, Crew B will use the Death Fist and finish off Crew A first. In short, the priority of performing skill for crew entering the room from outside will always be higher than the crew standing in the room regardless of whether they are the enemy or our side.

### Summary {#summary}

This article is only about the basics, about the operating principles of AI. We will have other articles about tactics, and the indispensable participation of AI in them.

## Training for crew {#training-for-crew}

This section provides basic information only. They are not wrong, but currently PSS Viet has a training curriculum that is much more advanced than Training 2.0 below. Read on to learn about the basic elements, before delving deeper into becoming a nutritionist.

### What is Train? {#train-what-is?}

![PSS guide illustration 26](/guide-images/image26.png)Gym  
![PSS guide illustration 27](/guide-images/image27.png) Academy  
It refers to letting the crew into the Gym to practice, and letting the Crew into the Academic room to go to school. Training will increase health indicators, such as attack, HP, skills, stamina, repair. Going to school (that is, learning to drive a ship) will increase buff stats such as pilot, science, engineer, and weapons.

### Exercises {#practice-exercises}

You train by leaving the crew standing in the training room, then choosing a practice exercise/lesson and training the crew. Each type of exercise/lesson will increase a different set of stats, and a different practice time. After the training period ends, the crew will have the opportunity to increase the index that the exercise is aiming for.

An important note is that all exercises increase multiple stats at the same time. There is always an index that has the ability to increase more than the others, and that is the index that we will aim to train for the crew, we call it the main index. You can see examples through the three exercises below.

![PSS guide illustration 28](/guide-images/image28.png)

If we want to train the crew to have more HP, we will choose Muscle Tournament or Iron Man exercises. Both of these exercises have the ability to increase Stamina index. The percentage represents the maximum amount of stats the crew will receive after training. Saying "maximum" is because how much you receive is completely random. You can see that the train can receive a maximum of 11HP and 5 Stamina, but after training, you may also receive 0HP and 5 Stamina.

### Train points and train bars {#train-points-and-train-bars}

Every time the crew increases a certain stat point after training, the crew will receive one training point. The crew's training points will be displayed in the train bar:

![PSS guide illustration 29](/guide-images/image29.png)

Practicing will increase the train bar. After training, for each stat point successfully increased, the training bar will increase by 1 unit. The more advanced the crew, the longer the training bar and thus the more training it can do. Current 7-star crews have train bars that are 110 units long. Crew captain has the longest train bar of 200 units.

| Crew | Thanh train |
| :---- | :---- |
| [One star](https://pixelstarships.fandom.com/wiki/Common_Crew) | 50 |
| [Two stars](https://pixelstarships.fandom.com/wiki/Elite_Crew) | 60 |
| [Three stars](https://pixelstarships.fandom.com/wiki/Unique_Crew) | 70 |
| [Four stars](https://pixelstarships.fandom.com/wiki/Epic_Crew) | 80 |
| [Five stars](https://pixelstarships.fandom.com/wiki/Hero_Crew) | 90 |
| [Six stars](https://pixelstarships.fandom.com/wiki/Special_Crew) | 100 |
| [Seven Stars](https://pixelstarships.fandom.com/wiki/Legendary_Crew) | 110 |
| [Captain](https://pixelstarships.fandom.com/wiki/Special_Crew#Starter_Captains) | 200 |

The length of the train bar represents how much the crew can train, and is one of the factors evaluating the crew's potential.

### The phenomenon of “hard-train” {#phenomenon-“hard-train”}

Crew buff formula

`Base Stat * (100%+Training Buff%) * (100%+Equipment Buff%)`

If the index is not calculated in %, replace multiplication with addition.

There are many mechanisms that cause training effectiveness to gradually decrease over time, which we can call "stagnant" training. These mechanisms include:

1. The higher the total training index (train points) of the crew, the more resilient they are

2. An index that is trained a lot is more resilient than an index that is trained a little

3. The shorter the train bar, the faster it will grind. The toughness at training point 27/90 is equivalent to that at training point 30/100.

Up to now, there is no widely available information that clearly shows us what the formula for the above effects is like, whether they are subtraction or percentage or something else. But their purpose is only one, which is to make it difficult to train crews perfectly. And thereby making the game more interesting and worth learning.

The dulling effect can be overcome with a very strong drug shock. This will be discussed later.

### Fatigue {#fatigue}

![PSS guide illustration 30](/guide-images/image30.png)

After training, the crew will be tired. Crew fatigue is measured by the fatigue index, from 0 to 100\. The game does not display the exact number of fatigue levels and you can only predict that index through the crew's expressions as shown in the image above.

The longer the workout, the more tiring it becomes. Specifically in the "Training courses" section below.

For every hour of rest, the crew's fatigue points decrease by 1\. Points will start to decrease after the exercise ends, no matter when you receive the training results. An hour is reasonable, not long. You'll thank the game because it took that long.

For each point of fatigue, the crew's training performance will decrease by 1%. You'll also thank the game for it dropping like that. We will discuss this later.

### Training courses {#train-courses}

There are many exercises, but in general there are 3 modes that we call S1, S2 and S3. They have different training effects, the higher the level, the more stats they bring, and the higher the ability to overcome stubborn training, in exchange for the more training time and fatigue they bring.

| Color | Form | Time | Fatigue |
| :---- | :---- | :---- | :---- |
| ![This image has an empty alt attribute; its file name is MeditationGreenIcon.png](/guide-images/image31.png) | S1 | 45 minutes | 1 |
| ![This image has an empty alt attribute; its file name is RunningBlueIcon.png](/guide-images/image32.png) | S2 | 3 hours | 6 |
| ![This image has an empty alt attribute; its file name is PunchingYellowIcon.png](/guide-images/image33.png) | S3 | 12 hours | 24 |

### Train randomness {#train randomness}

Training results depend a lot on randomness. As mentioned above, a training exercise is expected to give \< 8% HP and \< 2 Stamina. That doesn't mean your rate of getting HP is 4 times higher than your rate of getting Stamina. It's that you have the ability to receive both of those indicators, and how much you receive is random from 0 to the maximum number in the description.

So the result you get can be 0.4% HP and 1.9 Stamina.

### Rounding {#rounding-of-numbers}

The random number mechanism will generate train results in real numbers, and the game will round that number to calculate the resulting result (after subtracting from hardness factors, of course). For example, the result of 0.4% HP above will be rounded to 0% HP and 1.9 Stamina will become 2 Stamina.

### Some notes for newbies {#some-notes-for-newbies}

* Focus on training just one or a few key indicators. And you need to find out very carefully which index exactly it is.

* Comply with train mode 2.0, or train 2.1, or 2.0+, 2.1+ below.

* If after calculating the buff your crew's HP is a decimal number, the game will round the number before each battle. So at the end of the training bar, you should absolutely stop training when your HP reaches a decimal number of 0.5. Training more will only give the same amount of HP, instead you should switch to training other stats.

### Training 2.0 {#training-2.0}

Look at Lilith below, she wasted 1 training point on repair, 2 points on pilot, 4 points on science, 2 points on engineer, a total of 9 points, out of a total of 41 trained points.

![PSS guide illustration 34](/guide-images/image34.png)

The same thing will happen to you if you simply put the crew in the room and then train. Each crew has exactly one set of primary stats to train. The problem is that all exercises can increase multiple stats at once. The train bar is limited and if you waste points on useless stats, you won't have points to spend on useful stats anymore.

We need to take advantage of "stubborn" mechanisms in training (read the previous section). Specifically, we make the crew stubborn, to the point that even if training increases the secondary index, after calculating with the "stagnant" factors, the result is less than 0.5, and in the final rounding step, the game gives you a result of 0% on the secondary index.

This method is called Training 2.0, it appeared somewhere in 2019, it takes advantage of the fatigue index beautifully, it does not require any bux investment, and it is effective. The number of wasted points can be reduced to 1/10 or less. Take a look at the beautiful train results below:

![PSS guide illustration 35](/guide-images/image35.png)![PSS guide illustration 36](/guide-images/image36.png)![PSS guide illustration 37](/guide-images/image37.png)![PSS guide illustration 38](/guide-images/image38.png)

An overview of this method is as follows:

1. You slowly make the crew tired, with small exercises (likely to have low secondary indexes).

2. When the crew is tired, they will be very stubborn in training. That's when we continuously use the most effective exercises to train. Until the crew's face turns blue to the point where it can't get any greener (at that point continuing to train won't do anything), then stop and let the crew rest.

3. Let the crew rest until a certain level of fatigue at which the crew remains stubborn

4. Repeat steps 2 and 3 until you can't train anymore

Step 1 is the most important step, step 1 needs to be completed completely before moving on to the next steps. If your training process is interrupted at any time, you need to repeat step 1 from the beginning, even if you do not gain any points. In that step, we need the crew to be tired, but we don't need to increase the index.

Specifically, the steps of training 2.0 are as follows:

1. Start up  
   1. train S1, repeat 11 times to move to face F1-10  
2. Warm up  
   1. Rain S3 continuously until death  
3. Train phase 1  
   1. Rest until the crew reaches F21-30  
   2. train S3  
   3. Repeat the above 2 steps until the training bar is 45% full (45% of the training bar, not 45 training points)  
4. Train stage the train bar is more than 45% full  
   1. Rest until the crew moves to F11-20  
   2. train S3  
   3. Repeat the above 2 steps until the train bar is 55% full  
5. Train stage train bar is more than 55% full  
   1. Rest until the crew moves to F1-10  
   2. train S3  
   3. Repeat the above 2 steps until the train bar is 65% full  
6. Train stage train bar is more than 65% full  
   1. Rest until the crew reaches F0  
   2. train S3  
   3. Repeat the above 2 steps until you surrender

### Training 2.0+ {#training-2.0+}

When training 2.0, the warm-up and warm-up phase is quite dangerous, there is still a chance that you will get hit with secondary stats because at that time your training bar is still low. If you get stuck like that, you have two options.

One is to accept reality and bear the cost of a few stat points.

Or two, you just keep warming up until the crew switches to the F91-100 side, then take a medicine to reset the training process (about 300 bux on the market). This potion will reset the training bar and erase all previous training results, but will not remove fatigue points. So you have a crew ready to start right away in step 3 of the 2.0 training process. This method is called 2.0+.

A few examples of results after a warm-up period in this way:

![PSS guide illustration 39](/guide-images/image39.png)![PSS guide illustration 40](/guide-images/image40.png)

And the final result:

![PSS guide illustration 41](/guide-images/image41.png)

### Training 2.1/2.1+ {#training-2.1/2.1+}

As analyzed above, the purpose of warming up is to make the crew's fatigue point high enough, so that the crew is tough enough, so that the sub-index training results are always less than 0.5 and do not affect the training results.

One disadvantage of training 2.0 is that it is time-consuming and rigid, you do not necessarily have to train the crew until they reach 100 before letting them rest and then repeating. You just need to know that with your current training bar, it is safe to train at any level of fatigue.

The level of fatigue to safely train S3 depends on the crew's training score. The higher the training score, the more stubborn the crew will be, so the necessary fatigue level will be lower (for longer rest). If the training score is low (the crew has just been trained), the crew is not very tough, and needs to be trained when they are more tired (give them less rest). Specifically, you can follow the following chart:

![PSS guide illustration 42](/guide-images/image42.png)

Just don't train at a lower fatigue level than the chart to be safe. This will help you train more flexibly and less stressed. As well as reducing training time at unnecessarily high fatigue levels.

You can still apply the train bar reset trick when using this chart.

Wish you success.

# Building a fighting style {#building-fighting style}

## Overview of gameplay {#overview-of-gameplays}

Translated from the original document [Overview‌ ‌of‌ ‌the‌ ‌Playstyles‌ ‌in‌ ‌Pixel‌ ‌Starships – ‌ ‌Uncle‌ ‌Jarvan‌](https://docs.google.com/document/d/1qN2TSvmm-XXK1RLcB9tQUhAZA2PwoXCrnE6FE7hoCcA/edit?usp=sharing)‌, version dated 3/23/2019.‌

In PSS, the goal of the gameplay is to achieve the goal you aim for as perfectly and efficiently and completely as possible. There is one absolute thing, which is that there is absolutely no playing style that is absolutely unbeatable. There is always a weakness that exists in a strong play, because there are always limits surrounding designing the perfect ship; That limit can come from the ship, crew, or AI.

This document is designed by the author to provide advice and guide you closer to the gameplay that was created for you.

### Gameplay terms {#gameplay-terms}

**Guns** ‌-‌ ‌‌refers to MLZ, PLA, or anything in the Laser Weapons group (see article [Handbook of Long Range Weapons](http://27.73.126.49/ship/1151/cam-nang-cac-loai-vu-khi-tam-xa/)).‌

**Cannon** ‌-‌ ‌‌Refers to ION cannon or EMP cannon, or any weapon belonging to the Cannon group.‌ ‌

**Missile** ‌-‌ ‌‌Refers to a missile launch room such as MSL,‌ ‌MML or a certain type of missile such as‌ ‌Penerators,‌ ‌Scarletts,‌ ‌Junglers,‌ ‌Rockets,‌ ‌Porcerers etc.‌ ‌

**Aircraft‌** ‌-‌ ‌‌Refers to flying objects launched from Hangar.‌ ‌

**Win condition‌** ‌(first,‌ ‌second,‌ ‌third)‌ ‌-‌ ‌‌ refers to the set of ways to win that your ship is focused on. Any method must result in the enemy ship's HP reaching 0. For example, the first way is to flood the enemy ship with bullets from the main gun. If that doesn't work, the second backup method is to use the ION cannon.

Advanced Strategy ‌-‌ ‌‌Refers to **extra win conditions**. For example, landings are backup win conditions, because they help increase the effectiveness of the main win condition by destroying the crew and operational systems of the enemy ship.

### Most common ways to play {#most-common-playstyles}

#### Gunboat

Gunships are ships that use laser gun systems as their main source of damage. Most players use this style of play, because in essence, to use any other style of play requires expensive and powerful secondary conditions to be deployed. So, just upgrading the room, and focusing fire with your ship's main guns, very powerfully, is a simple gameplay and doesn't require too much harshness.

The power of the gunship lies in its ability to fire concentratedly into a single room. However, it does not have many secondary victory conditions, and is easily weak against advanced tactics of enemy ships if not carefully calibrated.

#### Pen(-netration) Gunship (Cannon \+ Pen)

This is also one of the standard gameplay. It focuses on using missile cells (2 MSL, and preferably MML as well) to maximize DPS through penetrating missiles. However, the Pen ship not only uses Pen missiles as a source of DPS, it also uses laser guns to increase damage.

Pen ships are strong in that they have the ability to directly damage the ship's hull, and are supplemented with a significant amount of damage from laser guns. However, it is easily disabled, or captured by ships with fully buffed Engine rooms.

#### Pen(-netration) Hull-splider Gunship (Pure pen)

This gameplay is a variation of the Pen ship, but the difference is that it only uses missiles as the only source of damage. By eliminating other sources of damage, it gains the ability to equip and buff the Engine, Shield, and Shield Battery well, to defend well while the missiles slowly eat away at the enemy ship's HP. Repair and defense droids work wonders on this type of ship.

This style of play has very strong defense, and is very annoying. However, it is very weak against Disabler ships, as well as against ships with fully buffed engines.

#### Raider Gunship (Gunship \+ Assault)

This gameplay is based on the original gunship, equipped with an additional landing crew squad to attack the functional systems of enemy ships. Once a system on an enemy ship is breached, the guns on the ship will attack it and cause a huge amount of damage to the ship's hull. The raider ship needs to have a good enough main source of damage, because the landing crew itself cannot damage the ship's hull. Rushing the red crew is an effective tactic to speed up the landing process.

The raider's landing squad can completely turn the tide, because they activate the enemy ship's repair AI. A strong commando team can be stationed in an enemy room, waiting and destroying the incoming enemy repair crew, one by one.

However, the raider will lose its advantage when:

* Encounter another raider ship with a stronger amphibious team

* Having the enemy ship EMP or hacking the teleportation room

* The enemy ship has a discreet landing craft design

#### Carrier Gunship (Gunship \+ Aircraft)

Also known simply as carriers, this style of ship focuses on two win conditions: focus fire, and plane rush. This gameplay requires a strong crew rush to be able to rush 3-5 aircraft in a maximum of 1-3 seconds. The support of this gameplay lies in the ability to deal damage not only from the main gun set but also from aircraft.

Ships following this playstyle have significantly high laser damage, and can almost always keep the target room in a "crushed" state. Its priority is to neutralize the AA with EMP cannons and EMP missiles as well as damage it with concentrated fire.

Weaknesses of this ship:

* Expensive, the crew rush set is not strong enough and will cause the planes to almost always be shot down one after another before they can start shooting.

* Enemy ships with crew tanks with high HP can prevent you from quickly destroying the enemy's AA and causing you to gradually lose planes as well as lose the advantage of high firepower at the beginning of the battle.

### Advanced strategies {#advanced-tactics}

#### Disabler Gunship (Gunship \+ Disable)

Very few players use this strategy. It is equipped with 2 MSLs that fire EMP missiles combined with EMP cannons to disable core systems on enemy ships such as ION cannons, EMP cannons, teleportation rooms; Meanwhile, the main gun will punch the enemy ship's hull. The ability to disable three main systems of an enemy ship is very scary. But the weakness of this ship is its lack of overall damage when compared to other playstyles.

#### Disabler Gunship-Carrier (Gunship \+ Airport \+ Disable)

This ship is similar to the Disabler Gunship, except a Hangar is added as a secondary damage source. This ship usually disables 2 AAs, ION cannons, and TLPs. It still has the ability to disable three main systems of enemy ships at the same time, but adds a third win condition coming from aircraft. Its disadvantage is that it has lower DPS, and is weak against Raider ships.

#### Ion‌ ‌Rusher‌ ‌“Death‌ ‌Rey”‌ ‌Gunship‌ (Gunship \+ Rush ION “Death Ray”)

The ION rush ship focuses on rushing the ION cannon as the main source of damage alongside other guns. The goal is to have enough crew to rush to destroy as many IONs as possible and thereby deal maximum damage. Canon cannons are very effective at killing crew as well as draining hull HP from damaged rooms. However, this ship will lose power once ION is EMP, making it very weak against Disabler ships.

#### Turle Ship

The ultimate goal of a ship in this style of play is probably to lead the battle to a draw. It sounds strange but it is actually an applied gameplay. It uses rushers to frequently rush cloaks, and high sci crews to continuously restore shields. It also sets the crew to buff the engine. All to prolong the time this ship takes no damage. It is not intended to cause damage, and requires very high AI, but it is very difficult to defeat it, unless you are a strong Raider.

#### Turle Ship Disabler (Ship \+ Disable)

This ship is essentially a turle ship but is equipped with EMP missiles to reduce the enemy's overall damage, and increase the "turtle's" life time. EMP targets are typically enemy EMP cannons, ION cannons, and TLPs. This ship is less afraid of raider ships, but in return it is weak against Gunships.

#### Android‌ ‌“Voarder‌ ‌Droidicas”‌ ‌Gunship‌ ‌(Variant of‌ ‌Raider‌ ‌Gunship)‌

This ship focuses on deploying two android rooms that can produce landing droids, AS and VM. While using the main gun set as a source of damage, along with a few landing crews as a secondary win condition, the landing droids continuously produced by the robot factory will harass enemy ships. Because of their random landing nature, droids are capable of disrupting enemy ships' AI and defenses, as well as chipping away at enemy defenses to create targets that can damage the ship's main gun. The landing droid is the third win condition for this ship, and it can be destroyed if the TLP is EMPed. This play style is weak against Disabler ships.

#### Tele ‌Spam

This ship is a variant of the Raider, it deploys the maximum number of rushers to push away a large number of crew, not one or a few, but a large number to flood the enemy ship. The goal of the landing force is to disable the enemy ship by destroying the crew and operational systems, thereby causing the enemy ship to lose its ability to withstand ship fire. This style of play is very strong. It's not a weakness of this ship itself, but it has difficulty against enemy ships with frozen crews, ships equipped with many modules, or ships that focus on using VM/AS defense droids.

#### The‌ ‌Capital‌ ‌Ship

As the name suggests, this ship is capable of strongly deploying three different win conditions: Gunship, Raider, and Carrier. Usually with 5 rushers for Hangar and 1-5 tele crew. Once implemented, this playstyle is very strong because all three win conditions are very strong. The weakness (probably) lies in the ability to defend against an equally strong tele spam ship, or against a ship with similar but better gameplay.

#### 2The‌ ‌Capital‌ ‌Ship‌ ‌v.2

This variation uses an additional cloak. Thanks to the cloak, this ship is able to deploy landing troops and aircraft more effectively and safely. It's quite difficult to take down this ship, in general there aren't too many obvious weaknesses.

#### The‌ ‌Hidden‌ ‌Penetrating‌ ‌Raider

This ship uses cloak rooms heavily. It also needs to equip VM and AS. It uses the time it has the cloak for defense, recharges the TLP to send out the raider, and also fires penetrating missiles. The gameplay is very annoying. But this ship can be countered by Disable ships or ships with strong engines.

#### Cycles‌ ‌of‌ ‌Disabler‌ ‌Gunship‌ ‌Carrier‌

The goal of this ship is to completely "silence" enemy ships. It uses 2 MSLs, 1 MML, EMP cannons, PPs, PDs, and Cosair planes – everything that can cause EMPs – to complete the forbidden magic. Total of 21 mana – but it actually requires Hangar rush so the HAN room will only need to put 1 mana, bringing the required mana down to 18\. The remaining energy is allocated to the laser weapon set to take down enemy ships. This ship is difficult to lose, but because its DPS is quite low, it often ends in a draw if the enemy ship has a good defensive crew.

# Deploy your fighting style {#deploy your fighting style}

## AI gun {#ai-gun}

... waiting for someone to write, in the meantime, it's easiest to consult the AI menu at [PPG \- Intro to Room AI (pixelperfectguide.com)](https://pixelperfectguide.com/room-ai/intro-to-room-ai/)

![PSS guide illustration 43](/guide-images/image43.png)

## AI buff room {#ai-buff-room}

... waiting for someone to write

## AI repair {#who-repair}

... waiting for someone to write

## AI player {#ai-player}

## Amphibious and anti-landing {#landing-and-anti-landing}

### Introduction {#introduction}

The purpose of this guide is to provide a comprehensive reference resource on how to counterattack against amphibious crews. This document assumes that you are familiar with AI and other terms in the game, such as teleportation, landing, etc. If you are a new player, you should consult other documents before coming to this guide; Most of the content here is only relevant to players who are skilled and have almost reached the end-game or something like that.

This guide covers both the strengths and weaknesses of the three main amphibious strategies in the game, with an analysis of the different options for a player to counterattack in most situations, and, most importantly, a philosophy for cost-effective ship development that can be applied to any strategy. There are also suggested AI settings that the author can share in moderation, to help readers develop their ships and gameplay better.

Finally, always remember that PSS is ultimately simply a game of Rock-Scissors-Paper. By adjusting your ship to deal with landings, you lose the ability to deal with other tactics, such as gunships or pen-spam. This document does not guide you to find the most suitable balance for you, because each person will have a different crew, ship, level, and preferences that the author cannot predict. So let's just focus on its arguments surrounding the anti-landing theme.

— Amino^\#8666

### Types of landing {#types-of-landing}

To counterattack appropriately, the key is to understand how each type of landing works. In general, there are three main tea rooms, with their own strengths and weaknesses.

#### Landing is simple, basic

| Advantages | Weaknesses |
| :---- | :---- |
| • Less investment required. • Works well as an additional strategy alongside the main ship playstyle. • Extremely easy setup. | • Landing troops are sent slowly, and are therefore easily neutralized by EMP, enemy crews, or by direct fire from enemy ships. |

This tactic is often found on low level ships, or is used as an additional tactic for high level ships. It is very easy to deploy; Simply identify a few crews as landing troops, and if possible, add a few TLP buff crews. Another option is to use droids as landing troops, with absolutely no crew cost, while still serving the purpose of dealing damage. No matter what method is used, the AI ​​to deploy this landing method is extremely simple.

#### Urgent landing

| Advantages | Weaknesses |
| :---- | :---- |
| • Send landing troops SUPER fast • Movement order can be easily arranged to protect against mines, send tanks to take damage... and many other tactical purposes. | • Large investment • If not protected well enough, TLP may not operate smoothly and the landing plan will be problematic. • AI rush can be interrupted depending on various conditions. • Crew rush often "shakes". |

This strategy is shaped by two (sometimes one) rows of crew rushing towards the TLP right from the beginning of the fight. It works by having 100% rush crews run into TLP, use skills, and run out immediately. That helps TLP to be continuously rushed to send landing troops to enemy ships.

This method sends troops super quickly. It easily sends 5+ crews to land on enemy ships in just a few seconds, quickly disabling defenses, destroying crews, cutting off energy, hacking... enemy ships.

The power of this tactic lies in its ability to send dangerously large numbers of landing crews. If not many are sent, or if the landing party is not strong enough to be "dangerous", this tactic will become a sham. It therefore requires a huge amount of resources to invest; For every landing crew you need to send, you need a rush crew that is fully trained and equipped, and not only that, but also has to be able to do something else after the rush is done (it's that "other thing" that sometimes causes the rusher to go into a "shaking" state). Besides, if you have the ability to interrupt the TLP defense (using EMP), or interrupt the AI ​​(or smash to death) the rusher, you will easily break the enemy ship's wing.

#### Landing in an instant

| Advantages | Weaknesses |
| :---- | :---- |
| • Make sure to send all landing troops at once. • Send troops SUPER fast. • Difficult to counterattack. | • Need to invest heavily. • Need cloak. • Landing troops are susceptible to mines or skills from enemy defense crews. • AI rush can be interrupted in many different ways. • Crew rush often "shakes" for many different reasons. |

This method is similar to sending troops continuously; The core difference is that it uses rush cloak. The ship will immediately cloak at the beginning of the game, during which time the landing crew will be "checked" into the TLP room. As soon as the cloak runs out, all previously "stored" crews will be sent, at once.

This method has the same advantages as sending troops to land continuously: send very quickly, and in large numbers. Being fast and numerous is the key for landing ships to win. At the same time, using a cloak helps ensure that landing troops are sent successfully, reducing the possibility of encountering incidents such as missiles or EMP artillery.

This strategy is VERY difficult to counter, but it is still possible. Landing troops still have the possibility of being hit by mines or encountering crews with defensive skills, such as ice, poison, or death power. Some AI strategies can significantly limit the number of landing crews teleported to. And most importantly, this landing method requires a huge crew investment, and the ship's ability to win this way depends almost entirely on the crew. If you arrange carefully to defeat the landing troops, the enemy ship will be done.

### Anti-landing solutions {#anti-landing-solutions}

All amphibious tactics aim for a win condition: destroy all enemy crew and then the guns/missiles on board will finish off the enemy ship. So, instead of thinking about how to imitate a specific amphibious strategy, it would be more effective to improve anti-landing capabilities across a wide area. This section will suggest solutions to do that, but still retain the ability to capture different specific landing tactics.

#### Thinking

A good plan, regardless of whether it is prevention or control, must be cost-effective.

If you can smash the landing force, you win. In theory, it's as simple as that.

There are two options proposed: prevention and control:

* Prevent: disable the enemy's landing ability.  
* Counter: engage the landing troops after they have landed on your ship.

Besides, when estimating, the option must be cost-effective, basically worth it. If you trade 9 of your crews just to destroy 4 landing crews, the enemy ship will have more crews than you, and your ship will lose DPS for the rest of the fight, which is ineffective. Efficiency will run through the rest of this article.

#### Arrange the layout and set the crew

##### Crew arrangement

The ability to deal with landing troops lies with your ship's crew. Accordingly, a strong ship is a ship with a good crew, well prepared, to handle the landing crew. It's not always better to have more crews, but there must be a reasonable number.

The landing crew needs to have ice bomb or death blow skills, and in addition need to have the ability to stand at gunpoint (other missions are also good, but standing at gunpoint is the best, related to layout issues). Legend can include Galactic Maiden and Lilith, non-legend can include Hydra, Namith, North Bear, Guan Yu, Liu Bei, Ichigo, Tiger Wood. Crews with gas bomb skill can also use it, such as Taura.

For example, the Northern Bear has good Weapon stats, in addition to quite high HP and ATK. The most important thing is that it has the ice bomb skill, once used it will freeze all landing troops in the room, then let the bear attack and can destroy 1-3 enemy crew (worth it). So the Northern Bear will be useful for standing guns while still having the ability to fight in landing combat.

Or another example, Lilith, a crew legend, with high WP, ABI, ATK, HP stats. It not only has the ability to be one of the best standing gun crews in the game, but also has the ability to punch and kill most landing crews if properly trained and equipped with items. Having a lot of liliths will significantly increase your ship's DPS, in addition to its ability to counter landings. Or another crew worth mentioning here, Galactic Sprite. This is not a standing gun crew, it has high HP, fast running speed, walks as fast as running (does not require stamina), high repair stat, decent SCI and ENG stat, useful ice bomb skill.

It can be said that Galactic Sprite and Lilith are the most valuable crews in the game at the moment, prioritize pressing these two crews if you can.

##### Arrange the rooms

Layout is often overlooked by players with a little experience. In fact, optimizing room layout can help you simplify AI, speed up reaction times to landing troops, and gain an advantage in combat. There are some useful room placement strategies as follows.

###### *Security room right on the left*

The location of each room on your ship must have a specific purpose. When a crew moves towards the target room, entering from the left side, or in other words, entering from the stern is better for it. Before the crew can stand in one of the room slots, they will not be able to engage in hand-to-hand combat, and will take fire from the enemy crew in vain (see the article [Crew-combat and anti-landing combat mechanics](http://27.73.126.49/co-che/808/crew-combat-101/)).

Therefore, you should arrange the rooms so that the rooms often targeted by landing troops (REA, especially REA) are immediately to the right of the rooms with defending crews, so that you can deploy defensive combat as quickly as possible.

![PSS guide illustration 44](/guide-images/image44.png)

In the image above, the leftmost REA and FREA cannot follow this rule, so they are mined (more on this later).

###### *Guard door*

Also in the image above, you may notice that in order to move from one REA to another, the landing crew needs to pass through a laser room, and there it will encounter the defending crew. This tactic is called “guard door”, you force the enemy crew to take on a ton of attack skills at once. Allows your crew to focus on their guns, instead of having to chase the landing troops, without sacrificing the ship's defenses.

###### *Avoid getting stuck in the elevator*

Ladder jams are a nightmare when landing defense is needed. It negatively affects the reaction time of the defense crew as well as the repair crew, creating conditions for the enemy crew to cause damage to the room, causing the ship to lose its ability to operate stably and be susceptible to hull damage. Design the layout to minimize the time the crew has to wait for the elevator, to the extent possible.

##### Mines and barricades

Mines are SUPER useful when used to trap tele-playing ships in the early and mid game. They deal a ton of damage and can usually blow away most landing crews. However, at high ranks, mines are often neutralized by EMP, be it from EMP artillery/missiles, or by crew collection effects like the Savy or Ardent sets.

Since then, barrier modules have become more popular in REA for a number of reasons:

1. Barriers can be placed anywhere; and can be used in any situation. Unlike mines that are only used to prevent landings, barriers will be useful when fighting gunships (except penspam ships, of course).  
2. During landfall, your REA time delay barrier is damaged, allowing your critical systems to operate normally for a period of time. This is especially important when you encounter large crew landing ships, usually when your ship's energy will drop to 0 in an instant if there are no barriers. Having a barrier means your ship can still operate during the time your landing crew has not yet deployed defense.  
3. Strong barriers can help you make it difficult for the crew hunting AI of ships playing the crew hunting laser AI.

There are many other parameters that influence the choice between mines and barriers, such as your layout, meta, and crew. In the picture above, the FREA is quite far from the defending crew and is therefore mined. That's an example.

##### AI Settings

This section points out some of the most useful and popular AIs for amphibious defense.

###### *AI uses skills*

Compare (A) and (B) below. Only a small difference, but radically affects the effectiveness of the crew's skills.

1. Target room with enemy crew: Use skill  
2. Don't: Use skills

Using (A), the crew will not use the ability as long as it and the enemy crew are targeting the SAME room. This means that if they meet each other in the same room on the way to two different rooms, the skill will not be used. Meanwhile, when using (B), the crew will use skills whenever possible.

![PSS guide illustration 45](/guide-images/image45.png)

Crews with the freezing skill need to use AI (A). If they use (B), they will freeze the enemy crew as soon as they meet. If the opposing crew does not intend to go to the same target room as them, the defending crew will not be able to attack, and the freeze time will pass meaninglessly.

![PSS guide illustration 46](/guide-images/image46.png)

On the contrary, crews with death or gas skills will use (B) to take down the landing crew as soon as they meet.

###### *AI search and destroy landing*

Use the following AI line (line 3 in the picture), to make the defending crew run to the room the landing troops are targeting.

Friendly room with landing crew: Choose a room that meets the conditions

![PSS guide illustration 47](/guide-images/image47.png)

You need to have researched Python 3 to use AI to detect landing troops. If you don't have it, use AI later but the reaction speed will be a bit slower, because the crew will only go on defense after the barrier has broken and the defense HP has started to decrease:

1. Reactor HP \< 100%: choose the same conditions  
2. Anti-aircraft artillery HP \< 100%: choose room condition

...

Repair crews can set the defense HP sensitivity setting to 50% or lower, so the defending crew will run to defend, before the repair crew runs to repair, which is very useful.

###### *Dealing with Galactic Archemis*

GA is a crew that is not easy to deal with (see the article [Galactic Alchemist](http://27.73.126.49/crew/1245/galactic-alchemist-nha-gia-kim-thien-ha/)). A GA with a high ABI score will have a long burning time, and not only that, causing the fire to have incredibly high damage, enough to one-shot any low-health crew, as well as help the GA heal any source of damage that is not high enough to one-shot it.

To defend against GA, you basically need a crew:

* has high fire resistance to fight, over 100% resistance to survive on fire, and over 120% resistance to survive on fire \+ GA's atk.  
* or have instant repair skills to put out fires  
* or have very high HP \+ ATK to kill GA first  
* have as many of the above conditions as possible, on the same crew, or shared across a crew

The repair crew's AI can be set as follows:

`Target room is on fire: Use skill`

In some cases, the enemy will set your ship on fire in many different ways outside of GA, to confuse the repair AI. You should place the following line above the repair AI line to counteract the opposite:

`Target room has no enemy crew: Do not use skills`

If you don't have Python 3 yet, use the following line instead, it won't be as effective but will be fine for your rank:

`Target room HP > 0: Do not use skills`

###### *Stealth*

Stealth can mess up the rusher AI of ships using the flash rush mechanism, in addition to limiting the number of troops that can land on your ship at the same time in case of confrontation with large troop landing ships.

You need one or two 100% crew rush and an invisible cloak (Cloak Generator). Use the following AI:

`Friendly room with landing troops: Use skill`

As soon as the first crew lands on your ship, the stealth cloak will be activated and interrupt the enemy ship's troop landing (in case of flash rush). In case you encounter a large troop landing, you can limit the number of troops landing on your ship at the same time, and gradually regulate it by cloaking multiple times.

###### *EMP*

EM can neutralize enemy TLP, and that can be achieved through a number of ways:

1. EMP missiles: fired from MSL rooms or from Corsair aircraft, EMP missiles are cheap, simple and useful. Their weakness is that it takes a long time to reach the target, and is likely to be avoided by engines.  
2. EMP Cannon: the most powerful EMP weapon on the ship. If buffed enough, it can cause 3 (or even 4\) systems on the enemy ship to be EMPed at a time.  
3. Send a landing with the passive skill Hack/EMP: you can use crew rush to immediately send a crew with the passive skill Hack/EMP (from a collection, like Ardent or Soda) to the enemy ship's TLP in hopes of neutralizing it.  
4. PP: if the enemy ship does not have a shield, the PP acts as a small EMP gun. However, EMP should only be considered as an additional bonus and should not be relied on too much, because it has a fairly short duration of effect.  
5. PD: better than PP, but you still shouldn't rely on its EMP ability.

## Crew building handbook

waiting to write

# Other issues {#other-issues}

## Handbook of long-range weapons {#manual-of-range-weapons}

PSS is of course more complicated than the 1990 Tank game, two ships shooting at each other don't just lose HP every time they get hit by bullets, but the real thing is much more complicated. There are dozens of different types of guns and sometimes each gun has dozens of types of bullets. Each type of bullet causes a different effect on the ship.

### Ranged weapon groups {#ranged-weapon-groups}

Ranged weapons here are defined as objects that can damage something, without requiring contact. Radar and cloak do no damage, and guard doors and droids require contact, so they will not be listed in this article.

#### Grouped by damage properties

A weapon can cause one or more different types of damage (damage). This article is about weapons, so it won't go into too much detail about damage, but understanding damage types is also an important part of understanding weapons. The grouping of damage types is as follows:

* System damage: damage per hit to the room and module in the target room. Basically, it causes the room to break. Reduced by room's armor. Once the room is destroyed, system damage will be converted to hull damage.  
* Crew damage: hit damage to all crew members in the target room. Not reduced by armor.  
* Shield damage: hit damage to the ship's energy shield. Of course not reduced by armor.  
* Armor-Piercing Damage (Armor Piecing - referred to as AP): deals system damage upon hit to the target room, but is not reduced by the room's armor, and conversely does not convert into hull damage after the room is destroyed.  
* Fire damage: fire burns the room and deals damage over time to the system at the same time as crew damage. Fire damage is reduced by armor, however it does not convert to hull damage after the defense is destroyed. Fire also has a special effect that forces the crew to put out the fire first before repairing the room. And the fire extinguishing time can be reduced if the crew is supported by the fire hose module in the room.  
* Electromagnetic interference (EMP): debuff over time, making the room inoperable. The power consumption room cannot be charged, the energy room cannot be discharged, mines are disabled, and fire hydrants are not working. When the EMP timer expires, the rooms and modules will return to normal operation (however, the mine will not continue to detonate even if it has been triggered, and the hose cannot help extinguish fires that break out while it is EMP). The EMP is disabled when time runs out or the room is destroyed.  
* Direct Hull Damage (DHD): directly subtracts the HP of the ship's hull. Reduced by armor.

#### Grouped by warhead type

Weapons are also grouped based on the shape of their warheads, which generally fall into two groups:

* Laser bullets: refers to energy bullets, the characteristic of this type of bullet is that it does not have a warhead and therefore cannot be dodged, but they can be stopped by the ship's energy shield  
* Bullets with warheads (missile): refers to physical bullets, basically your ship throws "balls" of something to the enemy ship, such as all types of missiles, or rockets of grenade launchers, or warheads of Fire Eagle aircraft. The characteristic of warhead bullets is that they fly through energy shields, but conversely they can be dodged by the ship's Engines.

#### Grouping by AI room group

Finally, the weapon rooms are grouped into groups by the game's AI engine as follows:

* Laser gun: is the most numerous type of weapon in the game, only weapons that fire energy bullets, except anti-aircraft guns and cannons  
* Missile firing rooms: only rooms that fire missiles, there are many types of missiles with different damage structures. A missile is a type of warhead and as such it can be dodged.  
* Anti-aircraft artillery: has only one type of defense, and also fires lasers, but because of its sensitive tactical importance, it is placed in a separate group by the AI  
* Cannon: includes EMP Cannon and ION Cannon, one is a disabling/defensive weapon, and the other is an offensive weapon. Both are energy weapons and are both powerful and tactically sensitive.  
* Hangar room: can release many types of aircraft with different damage structures.

The rest of the article will go into detail about the damage structure of each weapon in the groups. The parameters were taken when the ship was level 11 and all rooms and research were at maximum level.

### Laser weapon {#laser-weapon}

The laser weapons group refers to weapons that fire energy projectiles (without warheads). They have a varied damage structure and the chart below only depicts their general DPS. HAN Def refers to defender aircraft – included for reference, noting that there can be up to 5 aircraft operating.

![PSS guide illustration 48](/guide-images/image48.png)

#### Mining laser (MLZ)

![PSS guide illustration 49](/guide-images/image49.png)

There's not much to say, the weapons you have from the beginning of the game have stable DPS, have moderate HP levels, and deal versatile types of damage. It's not too strong, but always trustworthy.

MLZ is buffed by weapon stats.

![PSS guide illustration 50](/guide-images/image50.png)

#### Bolter (BT) – Submachine gun (TL)

![PSS guide illustration 51](/guide-images/image51.png)

BTs have decent damage compared to the amount of energy they use. However, the downside is that their HP is too low, making them an easy target for opponents to penetrate your ship. Most players will gradually eliminate their dependence on BT from level 7 and replace it with other safer 2×2 rooms, like PP/MG or K cannon.

Botter is buffed by weapon stats.

![PSS guide illustration 52](/guide-images/image52.png)

#### K Cannon (KB/KP)

![PSS guide illustration 53](/guide-images/image53.png)

The K cannon can be purchased with dove or bux. They are a good replacement for BTs with slightly lower DPS but in return have 2HP and bullets fired in 3 voleys.

K cannon is buffed by weapon stats.

![PSS guide illustration 54](/guide-images/image54.png)

#### Small Weapons Platform (SWP)

![PSS guide illustration 55](/guide-images/image55.png)

This is a 2×2 gun platform that you can deploy one of three types of guns on, including Machine Guns, Photonic Guns, and Biocide Guns.

##### Minigun – Dalian (MG)

![PSS guide illustration 56](/guide-images/image56.png)

MG has a special shooting style. It fires continuously (voley) from 50-140 rounds, with a delay of 0.25ms, causing the target room to be in a state of continuous damage for 25-37 seconds and forcing the enemy crew to constantly stay in there to repair. Detaining 2-3 enemy crew means 1/10 of the enemy ship's maximum crew, for half a minute, too cheap for only 2 energy. However, the shield-breaking MG is very weak due to its non-destructive nature. If your remaining gun system is not strong enough to destroy the shield, the MG will not be able to shoot effectively.

MG needs to reload to fire, and it is buffed by weapon stats.

![PSS guide illustration 57](/guide-images/image57.png)

##### Photonic gun (PP)

![PSS guide illustration 58](/guide-images/image58.png)

PP is a specialized weapon for breaking shields. In case the opponent no longer has a shield, PP hitting the target room will cause EMP 1s along with some system damage.

You need PP if you are often made difficult by your opponent's shields. PP needs to reload to shoot. And it is buffed by the science stat, not WP like in other laser gun rooms.

![PSS guide illustration 59](/guide-images/image59.png)

##### Sterilizer – Life Killing Gun (ST)

![PSS guide illustration 60](/guide-images/image60.png)

ST requires a level 11 ship, and is the ultimate weapon for controlling crews. It absolutely does not deal any damage other than crew damage. ST needs to be used carefully so as not to hit the opponent's shield. It requires reloading, and is buffed by weapon stats.

![PSS guide illustration 61](/guide-images/image61.png)

#### Plasma Cannon (PLA)

![PSS guide illustration 62](/guide-images/image62.png)

Specialized weapon to kill crew, and is a perfect replacement for submachine guns. Needs gas to shoot, and is buffed by weapon stats.

![PSS guide illustration 63](/guide-images/image63.png)

#### Medium-sized weapon platform

![PSS guide illustration 64](/guide-images/image64.png)

This is a 3×2 gun platform where you can deploy one of three types of guns: Laser Cannon, Railgun, and Photonic Cannon.

##### Laser Cannon (LB)

![PSS guide illustration 65](/guide-images/image65.png)

LB is like an upgraded version of MLZ, consuming more energy means more durability, and higher damage. It requires reloading, and is buffed by weapon stats. This is the weapon that gives the highest hull damage among medium-sized weapons.

![PSS guide illustration 66](/guide-images/image66.png)

##### Railgun

![PSS guide illustration 67](/guide-images/image67.png)

The Railgun has a fairly long reload time, however with 2 AP damage, it is very effective in terms of destroying target rooms, meaning it can destroy most important 2×2 rooms with just one shot and create conditions for other guns on your ship to damage the hull immediately after. You will like the Railgun in the endgame when most of your opponents are experienced and have the ability to armor very well in low HP rooms.

Rail guns need to be loaded to fire and are buffed by weapon stats.

![PSS guide illustration 68](/guide-images/image68.png)

##### Photonic Cannon (PD)

![PSS guide illustration 69](/guide-images/image69.png)

Similar to PP but with even higher shield damage. This is the ultimate weapon to specialize in shields.

PD has voley 4, it needs to reload. All photon weapons are buffed by science stats, and so is PD.

![PSS guide illustration 70](/guide-images/image70.png)

### Rocket {#rocket}

Missile chambers fire missiles, firing chambers create the rate of fire, but missile warheads shape the lethality structure. All missiles are warheads, meaning they have the property of shooting through shields, but otherwise they have the ability to be dodged by the Engine.

#### Missile launchers

![PSS guide illustration 71](/guide-images/image71.png)MSL![PSS guide illustration 72](/guide-images/image72.png)MML

There are two types of rocket launchers in the game. The Missile Launch Room (MSL) is the basic room and you can have up to 2 of them. Meanwhile, a multiple rocket launch room (MML) is a room purchased with dove or bux and you are only allowed to have a maximum of 1\. MML only has 1HP and you should only use it when you have good defense for it.

The missile chamber determines the number of missiles it can hold, as well as the missile launch rate, while the missile head shapes the lethality profile.

#### Types of rocket heads

##### Rocket

![PSS guide illustration 73](/guide-images/image73.png)

Rocket is a basic missile, it deals both crew damage and system damage. If fully researched, it can be fired as a 3 volley, which is more expensive but does more damage.

##### Javerlin/Fire Cult

![PSS guide illustration 74](/guide-images/image74.png)

Specialized warheads deal AP damage, ignore room armor, and destroy target rooms.

##### Jungle

![PSS guide illustration 75](/guide-images/image75.png)

The warhead specializes in treating crew, you may want to find a way to set the AI to find and destroy the crew to use this warhead.

##### Penetrator/Piercing Missile

![PSS guide illustration 76](/guide-images/image76.png)

The warhead causes direct damage to the ship's hull (HDH).

##### EMP

![PSS guide illustration 77](/guide-images/image77.png)

Warheads cause EMP effects.

##### Scalet

![PSS guide illustration 78](/guide-images/image78.png)

The warhead causes damage through setting fire to the target room.

The damage structure of the above types of warheads is as follows:

![PSS guide illustration 79](/guide-images/image79.png)

### Cannon {#big-cannon}

Cannons are rooms that fire energy bullets. They are expensive in both area and capacity, but are dangerous and play an important role in strategy. You will have to learn a lot about AI targeting and AI energy management to be able to master these expensive guns.

#### EMP Cannon (EMP)

![PSS guide illustration 80](/guide-images/image80.png)

As the name suggests, EMP cannons cause EMP. Although it is a cannon, it actually has a disabling/defensive effect, and is considered the second most important defensive weapon on a ship, after shields. The EMP causes the chamber to become inoperable for a long period of time, dealing some system damage, hull damage, and negligible shield damage. Besides that, nothing more needs to be said.

EMP is buffed by weapon stats and it requires reloading.

![PSS guide illustration 81](/guide-images/image81.png)

#### ION Cannon

![PSS guide illustration 82](/guide-images/image82.png)

The ship's cannon, the pride of the lvl 11 ship\. Expensive (it needs to charge Ion core to fire, and consumes quite a lot of gas) and the damage is extremely high. However, it also consumes a fair amount of energy and you will want to have 100% crew rush to be able to set the ION cannon at 1 energy. As well as having to distribute energy properly when the rush is over.

ION fires 11 bullets continuously, and it is buffed by weapon stats.

![PSS guide illustration 83](/guide-images/image83.png)

### Airplane {#airplane}

![PSS guide illustration 84](/guide-images/image84.png)

Hangar

![PSS guide illustration 85](/guide-images/image85.png)

Turkey Hanger

Airplanes are launched from hangars - aircraft launch tunnels. There are two hangars in the game – the Hangar (HAN) room is available and the Turkey Hanger (TUR) room is available through daily sales.

The TUR room takes up less space, consumes less energy, but in return takes longer to reload, can hold fewer aircraft, and can only produce a single type of aircraft. Meanwhile, HAN can produce many different types of aircraft to serve a variety of tactics.

In terms of combat, aircraft types differ in flight speed, warhead type, damage type and damage. The most obvious difference is in anti-mechanical aircraft and the remaining types of aircraft, because anti-mechanical aircraft have a significantly slower rate of fire and flight speed, and conversely have significantly higher HP than the other types.

#### Interceptor – Interceptor fighter

![PSS guide illustration 86](/guide-images/image86.png)

Interceptor

It is the first type of aircraft that you can unlock. Fighters are high-speed aircraft. Although the damage is small, the firing frequency is very high, plus the ability to quickly approach enemy ships helps the fighter cause a formidable amount of damage. The fighter's weakness is its low HP, making them unsuitable for attacking ships well equipped with anti-aircraft weapons.

#### Stinger – Spy

![PSS guide illustration 87](/guide-images/image87.png)

Stinger

It is the cheapest type of plane. Stinger doesn't have much to say. They have high speed but are not superior to fighters, their DPS is not high. They can't even do the bait task - draining the enemy ship of 4 energy from enemy anti-aircraft guns, because their HP is too much. Not worth using when compared to the cost of construction time, storage space, and reload time of Hangar.

#### Defender – Mechanical room

![PSS guide illustration 88](/guide-images/image88.png)

Defender

Contrary to stingers, defender aircraft have high HP, although their firing speed is slow, they are compensated by high damage per shot, allowing them to maintain a reliable amount of damage. Therefore, unlike fighters, defenders can be used in all cases, even when enemy ships have anti-aircraft guns. The disadvantages of defender lie in its slow flight speed, taking up a lot of Hangar capacity, and long construction time.

#### Firehawk – Fire Eagle

![PSS guide illustration 89](/guide-images/image89.png)

Firehawk

The special feature of Fire Eagles lies in their damage type. First, unlike other aircraft, the Fire Eagle launches warheads. This means that the Fire Eagle's bullets pass through shields, but can conversely be dodged by the Engine. Second, Fire Eagle's bullets only deal fire damage. This means that it does not directly damage the hull, but can instead support other weapons that damage the hull, by forcing the enemy crew to put out the fire first.

## List of expanded rooms {#list-of-expanded-rooms}

The rooms below are not available in the game's store but are only sold by bux through the daily shop; by dove via shop dove; or with a bonus when depositing. They may or may not be an important part of the ship, may be part of the gameplay, or may not be. And they affect your plan to use bux, dove, and your plan to participate in the season (tour) to get your dove.

Note, the list below is not guaranteed to be complete, some rooms have equivalent functions to those listed here, are no longer for sale, or are not for sale and will not be listed.

### Expanded droid room {#expanded-droid-room}

![PSS guide illustration 90](/guide-images/image90.png)

Visiri Mechbay (VM, 2×2) – a multitasking Android room, equivalent to AS level 6 but uses less power.

![PSS guide illustration 91](/guide-images/image91.png)

Zongzi Factory (ZF, 2×2) – only produces Zongzi Droid (hybrid between defense and repair droid)

![PSS guide illustration 92](/guide-images/image92.png)

Ghostly Factory (GF, 2×2) – only produces Ghostly Holo Droids (defense droids)

### Extended bed room {#extended-bed-room}

There are a total of 9 extra beds, helping to expand 10 crew. There is one bed that is not sold daily, two beds that are sold very rarely, and the remaining beds that are sold more frequently, every 4-6 months.

![PSS guide illustration 93](/guide-images/image93.png)

Dog House (DH, 2×2) – dog house, only sold with late support package ($45 on homepage)

![PSS guide illustration 94](/guide-images/image94.png)

Aquarium (AQU, 2×3) – fish tank, squid house, single extended bed room that can level up and accommodate 2 crew. Sold in dove shops and rarely sold through daily sales.

![PSS guide illustration 95](/guide-images/image95.png)

Captain’s Quarters (CAP, 3×2) – the captain’s private room

![PSS guide illustration 96](/guide-images/image96.png)

XMas Tree (XMA, 2×2) – Christmas tree

![PSS guide illustration 97](/guide-images/image97.png)

Graveyard (GRA, 2×2) – grave

![PSS guide illustration 98](/guide-images/image98.png)

Cat House (CAT, 2×2) – cat house, home of Meowy, the mascot of this site

![PSS guide illustration 99](/guide-images/image99.png)Oven (OVE, 2×2) – oven, home of Turkey

![PSS guide illustration 100](/guide-images/image100.png)Cryopod / Zakian Cryopod (CP / ZCP, 2×2) – sold through dove shops and rarely sold through daily sales

![PSS guide illustration 101](/guide-images/image101.png)

Car Garage (CAR, 2×2) – garage

### Hangar expansion {#hangar-expansion}

![PSS guide illustration 102](/guide-images/image102.png)

Turkey Hangar (TUR, 2×2) – produces the Turkey Craft, a desirable item for Hangar ships.

### Expanded practice room {#expanded-practice-room}

![PSS guide illustration 103](/guide-images/image103.png)

Galaxy Gym (GYM, 3×2) – Ngan Ha Gym, equivalent to a level 9 Gym, but can train 3 crews at the same time

![PSS guide illustration 104](/guide-images/image104.png)

Lunar College (LUN, 2×2) – Moonlight Academy Equivalent to a level 9 academy, can train 2 crews at the same time

### Expanded security room {#expanded-security-room}

![PSS guide illustration 105](/guide-images/image105.png)

Disintegrator Gate (DG, 2×2)

![PSS guide illustration 106](/guide-images/image106.png)

Small Gas Trap (-, 1×2)

### Expanded medical room {#expanded-medical-room}

![PSS guide illustration 107](/guide-images/image107.png)

Toilet (WC, 2×2) – WC

![PSS guide illustration 108](/guide-images/image108.png)

Flower Gardens(FG, 3×2) – flower garden

### Expansion Reactor {#expansion-reactor}

![PSS guide illustration 109](/guide-images/image109.png)

Coal Reactor (CR, 2×2) – Coal-powered reactor, can be upgraded to level 2, grants 2 energy

### Expanded AI Room {#expanded-ai-room}

![PSS guide illustration 110](/guide-images/image110.png)

Computer Room (COM, 2×2) – Computer room, allows saving 25 lines of AI, more than CMD level 7 but less than CMD level 8, and saves 2 squares of ship space

### Expanded warehouse {#expanded-warehouse}

![PSS guide illustration 111](/guide-images/image111.png)

Workshop (WOR, 2×2) – Workshop, capacity 150\. Can be updated to level 2 to have a capacity of 400

### Expansion Engines {#extension-engines}

![PSS guide illustration 112](/guide-images/image112.png)

Fusion Drive Engine (FDE, 3×2) – equivalent to a level 6 engine, can only be obtained through a late support package purchased on the website.

### Expanded Weapons Room {#expanded-weapons-room}

![PSS guide illustration 113](/guide-images/image113.png)

The K cannon, which fires bullets similar to the Bolter/Submachine gun, is not much stronger than the submachine gun, in return consumes more energy and thus overcomes the TL's weakness of low HP. Sold for 100 doves at the dove shop.

![PSS guide illustration 114](/guide-images/image114.png)

Multi Missile Launcher (MML, 3×2) – Multiple missile launcher. Fires exactly like the MSL room but holds fewer missiles, and only consumes one energy, giving the ship an additional weak point that can be easily attacked. Sold for 100 doves, and is a favorite among penspam players.

![PSS guide illustration 115](/guide-images/image115.png)

Particle Discharger (PAD, 3×2), called Phraser for short, is a weapon similar to MLZ. Can only be obtained when purchasing a late support package. Damage is unstable.

### Expanded Mineral Mining Machine {#Extended-mining-mining-machine}

Just to list it all, the rooms below are generally misleading people.

![PSS guide illustration 116](/guide-images/image116.png)

Prototype Mining Drill (MIN, 2×3)

![PSS guide illustration 117](/guide-images/image117.png)

Prototype Gas Extractor (GAS, 2×3)

### Some skins {#some-skins}

There are quite a few skins, and their number is increasing over time, after each season, so it's too tiring to list them all. But roughly the skin looks like this:

![PSS guide illustration 118](/guide-images/image118.png)

Love Quarter Apply – Love room, CAP room skin.

![PSS guide illustration 119](/guide-images/image119.png)

Velvet Sanctuary (LOV) – Brocade room, skin of CAP room.

## Vietnamese names of the crews {#Vietnamese-names-of-the-crews}

Original source from King Na's resources. There have been updates to a few new crews recently (not sure if they are complete).

This list is necessary when you have difficulty entering your crew list into [https://pixel-pstige.com/pstige-calculator.php](https://pixel-pstige.com/pstige-calculator.php)

### 1 star {#1-star}

| ‘Saucy Maguire’ | N/A |
| :---- | :---- |
| Alex | N/A |
| Awful Alex | Alex Freeloader |
| Bonnie Blacktooth | Bonnie Ca Bong |
| Burt the Terrible | Burt Chews Pen |
| Cheng the Red | Trinh Si Tinh |
| Collins | N/A |
| Cross-eyed Mary | Cross-Eyed Mary |
| Deadeye Diana | Diana “Eagle Eye” |
| Female Citizen | Female Citizen |
| Fixer Silvertongue | Silver Tongue Fixer |
| Handsome Michael | Michael “beat zai” |
| Hulk | N/A |
| Infected Trey | Trey infection |
| Infected Victoria | Victoria infection |
| Jacob-57a | N/A |
| Jake | N/A |
| Katie-8 ‘Hammerhead’ | Katie-8 ‘Hammer Head’ |
| Kevin Kruel | N/A |
| Kevin | N/A |
| Larry | N/A |
| Leela | N/A |
| Lin | Linh |
| Mabel Mayhem | N/A |
| Male Civilian | Civilian men |
| Michelle | N/A |
| Monica | N/A |
| Peter | N/A |
| Sally Smelter | Lan Luyen Metal |
| Serial25-Bookworm | Code Number 25 – Bookworm |
| Skully | Trau Tre |
| Tina | N/A |
| Tom no.3 | N/A |
| Tran | Tran |
| Vit the idiot | Vit Ngao Stone |
| Whats-his-name | Distortion-Has-a-Name |

| 2 stars | … |
| :---- | :---- |
| Abu | N/A |
| Ardent Stardancer | Ardent Gunner |
| Big Football Fan | Football Fan |
| Cammy | N/A |
| Candy | Ms. Candy |
| Chigs | N/A |
| Da Qiao | Dai Kieu |
| Gong Fu Girl | Female Confucius |
| Gray Conductor | Commander Gray |
| Jane | N/A |
| Jemima | N/A |
| Kent | N/A |
| Linda | N/A |
| Mary | N/A |
| Mikael Monnier | N/A |
| Monk | Monk |
| Oren Marcus | N/A |
| Private Brian | Corporal Brian |
| Rob | N/A |
| Sarah | N/A |
| Xiao Qiao | Tieu Kieu |

### 3 stars {#3-stars}

| Alien McAlienface | Alien Pussy Face |
| :---- | :---- |
| Arctic Pole Boy | Arctic Boy |
| Ardent Starhunter | Female Gunner Ardent |
| Astronaut | Astronaut |
| Captain Mack Swallow | Captain Mack Swallow |
| Cara | Cara |
| Cat Boy | Mieu Tu |
| Christian | N/A |
| David | N/A |
| Dennis | N/A |
| Dr Mew | Dr. Meo Meo |
| Evil General | Evil General |
| Fed Medic | Federal Nurse |
| First Mate | Comrade Nhat |
| Gentlemen | Nail Head |
| Good Student | SVien Gioi |
| Gray Virtuoso | N/A |
| Helen | N/A |
| Jessica | N/A |
| Jesus | Jesus |
| King Salamander | King |
| Male Nurse | Male nurse |
| Mama | Cheek |
| Messiah | Messiah |
| Miss McAlienface | Female Alien Pussy Face |
| Mr Egggg | Humpty Eggs |
| Nolan | N/A |
| Office Exec | Director |
| Omar |  Mr. and Mrs. Mom |
| Paul | N/A |
| Professor | Professor |
| Qtarian Healer | Nurse Qtari |
| Red Ninja | Red Ninja |
| Ribi | N/A |
| Robyna Hoots | N/A |
| Schrodinger | N/A |
| Serge Eric | Officer Eric |
| Simon | N/A |
| Tiffany | N/A |
| Verunus | N/A |
| Visiri Capt'n | Captain Visiri |
| Vivien | N/A |
| Zombiee | Female Body |
| Zombies | The Walking Dead |

### 4 stars {#4-stars}

| Aaron | N/A |
| :---- | :---- |
| Abbie | Xuan (Abbie) |
| Agay | N/A |
| Steamy Aleks | Aleks is steamy |
| Ardent Templar | Ardent Warrior |
| Assassin Alien | Alien Killer |
| Bad Uncle | Bad Old Man |
| Bad Vlad | Vlad the Tragic |
| Barot | N/A |
| Cao Cao | Cao Cao |
| Demon Boy | Evil Death |
| Dong Zhuo | Dong Trac |
| Dr Sera | Dr. Sera |
| Easter Bunny | Easter Bunny |
| Elf | Female Star |
| Ennui | N/A |
| Eric | N/A |
| Foxy Girl | Ho Ly |
| Geeky Vincent | Vin Ngo |
| Giant Slime | Giant Slime |
| Golden Boy | Golden Boy |
| Golden Troop | Traffic police |
| Government Troop | Government soldiers |
| Henry | N/A |
| Huge Hellaloya | N/A |
| Keira | N/A |
| Kingpin | Do Nam Xitrum |
| Le Vincent | Vin Ngau |
| Liu Bei | Liu Bei |
| Mad Jackson | One-Eyed Jackson |
| Masky Lia | N/A |
| McDonald's | Mac Do |
| Medusa | N/A |
| Mistycball | Mistycball Spirit Ball |
| Monkey King | Sun Wukong |
| Mr Alan | Mr. Alan |
| Mr Cray | Mr. Cray |
| Mr Old | The Old Man |
| Mr She | N/A |
| Ninja | N/A |
| Orcs | N/A |
| Ponytail Alien | Horse Hair Alien |
| Ron | N/A |
| Sakura | Cherry Blossoms |
| Server Eric | Eric – Server |
| Sie | C |
| Steve | N/A |
| Stove Tops | Stevie Chop |
| Teddy | Teddy Bear |
| Tin Man | The Tin Man |
| TJ | N/A |
| Tripods | Tam Guoc |
| Walking Skeleton | Backbone |
| Witch | Witch |
| Zhang Fei | Truong Phi |
| Zhao Yun | Trieu Van |
| Zhuge Liang | Zhuge Liang |

### 5 stars {#5-stars}

| Admiral Serena | Admiral Serena |
| :---- | :---- |
| Alpaco | Camel |
| Ancestral Spirit | Ancestor Spirits |
| Angel | Angel |
| Bogan | Dull Wolf |
| Brenda Linuxer | N/A |
| Cancer | Cancer |
| Ethan | N/A |
| Gemini | Gemini |
| Green Ranger | Oliver – Oliver – Green Vegetable Superman |
| Guan Yu | Quan Vu |
| Huntress | Female Hunter |
| Invaders | Invading Army |
| Jaiden | Black Zai |
| Leo | Leo |
| Leon Mars | N/A |
| Libra | Libra |
| Lollita | N/A |
| Lyu Bu | Lu Bu |
| Maya | N/A |
| Mecha | N/A |
| Menga Linuxer | N/A |
| Miss Jane | Miss Jane |
| Mr Coconut | Coconut Skull |
| Roborobo | N/A |
| Rocky | Thach Nhan |
| Ryzen | N/A |
| Sagita | Sagittarius |
| Scorpio | Scorpio |
| Taura | Taurus |
| Thomas | N/A |
| Virgo | Virgo |
| Visiri Alchemist | Alchemist Visiri |
| Please | N/A |
| Yusi | N/A |
| Zongzi-Man | Ash cake man |

### 6 stars {#6-stars}

| Alley Cat Zombie | Zombie Meow |
| :---- | :---- |
| Angry Squid | Crazy Squid |
| Area51 Alien | Cosmic Human A51 |
| Bio Android | Biological Robotics |
| Bling Captain | Captain Flashy |
| Blingy Captain | Flashy Female Captain |
| Bobby | N/A |
| Buns | White Rabbit |
| Captain | Captain |
| Cathulu | Monster Cat |
| Chihuahua | Phoc Dog |
| D.R.A.G.O.N | D.R.A.G.O.N (D.R.A.G.O.N) |
| D.R.A.K.E | D.I.L.O.N.G (D.R.A.K.E ) |
| Daft Kittus | Ebony Cat |
| Dark Matter Hero | Dark Matter |
| Dark Matter Legend | God Black Substance |
| Dark Matter Mechi | Black Robo |
| Doge | Choe |
| Dolores | N/A |
| Dr Dong | Doctor. East |
| Draconian Mecha | Robo Draconian |
| Drakian Clone | Cloning Drakia |
| Drakian | The Draki |
| Drogon | N/A |
| Edward | N/A |
| Engineer Bob | Engineer Bob |
| Faerie Dragon | Dragon Fairy |
| Fed Bobby | Bobby Federal |
| Fed Laura | Laura Federal |
| Fed Lisa | Lisa Federal |
| Fed Michelle | Michelle Federal |
| Fed Peter | Peter Federal |
| Fed Tony | Tony Federal |
| Franky | N/A |
| Froggy | Frog Scream |
| Giant Chicken | Giant Chicken |
| Grandpa | Old Man |
| Hydra | N/A |
| Infected Drakian Clone | Infected Draki clone |
| Infected Drakian | Infected Draki Warrior |
| King Ellie | Elephant King |
| KS Gray | Gray Humanity K |
| Laura | N/A |
| Lionheart | Master Tam |
| Lisa | N/A |
| Maizi | N/A |
| Meowy Cat | Meow Meow |
| Michelle | N/A |
| Miss Santa | Mrs. Santa Claus |
| Mousey | Mice |
| Mr Blue | Green Boy |
| Mr Horse | Mr. Ma |
| Mummy | Mummy |
| Nova | N/A |
| Old Driver | Old Driver |
| Ophiuchus | Ophiuchus |
| P.A.N.D.A | G.U.T.R.A.C |
| Phoenix | Phoenix |
| Pirate Alex | Captain Alex |
| Pirate Edward | Captain Edward |
| Pirate Lia | Thief Lia |
| Pirate Loretta | Captain Lorreta |
| Pirate Michelle | Thief Michelle |
| Pirate Tony | Captain Tony |
| Polar Bear | Northern Bear |
| Qtarian Bobby | Bobby Qtari |
| Qtarian Edward | Edward Qtari |
| Qtarian Laura | Laura Qtari |
| Qtarian Lisa | Lisa Qtari |
| Qtarian Michelle | Michelle Qtari |
| Qtarian Tony | Tony Qtari |
| Roach | Cockroaches |
| Robo Santa | Mr. Christmas Machine |
| Robots | N/A |
| Saint Patrick | Saint Patty |
| Santa's Helper | Christmas Elves |
| Santa's Helpstress | Miss Christmas |
| Soda Delivery Guy | Than Toc SSoda |
| Sparko | N/A |
| Sphinx | Sphinx |
| Squid | Green Ink |
| Robot News | Tin Robo |
| Tony | N/A |
| Transport Driver | Transporter |
| Turkish Man | Turkey |
| Whaler | Whaler |
| Wolfy | Little wolf |
| Zakian Assassin | Assassin Zaki |
| Zakian | Zaki people |

7 stars

| Alien Queen | Alien Lord |
| :---- | :---- |
| Dracorpse | N/A |
| Eva | N/A |
| King Dong | King Trym |
| Lilith | N/A |
| Paralympic God | Saint Liet Chi |
| Pinkzilla | Hong Long |
| Professor Brenda | Professor Brenda |
| Reapers | Death |
| SCV | N/A |
| Silver Paladin | Silver Knight |
| Willy | N/A |

## Model ship layout {#ship-model layout}

### Ship model level 5 {#ship-model-level-5}

#### Federation

![PSS guide illustration 120](/guide-images/image120.png)![PSS guide illustration 121](/guide-images/image121.png)

#### Qtarian

![PSS guide illustration 122](/guide-images/image122.png)

#### Pirate

![PSS guide illustration 123](/guide-images/image123.png)

### [Ship](http://27.73.126.49/ship/760/tau-mau-level-6/) level 6 model {#ship-model-level-6}

#### Federation

![PSS guide illustration 124](/guide-images/image124.png)

#### Qtarian

![PSS guide illustration 125](/guide-images/image125.png)![PSS guide illustration 126](/guide-images/image126.png)

#### Pirate

![PSS guide illustration 127](/guide-images/image127.png)

### Ship model level 7 {#ship-model-level-7}

#### Federation

![PSS guide illustration 128](/guide-images/image128.png)Teleporter / Droid spammer![PSS guide illustration 129](/guide-images/image129.png)Teleporter![PSS guide illustration 130](/guide-images/image130.png)Teleporter![PSS guide illustration 130](/guide-images/image130.png)Teleporter![PSS guide illustration 128](/guide-images/image128.png) 131](/guide-images/image131.png)Teleporter

#### Qtarian

![PSS guide illustration 132](/guide-images/image132.png)Teleporter / Droid spammer![PSS guide illustration 133](/guide-images/image133.png)Teleporter / Droid spammer

#### Pirate

![PSS guide illustration 134](/guide-images/image134.png)Teleporter/Droid spammer![PSS guide illustration 135](/guide-images/image135.png)Droid spammer![PSS guide illustration 136](/guide-images/image136.png)Droid spammer![PSS guide illustration 136] 137](/guide-images/image137.png)Droid spammer

### Ship model lv8+ {#ship-model-lv8+}

At this point, stand on your own feet bro 🙂

### Good links {#good-links}

Last updated: 01/08/2021

* List of ships in the game, necessary to see and create motivation: [http://www.pixyship.com/ships](http://www.pixyship.com/ships) or [http://pixel-prestige.com/ship-list.php](http://pixel-prestige.com/ship-list.php)

* A list of model ship designs of all levels, quite good to have a not too bad sample layout that you can rely on to edit to suit your ship: [http://pixel-prestige.com/ship-gallery.php](http://pixel-prestige.com/ship-gallery.php)

* Ship design tool, extremely important for ship design and review and editing: [http://www.pixyship.com/builder](http://www.pixyship.com/builder)

* Investigate anyone's ship design, you can even import it into the ship design tool for further design: [http://www.pixyship.com/players](http://www.pixyship.com/players)

* Another ship design tool, the special feature is that you can save the design to your account for later review and editing, you can import the design from pixiship to: [http://pixel-prestige.com/ship-builder.php](http://pixel-prestige.com/ship-builder.php)

* Crew rankings according to each role, very necessary to plan to build a crew in accordance with tactics and economic conditions: [http://pixel-prestige.com/crew-list.php](http://pixel-prestige.com/crew-list.php)

* List of crew stats, easier to see than the list above but lacking the ranking by role: [http://www.pixyship.com/crew](http://www.pixyship.com/crew)

* Crew graft planning tool, extremely important to plan and prepare the crew for gradual grafting: [http://pixel-prestige.com/pstige-calculator.php](http://pixel-prestige.com/pstige-calculator.php)

* List of items in the game, including "market price" information, is essential to avoid overbuying as well as to calculate the maximum price to bring to the market when selling items: [http://www.pixyship.com/items](http://www.pixyship.com/items), or [http://pixel-prestige.com/item-list.php](http://pixel-prestige.com/item-list.php)

* List of rooms in the game, very necessary to look up room information, check how many types of beds the game has, how many types of droids...: [http://www.pixyship.com/rooms](http://www.pixyship.com/rooms) or [http://pixel-prestige.com/room-list.php](http://pixel-prestige.com/room-list.php)

* In-game research list: [http://www.pixyship.com/research](http://www.pixyship.com/research) or [http://pixel-prestige.com/research-list.php](http://pixel-prestige.com/research-list.php)

* Basic formulas: [http://pixelstarships.fandom.com/wiki/Formulas](http://pixelstarships.fandom.com/wiki/Formulas)

### Galaxy Map {#galaxy-map}

![PSS guide illustration 138](/guide-images/image138.png)
