import { CastDetails } from 'src/app/report/models/cast-details';
import { SpellSummary } from 'src/app/report/models/spell-summary';
import { SpellData } from 'src/app/logs/models/spell-data';

export class CastsSummary {
  allCasts: CastDetails[];
  spells: {[spellId: number]: SpellSummary};

  constructor(data: CastDetails[]) {
    this.allCasts = data;

    this.spells = Object.keys(SpellData)
      .map((k) => parseInt(k))
      .reduce((spells, spellId) => {
        spells[spellId] = new SpellSummary(spellId);
        return spells;
      }, {} as {[spellId: number]: SpellSummary});

    data.reduce((spells, details) => {
      spells[details.spellId].addCast(details);
      return spells;
    }, this.spells);
  }

  getSpellSummary(spellId: number) {
    return this.spells[spellId];
  }
}