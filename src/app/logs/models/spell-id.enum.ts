export const PSEUDO_SPELL_BASE = 10000000;

export enum SpellId {
  NONE = 0,

  //Warlock abilities
  SHADOW_BOLT = 47809,
  UNSTABLE_AFFLICTION = 47843,
  HAUNT = 59164,
  CORRUPTION = 47813,
  CURSE_OF_AGONY= 47864,
  DRAIN_SOUL=47855,


  BLOOD_FURY = 20572,


  SHADOW_FIEND = 34433,

  // Engineering
  ADAMANTITE_GRENDADE = 30217,
  DENSE_DYNAMITE = 23063,
  FEL_IRON_BOMB = 30216,
  GOBLIN_SAPPER = 13241,
  SUPER_SAPPER = 56488,
  SARONITE_BOMB= 56350,

  // Pseudo spell IDs (map to WCL negative values)
  MELEE = PSEUDO_SPELL_BASE + 32
}

// Map WCL ability IDS (ability.guid) to a local spell ID
// Mostly here now to allow processing of shadowfiend melee
export function mapSpellId(guid: number) {
  if (guid > 0) {
    return guid;
  }

  return PSEUDO_SPELL_BASE + Math.abs(guid);
}
