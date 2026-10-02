(function (root) {
  'use strict';
  // Each year: balance = (balance + contribution) * (1 + gross) * (1 - fee). Contributions go in at the start of each year.
  // With no contributions this reproduces the SEC Investor Bulletin example ($100,000, 4% a year, 20 years).
  function project(start, contrib, years, gross, fee) {
    start = +start; contrib = +contrib || 0; years = Math.round(+years); gross = +gross / 100; fee = +fee / 100;
    if (!(start >= 0) || !(contrib >= 0) || !(years >= 1 && years <= 80) || !isFinite(gross) || !(gross > -1) || !(fee >= 0 && fee < 1) || (start === 0 && contrib === 0)) return null;
    var b = start, put = start, series = [b];
    for (var y = 1; y <= years; y++) { b = (b + contrib) * (1 + gross) * (1 - fee); put += contrib; series.push(b); }
    return { final: b, invested: put, series: series, gain: b - put };
  }
  function compare(start, contrib, years, gross, fees) {
    var base = project(start, contrib, years, gross, 0); if (!base) return null;
    var rows = [];
    for (var i = 0; i < fees.length; i++) {
      var f = +fees[i]; var p = project(start, contrib, years, gross, f); if (!p) return null;
      rows.push({
        fee: f, final: p.final, lost: base.final - p.final, lostPct: base.final > 0 ? (1 - p.final / base.final) * 100 : 0,
        gainLostPct: base.gain > 0 ? (1 - p.gain / base.gain) * 100 : 0, netReturn: ((1 + gross / 100) * (1 - f / 100) - 1) * 100, series: p.series
      });
    }
    return { base: base, rows: rows };
  }
  // years of the zero-fee path you would need to reach the fee path's final value is not needed; keep the API small.
  var api = { project: project, compare: compare };
  if (typeof module !== 'undefined' && module.exports) module.exports = api; else root.FeeDrag = api;
})(typeof window !== 'undefined' ? window : this);
