# General AI template
## AND Logic Gate

> 1. Condition 1 - skip next
> 2. None - skip next 
> 3. Condition 2 - skip next
> 4. None - skip next 
> 5. Condition 3 - Action

<u>Explain</u>: If all conditions are true, perform action

## NOR Logic Gate

> 1.  Previous AI  
> 2. Condition 1 - Continue current job
> 3. Condition 2 - Continue current job
> 4. Condition 3 - Continue current job  
> 5. Actions 

<u>Explain</u>: If all 3 conditions are true, continue the last job set by previous ai, even if it was invalid, otherwise perform actions.

# Gunner

# Shield Booster

# Defender
## General Defender
> 1. Non - Use your Special power
> 2. Current hp > 25% - Skip next target action
> 3. None - Skip next target action
> 4. Friendly room has enemy crew - Skip next target action
> 5. None - Skip next target action
> 6. Friendly room has enemy crew - Target condition room  
> 7. Current hp < 25% - Skip next target action
> 8. None - Skip next target action
> 9. Special power not available - Skip next target action
> 10. None - Skip next target action
> 11. Target room has enemy crew - Target another room  
> Repair command

<u>Explain</u>: High Hp and Atk are the must for defender in general.
- From 1-6: The crew will go to the the friendly room which has enemy crew and fight there if her hp is higher than 25%. 
- From 7-11: If her hp is below 25% and her skill is not available, she won't go to the room that has enemy.

## Origin Defender
> 1. Current room has enemy crew - Use your Special power
> 2. Current hp < 25% - Target your laser
> 3. Origin room hp < 100% - Target origin Room
> 4. Origin room has enemy crew - Target origin Room
> 5. Non - Target your laser

<u>Explain</u>: The origin defenders are usually crews with gas, critical, freeze ability. From th e origin room that needs to be protected at the beginning of the battle, the crew then go to the laser and only come back when the origin room is damaged or there are enemy crews in the origin room.

## GA Defender
> 1. Current room has enemy crew - Use your special power
> 2. Friendly room is on fire - Skip next target action
> 3. None - Skip next target action
> 4. Friendly room has enemy crew - Skip next target action
> 5. None - Skip next target action
> 6. Friendly room has enemy crew - Target condition room  
> Repair command

<u>Explain</u>: Galatic Alchemis(GA)  is a crew that has strongest arson ability, which set your room on fire. The GA defender must preferably has high fire resistance, attack >= 5.0 with bloodthirst or repair skill. The AI is based on AND logic gate template: if a friendly room is on fire and also has enemy crew in it, target that room. Change command 6's target to "Target another room" for non-GA defender who avoid GA.

# Repairer



# Gun

# Hangar

# Anti Craft

# Ion Cannon

# EMP Cannon

# EMP Missle Laucher

# Shield

# Engine

# Anti Teleport

# Android Studio

# Android AI
## Service droids
> 1. Friendly Room HP < 100% - Target Condition Room
> 2. None - Use Special Power

## Boarder droids
> 1. None - Target Random Enemy Room
> 2. None - Use Special Power

## Defender droids
> 1. Friendly Room Has Enemy Crew - Target Condition Room
> 2. None - Use Special Power

## Zongzi droids
> 1. Target Room HP < 100% - Continue Current Job
> 2. Current HP < 50% - Use Special Power
> 3. Friendly Room HP < 100% - Target Condition Room
> 4. Friendly Room Has Enemy Crew - Target Condition Room

## Ghostly Holo-Droids
> 1. Current Room Has Enemy Crew - Use Special Power
> 2. Friendly Room Has Enemy Crew - Target Condition Room
> 3. Friendly Room HP < 100% - Target Condition Room
