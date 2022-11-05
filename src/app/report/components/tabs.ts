import {SpellId} from 'src/app/logs/models/spell-id.enum';
import {TimelineSummary} from 'src/app/report/summary/timeline.summary';
import {BaseSummary} from 'src/app/report/summary/base.summary';
import {AgonySummary} from 'src/app/report/summary/agony.summary';
import {UnstableAfflictionSummary} from 'src/app/report/summary/unstable-affliction.summary';
import {CorruptionSummary} from 'src/app/report/summary/corruption.summary';
import {DrainSoulSummary} from 'src/app/report/summary/drain-soul.summary';
import {ShadowBoltSummary} from 'src/app/report/summary/shadow-bolt.summary';
import {HauntSummary} from "src/app/report/summary/haunt.summary";

export enum Tab {
  Timeline = 0,
  Haunt,
  UA,
  Corruption,
  SB,
  Agony,
  Flay
}

export const TabDefinitions: ITabDefinition[] = [
  // Tab.Timeline
  {
    label: 'Timeline',
    spellId: SpellId.NONE,
    summaryType: TimelineSummary
  },

  // Tab.DP
  {
    label: 'Haunt',
    icon: 'haunt',
    spellId: SpellId.HAUNT,
    summaryType: HauntSummary
  },

  // Tab.UA
  {
    label: 'UA',
    icon: 'ua',
    spellId: SpellId.UNSTABLE_AFFLICTION,
    summaryType: UnstableAfflictionSummary
  },

  // Tab.Corruption
  {
    label: 'Corruption',
    icon: 'corruption',
    spellId: SpellId.CORRUPTION,
    summaryType: CorruptionSummary
  },

  // Tab.SB
  {
    label: 'SB',
    icon: 'sb',
    spellId: SpellId.SHADOW_BOLT,
    summaryType: ShadowBoltSummary
  },

  // Tab.Agony
  {
    label: 'Agony',
    icon: 'agony',
    spellId: SpellId.CURSE_OF_AGONY,
    summaryType: AgonySummary
  },

  // Tab.Flay
  {
    label: 'DS',
    icon: 'ds',
    spellId: SpellId.DRAIN_SOUL,
    summaryType: DrainSoulSummary
  }
];

export interface ITabDefinition {
  label: string;
  spellId: SpellId;
  icon?: string;
  summaryType: Constructor<BaseSummary>;
}
