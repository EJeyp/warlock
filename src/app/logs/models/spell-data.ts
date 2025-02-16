import { SpellId } from 'src/app/logs/models/spell-id.enum';
import { HasteUtils } from 'src/app/report/models/haste';
import { ISettings, Settings } from 'src/app/settings';
import { CombatantInfo } from 'src/app/logs/models/combatant-info';
import { PlayerAnalysis } from 'src/app/report/models/player-analysis';

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
    neverFade: false,
    statsByTick: false,
    multiTarget: false,
  };

  public static baseData(id: SpellId) {
    return Spell.dataBySpellId[id];
  }

  public static get(id: SpellId, analysis: PlayerAnalysis, currentHaste?: number): ISpellData {
    let baseData = Spell.dataBySpellId[id];

    // apply overrides for dynamic data
    const dynamic = baseData.dynamic ? baseData.dynamic.call(null, baseData, analysis.settings) : {};
    let data = Object.assign({}, Spell.dataBySpellId[id], dynamic);

    // apply gear bonuses from combatant info
    if (analysis.actorInfo?.bonuses?.hasOwnProperty(baseData.mainId)) {
      data = Object.assign(data, analysis.actorInfo!.bonuses[baseData.mainId]);
    }

    // apply haste adjustments if haste specified.
    if (currentHaste !== undefined && data.damageType === DamageType.DOT && data.dotHaste) {
      data.maxDuration = HasteUtils.duration(id, currentHaste);
    }

    return data;
  }

  public static rank(id: SpellId, data: ISpellData) {
    if (id === data.mainId) {
      return data.maxRank;
    }

    return data.rankIds[id];
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
      rankIds: {
        [11713]: 6,
        [27218]: 7,
        [47863]: 8
      },
      maxRank: 9,
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
      rankIds: {
        [48181]: 1,
        [59161]: 2,
        [59163]: 3
      },
      maxRank: 4,
      damageType: DamageType.DIRECT,
      hasTravel: true,
      neverFade: true,
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
      rankIds: {
        [25307]: 10,
        [27209]: 11,
        [47808]: 12
      },
      maxRank: 13,
      damageType: DamageType.DIRECT,
      baseCastTime: 2.5,
      maxDamageInstances: 1,
      cooldown: 0,
      hasTravel: true
    }),

    [SpellId.DRAIN_SOUL]: data({
      rankIds: {
        [8289]: 3,
        [11675]: 4,
        [27217]: 5
      },
      maxRank: 6,
      damageType: DamageType.CHANNEL,
      maxDamageInstances: 5,
      maxDuration: 15,
      maxTicks: 5,
      baseTickTime: 3,
      statsByTick: true
    }),


    [SpellId.CORRUPTION]: data({
      rankIds: {
        [27216]: 8,
        [47812]: 9
      },
      maxRank: 10,
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
      rankIds: {
        [30404]: 2,
        [30405]: 3,
        [47841]: 4
      },
      maxRank: 5,
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
  maxRank: number|undefined;
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
  neverFade: boolean,
  maxInstancesPerDamageId?: {[id: number]: number};
  dynamic?: (baseData: ISpellData, settings: ISettings) => Partial<ISpellData>
}
