---
title: "Laser and Cannon"
order: 2
level: "beginner"
---

### Laser and Cannon

Direct-fire weapons are grouped here by damage behavior, platform size, AI targeting group, and current high-level variants.

## Crew building handbook

waiting to write

# Other issues {#other-issues}

## Handbook of long-range weapons {#manual-of-range-weapons}

PSS is of course more complicated than the 1990 Tank game, two ships shooting at each other don't just lose HP every time they get hit by bullets, but the real thing is much more complicated. There are dozens of different types of guns and sometimes each gun has dozens of types of bullets. Each type of bullet causes a different effect on the ship.

#### Ranged weapon groups {#ranged-weapon-groups}

Ranged weapons here are defined as objects that can damage something, without requiring contact. Radar and cloak do no damage, and guard doors and droids require contact, so they will not be listed in this article.

##### Grouped by damage properties

A weapon can cause one or more different types of damage (damage). This article is about weapons, so it won't go into too much detail about damage, but understanding damage types is also an important part of understanding weapons. The grouping of damage types is as follows:

* System damage: damage per hit to the room and module in the target room. Basically, it causes the room to break. Reduced by room's armor. Once the room is destroyed, system damage will be converted to hull damage.  
* Crew damage: hit damage to all crew members in the target room. Not reduced by armor.  
* Shield damage: hit damage to the ship's energy shield. Of course not reduced by armor.  
* Armor-Piercing Damage (Armor Piecing - referred to as AP): deals system damage upon hit to the target room, but is not reduced by the room's armor, and conversely does not convert into hull damage after the room is destroyed.  
* Fire damage: fire burns the room and deals damage over time to the system at the same time as crew damage. Fire damage is reduced by armor, however it does not convert to hull damage after the defense is destroyed. Fire also has a special effect that forces the crew to put out the fire first before repairing the room. And the fire extinguishing time can be reduced if the crew is supported by the fire hose module in the room.  
* Electromagnetic interference (EMP): debuff over time, making the room inoperable. The power consumption room cannot be charged, the energy room cannot be discharged, mines are disabled, and fire hydrants are not working. When the EMP timer expires, the rooms and modules will return to normal operation (however, the mine will not continue to detonate even if it has been triggered, and the hose cannot help extinguish fires that break out while it is EMP). The EMP is disabled when time runs out or the room is destroyed.  
* Direct Hull Damage (DHD): directly subtracts the HP of the ship's hull. Reduced by armor.

##### Grouped by warhead type

Weapons are also grouped based on the shape of their warheads, which generally fall into two groups:

* Laser bullets: refers to energy bullets, the characteristic of this type of bullet is that it does not have a warhead and therefore cannot be dodged, but they can be stopped by the ship's energy shield  
* Bullets with warheads (missile): refers to physical bullets, basically your ship throws "balls" of something to the enemy ship, such as all types of missiles, or rockets of grenade launchers, or warheads of Fire Eagle aircraft. The characteristic of warhead bullets is that they fly through energy shields, but conversely they can be dodged by the ship's Engines.

##### Grouping by AI room group

Finally, the weapon rooms are grouped into groups by the game's AI engine as follows:

* Laser gun: is the most numerous type of weapon in the game, only weapons that fire energy bullets, except anti-aircraft guns and cannons  
* Missile firing rooms: only rooms that fire missiles, there are many types of missiles with different damage structures. A missile is a type of warhead and as such it can be dodged.  
* Anti-aircraft artillery: has only one type of defense, and also fires lasers, but because of its sensitive tactical importance, it is placed in a separate group by the AI  
* Cannon: includes EMP Cannon and ION Cannon, one is a disabling/defensive weapon, and the other is an offensive weapon. Both are energy weapons and are both powerful and tactically sensitive.  
* Hangar room: can release many types of aircraft with different damage structures.

The rest of the article will go into detail about the damage structure of each weapon in the groups. The parameters were taken when the ship was level 11 and all rooms and research were at maximum level.

#### Laser weapon {#laser-weapon}

The laser weapons group refers to weapons that fire energy projectiles (without warheads). They have a varied damage structure and the chart below only depicts their general DPS. HAN Def refers to defender aircraft – included for reference, noting that there can be up to 5 aircraft operating.

![PSS guide illustration 48](/guide-images/en/laser-and-cannon.png)

##### Mining laser (MLZ)

![PSS guide illustration 49](/guide-images/en/laser-and-cannon-2.png)

There's not much to say, the weapons you have from the beginning of the game have stable DPS, have moderate HP levels, and deal versatile types of damage. It's not too strong, but always trustworthy.

MLZ is buffed by weapon stats.

![PSS guide illustration 50](/guide-images/en/laser-and-cannon-3.png)

##### Bolter (BT) – Submachine gun (TL)

![PSS guide illustration 51](/guide-images/en/laser-and-cannon-4.png)

BTs have decent damage compared to the amount of energy they use. However, the downside is that their HP is too low, making them an easy target for opponents to penetrate your ship. Most players will gradually eliminate their dependence on BT from level 7 and replace it with other safer 2×2 rooms, like PP/MG or K cannon.

Botter is buffed by weapon stats.

![PSS guide illustration 52](/guide-images/en/laser-and-cannon-5.png)

##### K Cannon (KB/KP)

![PSS guide illustration 53](/guide-images/en/laser-and-cannon-6.png)

The K cannon can be purchased with dove or bux. They are a good replacement for BTs with slightly lower DPS but in return have 2HP and bullets fired in 3 voleys.

K cannon is buffed by weapon stats.

![PSS guide illustration 54](/guide-images/en/laser-and-cannon-7.png)

##### Small Weapons Platform (SWP)

![PSS guide illustration 55](/guide-images/en/laser-and-cannon-8.png)

This is a 2×2 gun platform that you can deploy one of three types of guns on, including Machine Guns, Photonic Guns, and Biocide Guns.

###### Minigun – Dalian (MG)

![PSS guide illustration 56](/guide-images/en/laser-and-cannon-9.png)

MG has a special shooting style. It fires continuously (voley) from 50-140 rounds, with a delay of 0.25ms, causing the target room to be in a state of continuous damage for 25-37 seconds and forcing the enemy crew to constantly stay in there to repair. Detaining 2-3 enemy crew means 1/10 of the enemy ship's maximum crew, for half a minute, too cheap for only 2 energy. However, the shield-breaking MG is very weak due to its non-destructive nature. If your remaining gun system is not strong enough to destroy the shield, the MG will not be able to shoot effectively.

MG needs to reload to fire, and it is buffed by weapon stats.

![PSS guide illustration 57](/guide-images/en/laser-and-cannon-10.png)

###### Photonic gun (PP)

![PSS guide illustration 58](/guide-images/en/laser-and-cannon-11.png)

PP is a specialized weapon for breaking shields. In case the opponent no longer has a shield, PP hitting the target room will cause EMP 1s along with some system damage.

You need PP if you are often made difficult by your opponent's shields. PP needs to reload to shoot. And it is buffed by the science stat, not WP like in other laser gun rooms.

![PSS guide illustration 59](/guide-images/en/laser-and-cannon-12.png)

###### Sterilizer – Life Killing Gun (ST)

![PSS guide illustration 60](/guide-images/en/laser-and-cannon-13.png)

ST requires a level 11 ship, and is the ultimate weapon for controlling crews. It absolutely does not deal any damage other than crew damage. ST needs to be used carefully so as not to hit the opponent's shield. It requires reloading, and is buffed by weapon stats.

![PSS guide illustration 61](/guide-images/en/laser-and-cannon-14.png)

##### Plasma Cannon (PLA)

![PSS guide illustration 62](/guide-images/en/laser-and-cannon-15.png)

Specialized weapon to kill crew, and is a perfect replacement for submachine guns. Needs gas to shoot, and is buffed by weapon stats.

![PSS guide illustration 63](/guide-images/en/laser-and-cannon-16.png)

##### Medium-sized weapon platform

![PSS guide illustration 64](/guide-images/en/laser-and-cannon-17.png)

This is a 3×2 gun platform where you can deploy one of three types of guns: Laser Cannon, Railgun, and Photonic Cannon.

###### Laser Cannon (LB)

![PSS guide illustration 65](/guide-images/en/laser-and-cannon-18.png)

LB is like an upgraded version of MLZ, consuming more energy means more durability, and higher damage. It requires reloading, and is buffed by weapon stats. This is the weapon that gives the highest hull damage among medium-sized weapons.

![PSS guide illustration 66](/guide-images/en/laser-and-cannon-19.png)

###### Railgun

![PSS guide illustration 67](/guide-images/en/laser-and-cannon-20.png)

The Railgun has a fairly long reload time, however with 2 AP damage, it is very effective in terms of destroying target rooms, meaning it can destroy most important 2×2 rooms with just one shot and create conditions for other guns on your ship to damage the hull immediately after. You will like the Railgun in the endgame when most of your opponents are experienced and have the ability to armor very well in low HP rooms.

Rail guns need to be loaded to fire and are buffed by weapon stats.

![PSS guide illustration 68](/guide-images/en/laser-and-cannon-21.png)

###### Photonic Cannon (PD)

![PSS guide illustration 69](/guide-images/en/laser-and-cannon-22.png)

Similar to PP but with even higher shield damage. This is the ultimate weapon to specialize in shields.

PD has voley 4, it needs to reload. All photon weapons are buffed by science stats, and so is PD.

![PSS guide illustration 70](/guide-images/en/laser-and-cannon-23.png)

#### Cannon {#big-cannon}

Cannons are rooms that fire energy bullets. They are expensive in both area and capacity, but are dangerous and play an important role in strategy. You will have to learn a lot about AI targeting and AI energy management to be able to master these expensive guns.

##### EMP Cannon (EMP)

![PSS guide illustration 80](/guide-images/en/laser-and-cannon-24.png)

As the name suggests, EMP cannons cause EMP. Although it is a cannon, it actually has a disabling/defensive effect, and is considered the second most important defensive weapon on a ship, after shields. The EMP causes the chamber to become inoperable for a long period of time, dealing some system damage, hull damage, and negligible shield damage. Besides that, nothing more needs to be said.

EMP is buffed by weapon stats and it requires reloading.

![PSS guide illustration 81](/guide-images/en/laser-and-cannon-25.png)

##### ION Cannon

![PSS guide illustration 82](/guide-images/en/laser-and-cannon-26.png)

The ship's cannon, the pride of the lvl 11 ship\. Expensive (it needs to charge Ion core to fire, and consumes quite a lot of gas) and the damage is extremely high. However, it also consumes a fair amount of energy and you will want to have 100% crew rush to be able to set the ION cannon at 1 energy. As well as having to distribute energy properly when the rush is over.

ION fires 11 bullets continuously, and it is buffed by weapon stats.

![PSS guide illustration 83](/guide-images/en/laser-and-cannon-27.png)

#### Expanded Weapons Room {#expanded-weapons-room}

![PSS guide illustration 113](/guide-images/en/laser-and-cannon-28.png)

The K cannon, which fires bullets similar to the Bolter/Submachine gun, is not much stronger than the submachine gun, in return consumes more energy and thus overcomes the TL's weakness of low HP. Sold for 100 doves at the dove shop.

![PSS guide illustration 115](/guide-images/en/laser-and-cannon-30.png)

Particle Discharger (PAD, 3×2), called Phraser for short, is a weapon similar to MLZ. Can only be obtained when purchasing a late support package. Damage is unstable.

#### Current high-level direct-fire weapons

- **Gamma Beam Emitter**, **Coilgun Small Weapon Platform**, and a second Small Weapons Platform are part of the Hull 14 weapon roster.
- Coilgun reload is **4 seconds** and cooldown is **1.5 seconds** as of V0.999.57.
- Railgun has shield piercing.

Current references: [V0.999](https://blog.pixelstarships.com/2024/05/16/galaxy-patch-notes-v0-999/), [V0.999.16](https://blog.pixelstarships.com/2024/12/17/ugc-stickers-galaxy-patch-notes-v0-999-16/), [Hull 14 V0.999.55](https://blog.pixelstarships.com/2026/06/17/hull-14-major-update-patch-notes-v0-999-55/), and [V0.999.57](https://blog.pixelstarships.com/2026/07/06/galaxy-patch-notes-v0-999-57/).
