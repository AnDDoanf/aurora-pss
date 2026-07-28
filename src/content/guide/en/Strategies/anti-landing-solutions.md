---
title: "Anti-landing solutions"
order: 33
level: "beginner"
---

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

![PSS guide illustration 44](/guide-images/en/anti-landing-solutions.png)

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

![PSS guide illustration 45](/guide-images/en/anti-landing-solutions-2.png)

Crews with the freezing skill need to use AI (A). If they use (B), they will freeze the enemy crew as soon as they meet. If the opposing crew does not intend to go to the same target room as them, the defending crew will not be able to attack, and the freeze time will pass meaninglessly.

![PSS guide illustration 46](/guide-images/en/anti-landing-solutions-3.png)

On the contrary, crews with death or gas skills will use (B) to take down the landing crew as soon as they meet.

###### *AI search and destroy landing*

Use the following AI line (line 3 in the picture), to make the defending crew run to the room the landing troops are targeting.

Friendly room with landing crew: Choose a room that meets the conditions

![PSS guide illustration 47](/guide-images/en/anti-landing-solutions-4.png)

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
