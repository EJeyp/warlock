import { BaseFields, IStatField } from 'src/app/report/summary/fields/base.fields';
import { format, latency, NO_VALUE } from 'src/app/report/models/stat-utils';
import { CastStats } from 'src/app/report/models/cast-stats';

export class HauntFields extends BaseFields {
  fields(stats: CastStats) {
    const spellData = this.spellData(stats);
    let fields: IStatField[] = [];

    if (spellData) {
      fields = [this.field({
        label: 'Avg Delay',
        value: latency(stats.avgNextCastLatency),
        highlight: this.highlight.castLatency(stats)
      })];
    }

    return fields
      .concat(this.averageTimeRecast(stats))
      .concat(this.nbTimeFaded(stats))
      .concat(this.totalTimeFaded((stats)));
  }

  private averageTimeRecast(stats: CastStats): IStatField[] {
    return[
      this.field({
        label: 'Avg time recast',
        value: format(stats.neverFadeStats.avgTimeBtwCast, 1, 's'),
        highlight: this.highlight.avgTimeBtwCast(stats)
      })
    ];
  }

  private nbTimeFaded(stats: CastStats): IStatField[] {
    return[
      this.field({
        label: 'Nb time faded',
        value: format(stats.neverFadeStats.fadedCount, 1, ''),
        highlight: this.highlight.nbTimeFaded(stats)
      })
    ];
  }

  private totalTimeFaded(stats: CastStats): IStatField[] {
    return[
      this.field({
        label: 'Total time faded',
        value: format(stats.neverFadeStats.fadedMS, 1, 'ms'),
        highlight: this.highlight.totalTimeFaded(stats)
      })
    ];
  }


}
