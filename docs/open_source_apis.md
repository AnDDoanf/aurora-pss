# Pixel Starships API reference

Last verified: 2026-07-28

Pixel Starships exposes an undocumented XML API used by the game client. The
endpoints below were found in the current Steam client's IL2CPP metadata and
verified against the official server.

## Hosts

- `https://api.pixelstarships.com` — works with all static catalog endpoints
  listed below.
- `https://api2.pixelstarships.com` — the host recommended by SavySoda for
  third-party developers, but some catalog calls return HTTP 400 when sent
  without the additional client metadata expected by this host.

For simple read-only catalog access, the examples in this document use
`api.pixelstarships.com`.

## Request and response format

The API returns XML. Most catalog endpoints accept these common query
parameters:

- `languageKey=en` — response language.
- `deviceType=Windows` — selects the Windows asset/file catalog.

This combined form returned HTTP 200 for every endpoint in the verified
catalog:

```text
https://api.pixelstarships.com/{Service}/{Method}?languageKey=en&deviceType=Windows
```

These APIs are undocumented and may change without notice. Cache responses,
avoid aggressive polling, and do not call authenticated or state-changing
routes unless you understand the game's authentication and usage rules.

## Verified read-only catalog endpoints

All 43 endpoints in this section returned HTTP 200 during the verification
date above.

### General design catalogs

| Endpoint | Brief description |
| --- | --- |
| `AchievementService/ListAchievementDesigns2` | Lists achievement definitions, requirements, rewards, icons, and display metadata. |
| `AnimationService/ListAnimations` | Lists animation definitions and their sprite/frame data. |
| `BackgroundService/ListBackgrounds` | Lists background art definitions used by scenes and interfaces. |
| `ChallengeService/ListAllChallengeDesigns2` | Lists challenge modes, rules, costs, limits, and rewards. |
| `CollectionService/ListAllCollectionDesigns` | Lists crew collection definitions and their collection bonuses. |
| `DesignService/ListAllDesigns7` | Returns the combined design envelope for a client version; without client version parameters it may contain no changed records. |
| `DesignService/ListAllDynamicDesigns` | Returns dynamic designs changed after a supplied client date/version. |
| `DesignService/ListAllStaticDesigns2` | Returns static designs changed after a supplied client date/version. |
| `DivisionService/ListAllDivisionDesigns2` | Lists tournament division definitions and ranking boundaries. |
| `LeagueService/ListLeagues2` | Lists league definitions, tiers, and associated rules or rewards. |
| `PromotionService/ListAllPromotionDesigns2` | Lists promotion/store offer definitions and their availability metadata. |
| `RewardService/ListAllRewardDesigns2` | Lists reward definitions and their possible reward contents. |
| `SeasonService/ListAllSeasonDesigns` | Lists season and battle-pass definitions, dates, tiers, and settings. |
| `SettingService/ListAllNewsDesigns` | Lists in-game news entries and announcement metadata. |
| `SituationService/ListSituationDesigns` | Lists situation/event definitions used by missions and live gameplay. |
| `TaskService/ListAllTaskDesigns2` | Lists task definitions, objectives, conditions, and rewards. |

### Characters

| Endpoint | Brief description |
| --- | --- |
| `CharacterService/ListAllCharacterDesigns2` | Lists every crew design with base/final stats, rarity, ability, progression, profile sprite, parts, and collection ID. |
| `CharacterService/ListAllCharacterDesignActions` | Lists the AI actions and behavior definitions associated with character designs. |
| `CharacterService/ListAllDrawDesigns` | Lists crew draw pools, costs, rarity rules, and draw configuration. |
| `TrainingService/ListAllTrainingDesigns2` | Lists crew training definitions, stat effects, duration, and costs. |

Important fields from `CharacterDesign` include:

- `CharacterDesignId`, `CharacterDesignName`, and `Rarity`
- `Hp`, `Attack`, `Repair`, `Pilot`, `Weapon`, `Science`, `Engine`, and
  `Research`
- the corresponding `Final*` maximum values
- `SpecialAbilityType`, `SpecialAbilityArgument`, and
  `SpecialAbilityFinalArgument`
- `ProfileSpriteId`
- nested `CharacterPart` records for head, body, and legs

### Items

| Endpoint | Brief description |
| --- | --- |
| `ItemService/ListItemDesigns2` | Lists item definitions, type, rarity, image/logo sprite IDs, crafting data, costs, effects, and linked designs. |
| `ItemService/ListItemDesignActions` | Lists item-related AI actions and behavior definitions. |

### Rooms, missiles, and crafts

| Endpoint | Brief description |
| --- | --- |
| `RoomService/ListRoomDesigns2` | Lists room designs, levels, dimensions, stats, costs, sprite IDs, room type, category, and linked craft/missile designs. |
| `RoomService/ListRoomDesignPurchase` | Lists special room purchase definitions and their requirements. |
| `RoomService/ListCraftDesigns` | Lists deployable craft and drone designs, combat stats, sprites, and behavior. |
| `RoomService/ListMissileDesigns` | Lists missile/ammunition designs, damage values, effects, costs, and sprites. |
| `RoomService/ListActionTypes2` | Lists room AI action types and their supported arguments. |
| `RoomService/ListConditionTypes2` | Lists room AI condition types and comparison metadata. |
| `RoomDesignSpriteService/ListRoomDesignSprites2` | Maps room designs and variants to the sprites used for their visual states. |

### Ships

| Endpoint | Brief description |
| --- | --- |
| `ShipService/ListAllShipDesigns2` | Lists ship/hull designs, grids, stats, costs, exterior/interior sprites, and direct file IDs. |
| `UserService/ListSkins2` | Lists available ship, room, ammo, and other cosmetic skin definitions. |
| `UserService/ListSkinSets2` | Lists named groups of skins and their set relationships. |

### Research and missions

| Endpoint | Brief description |
| --- | --- |
| `ResearchService/ListAllResearchDesigns2` | Lists research definitions, prerequisites, prices, duration, and unlocked content. |
| `MissionService/ListAllMissionDesigns4` | Lists mission definitions, enemies, dialogue, requirements, rewards, and progression data. |

### Galaxy and infrastructure

| Endpoint | Brief description |
| --- | --- |
| `GalaxyService/ListStarSystems` | Lists star-system definitions and their principal properties. |
| `GalaxyService/ListStarSystemLinks` | Lists navigable links between star systems. |
| `GalaxyService/ListPlanets` | Lists planet definitions associated with the galaxy map. |
| `GalaxyService/ListInfrastructureDesigns` | Lists general infrastructure definitions and bonuses. |
| `GalaxyService/ListStarSystemInfrastructureDesigns` | Lists infrastructure that can be built or upgraded in star systems. |
| `GalaxyService/ListMarkerGeneratorDesigns` | Lists definitions for generated galaxy markers and encounters. |

### Files and sprites

| Endpoint | Brief description |
| --- | --- |
| `FileService/ListFiles4` | Maps numeric file IDs to original filenames, download filenames, sizes, dates, and download categories. |
| `FileService/ListSprites2` | Maps sprite IDs to image file IDs and crop rectangles within each source image. |

The file and sprite endpoints provide the bridge between design metadata and
the local asset cache:

```text
CharacterDesign.ProfileSpriteId
    -> Sprite.SpriteId
    -> Sprite.ImageFileId
    -> File.Id
    -> File.AwsFilename / File.Filename
```

For example, a sprite record has this shape:

```xml
<Sprite
  SpriteId="5407"
  ImageFileId="1919"
  X="37"
  Y="0"
  Width="37"
  Height="10"
  SpriteKey="AttackDroid_Lv2LegActive" />
```

`X`, `Y`, `Width`, and `Height` identify the sprite's crop rectangle inside
the PNG represented by `ImageFileId`.

### Client/version metadata

| Endpoint | Brief description |
| --- | --- |
| `SettingService/GetLatestVersion4` | Returns the latest client/server setting envelope when supplied with the expected version/device parameters. |

## Public search and ranking routes

The current client also contains these read-oriented routes. They are not part
of the static 43-endpoint catalog because they require search parameters,
pagination, a user ID, or authentication.

| Endpoint | Brief description |
| --- | --- |
| `AllianceService/GetAlliance` | Retrieves a fleet/alliance by identifier. |
| `AllianceService/ListAlliancesByRanking` | Lists fleets ordered by ranking with pagination. |
| `AllianceService/ListAlliancesByChampionshipScoreRanking` | Lists fleets ordered by championship score. |
| `AllianceService/ListAlliancesWithDivision` | Lists fleets and their current tournament division. |
| `AllianceService/ListUsers2` | Lists members of a fleet. |
| `AllianceService/SearchAlliances` | Searches fleets by name or search string. |
| `LadderService/FindUserRanking` | Finds a user's current ladder position. |
| `LadderService/ListUsersByRanking` | Lists players ordered by ranking. |
| `LadderService/ListUsersByChampionshipScoreRanking` | Lists players ordered by championship score. |
| `MarketService/ListSalesByItemDesignId` | Lists current marketplace sales for an item design. |
| `HistoryService/PriceHistory` | Retrieves historical market prices for an item design. |
| `ShipService/GetShipByUserId` | Retrieves basic ship data for a user ID. |
| `ShipService/InspectShip2` | Retrieves a detailed ship snapshot for inspection. |
| `ShipService/InspectShipViaShipId` | Retrieves a detailed ship snapshot using a ship ID. |
| `ShipService/InspectStarbase` | Retrieves a fleet starbase snapshot. |
| `UserService/SearchUser` | Searches for a single matching user. |
| `UserService/SearchUsers` | Searches users and returns multiple matches. |

## Client-discovered service inventory

The current Steam client contains 300 distinct Pixel Starships routes across
33 service families. Of those, 105 have read-oriented names such as `List`,
`Get`, `Search`, `Find`, `Inspect`, `Scan`, `Check`, or `Price`; the other 195
are authenticated gameplay operations or state mutations.

| Service | Routes found | Responsibility |
| --- | ---: | --- |
| `AchievementService` | 4 | Achievement definitions, progress checks, and reward collection. |
| `AllianceService` | 24 | Fleets, membership, donations, starbases, and infrastructure rewards. |
| `AnimationService` | 1 | Animation design metadata. |
| `BackgroundService` | 1 | Background design metadata. |
| `BattleService` | 13 | Battle creation, frames, commands, scans, verification, and replays. |
| `ChallengeService` | 6 | Challenge designs, ladders, joining, cancellation, and rewards. |
| `CharacterService` | 27 | Crew designs, owned crew, AI actions, equipment, leveling, draws, and prestige. |
| `CollectionService` | 1 | Crew collection designs and bonuses. |
| `DesignService` | 3 | Aggregated static and dynamic client design updates. |
| `DivisionService` | 1 | Tournament division definitions. |
| `FileService` | 2 | Asset-file manifests and sprite-to-file mappings. |
| `GalaxyService` | 22 | Star systems, links, markers, travel, mining, and infrastructure. |
| `HistoryService` | 1 | Marketplace price history. |
| `ItemService` | 13 | Item designs, inventories, activation, crafting, repair, deletion, and gifting. |
| `LadderService` | 3 | Player rankings and championship-score ladders. |
| `LeagueService` | 1 | League definitions. |
| `LiveOpsService` | 2 | Current live-operations catalog and quantities. |
| `MarketService` | 3 | Marketplace listings, purchases, and sales. |
| `MessageService` | 16 | Public, fleet, private, system, marketplace, and replay messages. |
| `MissionService` | 4 | Mission definitions, completion events, exploration rewards, and tests. |
| `PromotionService` | 2 | Promotion definitions and user promotion repair. |
| `ResearchService` | 6 | Research definitions, active research, cancellation, and speed-ups. |
| `RewardService` | 2 | Reward definitions and purchases. |
| `RoomDesignSpriteService` | 1 | Room-design-to-sprite mappings. |
| `RoomService` | 35 | Room designs, AI, construction, upgrades, resources, missiles, and crafts. |
| `SeasonService` | 2 | Season definitions and tier progression. |
| `SettingService` | 2 | Client version settings and in-game news. |
| `ShipService` | 19 | Hull designs, inspection, layouts, construction, skins, stickers, and upgrades. |
| `SituationService` | 2 | Situation definitions and current situations. |
| `StatsService` | 2 | Internal crash/malformed-data tests; not a public stats catalog. |
| `TaskService` | 5 | Task definitions, user tasks, completion, and rerolls. |
| `TrainingService` | 7 | Training definitions, active training, completion, cancellation, and speed-ups. |
| `UserService` | 67 | Accounts, authentication, profiles, friends, purchases, skins, preferences, and reports. |

## Authentication and mutation warning

Routes that create, buy, sell, collect, delete, equip, upgrade, move, send,
join, leave, redeem, or otherwise change game state require valid user
authentication and can have irreversible in-game effects. Examples include
market purchases, item deletion, room upgrades, crew prestige, alliance
membership changes, and account operations.

They are intentionally not expanded into usage examples here. This document
focuses on read-only data suitable for a guide, catalog, or analytics
application.

## Official references

- [Pixel Starships API host](https://api.pixelstarships.com/)
- [Pixel Starships API2 host](https://api2.pixelstarships.com/)
- [Official 2021 API host announcement](https://blog.pixelstarships.com/2021/05/28/galaxy-community-update-5/)
