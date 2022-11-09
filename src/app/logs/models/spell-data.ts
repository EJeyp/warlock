import { SpellId } from 'src/app/logs/models/spell-id.enum';
import { HasteUtils } from 'src/app/report/models/haste';
import { ISettings, Settings } from 'src/app/settings';

export enum DamageType {
  NONE,
  DIRECT,
  DOT,
  CHANNEL,
  AOE
}

function data(params: Partial<ISpellData> = {}): ISpellData {
  return Object.assign({}, Spell.DEFAULTS, params) as ISpellData;
}

export class Spell {
  public static readonly DEFAULTS: Partial<ISpellData> = {
    rankIds: [],
    damageIds: [],
    baseCastTime: 0,
    maxDamageInstances: 0,
    hasTravel: false,
    maxDuration: 0,
    maxTicks: 0,
    baseTickTime: 0,
    cooldown: 0,
    gcd: true,
    dotHaste: false,
    statsByTick: false,
    multiTarget: false,
  };

  public static baseData(id: SpellId) {
    return Spell.dataBySpellId[id];
  }

  public static get(id: SpellId, settings: Settings, currentHaste?: number): ISpellData {
    const baseData = Spell.dataBySpellId[id];

    // apply overrides for dynamic data
    const dynamic = baseData.dynamic ? baseData.dynamic.call(null, baseData, settings) : {};
    const data = Object.assign({}, Spell.dataBySpellId[id], dynamic);

    // apply haste adjustments if haste specified.
    if (currentHaste !== undefined && data.damageType === DamageType.DOT && data.dotHaste) {
      data.maxDuration = HasteUtils.duration(id, currentHaste);
    }

    return data;
  }

  public static fromDamageId(id: number): ISpellData|undefined {
    if (this.dataBySpellId.hasOwnProperty(id)) {
      return this.dataBySpellId[id];
    }

    return Object.values(this.data).find((spell) => spell.damageIds.includes(id));
  }

  public static data: {[spellId: number]: ISpellData} = {
    [SpellId.ADAMANTITE_GRENDADE]: data({
      damageType: DamageType.AOE,
      baseCastTime: 1,
      maxDamageInstances: 20,
      gcd: false
    }),

    [SpellId.BLOOD_FURY]: data({
      damageType: DamageType.NONE,
      gcd: false
    }),

    [SpellId.LIFE_TAP]: data({
      damageType: DamageType.NONE,
      gcd: true
    }),

    [SpellId.LIFE_TAP_GLYPH]: data({
      damageType: DamageType.NONE,
      gcd: false
    }),

    [SpellId.T7_4P]: data({
      damageType: DamageType.NONE,
      gcd: false
    }),

    [SpellId.CURSE_OF_AGONY]: data({
      damageType: DamageType.DOT,
      dotHaste: false,
      maxDamageInstances: 12,
      maxDuration: 24,
      maxTicks: 12,
      baseTickTime: 2
    }),

    [SpellId.DENSE_DYNAMITE]: data({
      damageType: DamageType.AOE,
      baseCastTime: 1,
      maxDamageInstances: 20,
      gcd: false
    }),

    [SpellId.HAUNT]: data({
      damageType: DamageType.DOT,
      dotHaste: false,
      maxDamageInstances: 0,
      maxDuration: 12,
      maxTicks: 0,
      baseTickTime: 0
    }),


    [SpellId.FEL_IRON_BOMB]: data({
      damageType: DamageType.AOE,
      baseCastTime: 1,
      maxDamageInstances: 20,
      gcd: false
    }),

    [SpellId.GOBLIN_SAPPER]: data({
      damageType: DamageType.AOE,
      maxDamageInstances: 20,
      gcd: false
    }),

    [SpellId.MELEE]: data({
      damageType: DamageType.DIRECT,
      gcd: false
    }),

    [SpellId.SHADOW_BOLT]: data({
      damageType: DamageType.DIRECT,
      baseCastTime: 3,
      maxDamageInstances: 1,
      cooldown: 0,
      hasTravel: true
    }),

    [SpellId.DRAIN_SOUL]: data({
      //damageIds: [SpellId.MIND_FLAY_TICK],
      damageType: DamageType.CHANNEL,
      maxDamageInstances: 5,
      maxDuration: 15,
      maxTicks: 5,
      baseTickTime: 3,
      statsByTick: true
    }),


    [SpellId.CORRUPTION]: data({
      damageType: DamageType.DOT,
      baseTickTime: 3,
      dotHaste: true
    }),


    [SpellId.SUPER_SAPPER]: data({
      damageType: DamageType.AOE,
      maxDamageInstances: 20,
      gcd: false
    }),
    [SpellId.SARONITE_BOMB]: data({
      damageType: DamageType.AOE,
      maxDamageInstances: 20,
      gcd: false
    }),

    [SpellId.UNSTABLE_AFFLICTION]: data({
      damageType: DamageType.DOT,
      dotHaste: false,
      baseCastTime: 1.5,
      maxDamageInstances: 5,
      maxDuration: 15,
      maxTicks: 5,
      baseTickTime: 3
    })
  }

  public static dataBySpellId: {[spellId: number]: ISpellData} =
    Object.keys(Spell.data).reduce((lookup, next) => {
      const spellId = parseInt(next),
        data: ISpellData = Spell.data[spellId];

      data.mainId = spellId;
      lookup[spellId] = data;

      for (let rankId of Object.keys(data.rankIds)) {
        lookup[parseInt(rankId)] = data;
      }

      return lookup;
    }, {} as {[spellId: number]: ISpellData});
}

export interface ISpellData {
  mainId: number;
  damageType: DamageType;
  rankIds: {[id: number]: number };
  damageIds: number[]
  baseCastTime: number;
  maxDamageInstances: number;
  maxDuration: number;
  baseTickTime: number;
  maxTicks: number;
  cooldown: number;
  gcd: boolean;
  dotHaste: boolean;
  statsByTick: boolean;
  multiTarget: boolean;
  hasTravel: boolean,
  maxInstancesPerDamageId?: {[id: number]: number};
  dynamic?: (baseData: ISpellData, settings: ISettings) => Partial<ISpellData>
}
