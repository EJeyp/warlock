import { BaseFields, IStatField } from 'src/app/report/summary/fields/base.fields';
import { format, latency, NO_VALUE } from 'src/app/report/models/stat-utils';
import { CastStats } from 'src/app/report/models/cast-stats';

export class DotFields extends BaseFields {
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
      .concat(this.downtimeStats(stats))
      .concat(this.downtimeExecStats(stats))
      .concat(this.clipStats(stats));
  }

  private downtimeStats(stats: CastStats): IStatField[] {
    return[
      this.field({
        label: 'Avg Downtime w/o Exec',
        value: format(stats.dotDowntimeStats.avgDowntimeNormalPhase, 1, 's'),
        highlight: this.highlight.dotDowntimeNormalPhase(stats)
      })
    ];
  }

  private downtimeExecStats(stats: CastStats): IStatField[] {
    return[
      this.field({
        label: 'Avg Downtime Exec',
        value: format(stats.dotDowntimeStats.avgDowntimeExecPhase, 1, 's'),
        highlight: this.highlight.dotDowntimeExecPhase(stats)
      })
    ];
  }

  private clipStats(stats: CastStats): IStatField[] {
    let clipStr = stats.clipStats.castCount > 0 ? stats.clipStats.clipCount.toString() : NO_VALUE;

    if (stats.clipStats.clipCount > 0) {
      clipStr += ` (${format(stats.clipStats.clippedPercent * 100, 1, '%')})`;
    }

    return [
      this.field({
        label: 'Clipped DoTs',
        value: clipStr,
        highlight: this.highlight.clippedDots(stats)
      })
    ];
  }
}
