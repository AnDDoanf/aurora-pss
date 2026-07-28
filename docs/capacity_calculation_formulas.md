# Pixel Starships - Ship Capacity Analytics Calculation Formulas

This document provides the technical specification and mathematical formulas used by the **Ship Capacity Analytics** feature in PSS Unified Analytics.

---

## 1. Unit Conversions & Game Ticks

In Pixel Starships (PSS) raw game data (`rooms.json`, `missiles.json`, `crafts.json`):
- Time is stored in **game ticks**, where **40 ticks = 1 second**.
- $\text{TimeInSeconds} = \frac{\text{Ticks}}{40}$.

---

## 2. Power Allocation & Haste Scaling

Each room's speed is scaled by assigned power and crew haste:

### Power Ratio ($pwrRatio$)
$$pwrRatio = \frac{\text{assignedPower}}{\text{maxPower}} \quad (0 \le pwrRatio \le 1)$$

### Speed Multiplier ($speedMult$)
$$speedMult = pwrRatio \times \left(1 + \frac{\text{hasteBonus}}{100}\right)$$

If $pwrRatio = 0$ (unpowered room), the room is inactive ($0.00\text{ DPS}$, $0.00\text{ HP/s}$).

---

## 3. Weapon Timing & Volley Mechanics

### Base & Effective Reload Speed ($\text{effectiveReloadSec}$)
$$\text{baseReloadSec} = \frac{\text{ReloadTime}}{40}$$
$$\text{effectiveReloadSec} = \frac{\text{baseReloadSec}}{speedMult}$$

### Volley Delay ($\text{volleyDelaySec}$)
When a weapon fires a volley of $V > 1$ shots:
$$\text{volleyDelaySec} = \frac{\text{VolleyDelay}}{40}$$
$$\text{volleyDurationSec} = (V - 1) \times \text{volleyDelaySec}$$

### Total Cycle Duration ($\text{totalCycleSec}$)
$$\text{totalCycleSec} = \text{effectiveReloadSec} + \text{volleyDurationSec}$$

---

## 4. Super Weapon Cooldowns vs Recoil Delays

PSS data uses `CooldownTime` in two distinct ways:

1. **Super Weapons ($\text{CooldownTime} \ge 160$ ticks / $4.0\text{s}+$):**
   - Super weapons (e.g. Superlaser, Mini Nuke, Hwacha, Turbo Laser) use `CooldownTime` as their primary reload cycle ($80.0\text{s}$).
   - $\text{actualReloadTicks} = \text{CooldownTime}$.

2. **Normal Weapons ($\text{CooldownTime} < 160$ ticks / $0.5\text{s}$):**
   - Delays under 160 ticks are internal recoil/animation reset delays between volleys and do not replace `ReloadTime`.
   - $\text{actualReloadTicks} = \text{ReloadTime}$.

---

## 5. Discrete Volley Snapshot Calculation ($t = 0$ Immediate Firing)

In PSS combat:
- **Volley #1** (all shots in the first volley) fires **immediately at $t = 0$**.
- Subsequent volleys fire after each completed cycle duration ($\text{totalCycleSec}$).

### Volleys Fired in Snapshot Duration $T$ (seconds):
For a snapshot phase of duration $T$:
1. Volley #1 completes firing at $t = \text{volleyDurationSec}$.
2. If $T \ge \text{volleyDurationSec}$:
   $$\text{TotalVolleys} = 1 + \left\lfloor \frac{T - \text{volleyDurationSec}}{\text{totalCycleSec}} \right\rfloor$$
3. Total Shots Delivered:
   $$\text{totalShots} = \text{TotalVolleys} \times \text{Volley} \times \text{Quantity} \times \text{CraftCount}$$

### Snapshot Firing Rate ($\text{ShotsPerSec}$)
$$\text{ShotsPerSec} = \frac{\text{totalShots}}{T}$$

---

## 6. Damage Output & Symphony Perk

### Base Damage per Shot with Stat Multiplier
Each damage category (System, Shield, Crew, Hull, Armor-Piercing AP) scales by the room's weapon stat bonus % ($\text{weaponBonus}$):
$$\text{DamagePerShot} = \text{BaseDamage} \times \left(1 + \frac{\text{weaponBonus}}{100}\right)$$

### Symphony Perk (+25% Power on First $N$ Shots)
When Symphony is enabled for a weapon, the first $N$ shots ($N \in \{3, 4, 5\}$) receive a $+25\%$ damage multiplier ($1.25 \times \text{DamagePerShot}$):

$$\text{buffedShots} = \min(N, \text{totalShots})$$
$$\text{normalShots} = \max(0, \text{totalShots} - \text{buffedShots})$$

$$\text{TotalDamage} = (\text{buffedShots} \times \text{DamagePerShot} \times 1.25) + (\text{normalShots} \times \text{DamagePerShot})$$

### Damage Rate per Second ($\text{DPS}$)

$$
\boxed{
\operatorname{DPS}(T)=
\frac{VD}{T}
\left[
N+
K\min\left(N,\min(n,5)\right)
\right]
}
$$

with number of shots is:

$$
N=
\begin{cases}
0,&T<F\\
1+\left\lfloor\dfrac{T-F}{C+\frac{R(P_{\max}/P)}{1+B}+(V-1)\Delta}\right\rfloor,&T\ge F
\end{cases}
$$

and the time when the first shot finishes:

$$
F=
\frac{R(P_{\max}/P)}{1+B}
\max\left(0,1-\frac{H}{100P_{\max}}\right)
+(V-1)\Delta
$$

Where:

$$
\begin{aligned}
T &= \text{measurement period},\\
R &= \text{base reload time},\\
B &= \text{reload-speed bonus as a decimal},\\
P &= \text{power provided},\\
P_{\max} &= \text{weapon power cap},\\
H &= \text{haste percentage},\\
C &= \text{cooldown after the final volley},\\
V &= \text{volleys per shot},\\
\Delta &= \text{delay between volleys},\\
D &= \text{damage per volley},\\
K &= \text{damage bonus for the first } n \text{ shots as a decimal},\\
n &= \text{number of boosted shots},\quad 0\le n\le5.
\end{aligned}
$$

---

## 7. Defensive Capacity Calculations & Discrete Hasted Shield Regeneration

Defensive rooms derive their initial buffer values and regeneration values directly from the API and allow user adjustments.

### A. Shield Generators (Discrete Snapshot Regeneration)

1. **Initial Shield Capacity ($C_{\text{initial}}$):**
   Provided immediately at $t = 0$:
   $$C_{\text{initial}} = \text{InitValue} \times \text{Quantity} \quad (\text{HP})$$

2. **Effective Hasted Reload Speed ($\text{effectiveReloadSec}$):**
   $$\text{effectiveReloadSec} = \frac{\text{ReloadTime} / 40}{pwrRatio \times \left(1 + \frac{\text{hasteBonus}}{100}\right)}$$

3. **Discrete Completed Reload Cycles in Snapshot Duration $T$:**
   Only fully completed reload cycles generate shield HP. If remaining time is less than $\text{effectiveReloadSec}$, it is skipped:
   $$\text{completedCycles} = \left\lfloor \frac{T}{\text{effectiveReloadSec}} \right\rfloor$$
   $$\text{generatedShield} = \text{completedCycles} \times \text{RegenValue} \times \text{Quantity} \times \left(1 + \frac{\text{scienceBonus}}{100}\right)$$

4. **Snapshot Shield Generation Rate ($\text{ShieldGenRate}$):**
   $$\text{ShieldGenRate} = \frac{C_{\text{initial}} + \text{generatedShield}}{T} \quad (\text{HP/s})$$

---

### B. Engine Rooms

1. **Initial Evasion Base Value ($\text{Evasion}_{\text{initial}}$):**
   $$\text{Evasion}_{\text{initial}} = \text{InitValue} \times \text{Quantity} \quad (\%)$$

2. **Power-Scaled Evasion Output ($\text{EvasionContribution}$):**
   $$\text{EvasionContribution} = \min\left(75\%, \text{Evasion}_{\text{initial}} \times pwrRatio \times \left(1 + \frac{\text{engineBonus}}{100}\right)\right)$$

---

## 8. Multi-Snapshot Battle Timeline Synthesis

For a battle sequence consisting of $K$ snapshots with durations $T_1, T_2, \dots, T_K$:

- **Total Battle Duration**: $T_{\text{total}} = \sum_{i=1}^{K} T_i$
- **Total Accumulated Damage**: $\text{TotalDamage}_{\text{accum}} = \sum_{i=1}^{K} \text{TotalDamage}_i$
- **Weighted Average Shield Gen Rate**:
  $$\text{AvgShieldGen} = \frac{\sum_{i=1}^{K} (\text{ShieldGenRate}_i \times T_i)}{T_{\text{total}}}$$
- **Weighted Average Evasion Rate**:
  $$\text{AvgEvasion} = \frac{\sum_{i=1}^{K} (\text{Evasion}_i \times T_i)}{T_{\text{total}}}$$
