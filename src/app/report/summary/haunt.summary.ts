import { BaseSummary } from 'src/app/report/summary/base.summary';
import { StatHighlights } from 'src/app/report/analysis/stat-highlights';
import { HauntFields } from 'src/app/report/summary/fields/haunt.fields';
import { SummaryFields } from 'src/app/report/summary/fields/summary.fields';
import { PlayerAnalysis } from 'src/app/report/models/player-analysis';
import { EncounterFields } from 'src/app/report/summary/fields/encounter.fields';
import { HitFields } from 'src/app/report/summary/fields/hit.fields';
import { CastStats } from 'src/app/report/models/cast-stats';

export class HauntSummary extends BaseSummary {
  private summaryFields: SummaryFields;
  private hitFields: HitFields;
  private hauntFields: HauntFields;
  private encounterFields: EncounterFields;

  constructor(analysis: PlayerAnalysis, highlight: StatHighlights) {
    super(analysis, highlight);

    this.summaryFields = new SummaryFields(this.analysis, this.highlight);
    this.hitFields = new HitFields(this.analysis, this.highlight);
    this.hauntFields = new HauntFields(this.analysis, this.highlight);
    this.encounterFields = new EncounterFields(this.analysis, this.highlight);
  }

  report(stats: CastStats) {
    return this.summaryFields.fields(stats)
      .concat(this.hitFields.fields(stats))
      .concat(this.hauntFields.fields(stats))
      .concat([this.break()])
      .concat(this.encounterFields.fields(stats));
  }
}
