var E = require('./engine.js'), n = 0, bad = 0;
function near(a, b, tol, m) { n++; if (!(Math.abs(a - b) <= tol)) { bad++; console.log('FAIL', m, a, b); } }
function is(a, b, m) { n++; if (a !== b) { bad++; console.log('FAIL', m, a, b); } }
// SEC Investor Bulletin (investor.gov, "How Fees and Expenses Affect Your Investment Portfolio"): $100,000, 4% a year, 20 years
// 0.25% fee -> about $208,000; 0.50% -> about $198,000; 1.00% -> about $179,000
near(E.project(100000, 0, 20, 4, 0.25).final, 208000, 500, 'SEC 0.25'); near(E.project(100000, 0, 20, 4, 0.5).final, 198000, 500, 'SEC 0.50'); near(E.project(100000, 0, 20, 4, 1).final, 179000, 500, 'SEC 1.00');
// exact values of the model
near(E.project(100000, 0, 20, 4, 1).final, 100000 * Math.pow(1.04 * 0.99, 20), 1e-6, 'model 1%');
// zero fee, plain compounding: 100000 at 4% for 20 years = 219,112.31
near(E.project(100000, 0, 20, 4, 0).final, 219112.31, 0.01, 'no fee'); near(E.project(1000, 0, 1, 10, 0).final, 1100, 1e-9, '1 year');
// contributions at the start of each year: 1,000 a year for 2 years at 10%: (1000*1.1 + 1000)*1.1 = 2310
near(E.project(0, 1000, 2, 10, 0).final, 2310, 1e-9, 'contrib'); near(E.project(0, 1000, 2, 10, 0).invested, 2000, 0, 'invested'); near(E.project(0, 1000, 2, 10, 0).gain, 310, 1e-9, 'gain');
// zero return still loses to fees: 1000, 0% return, 1% fee, 1 year = 990
near(E.project(1000, 0, 1, 0, 1).final, 990, 1e-9, 'fee on flat');
// series length and monotone in the fee
is(E.project(1000, 0, 10, 5, 0.5).series.length, 11, 'series'); is(E.project(1000, 0, 10, 5, 1).final < E.project(1000, 0, 10, 5, 0.5).final, true, 'monotone');
// compare: lost = base - final; lostPct; 1% fee on 4% over 20 years loses about 18% of the final balance
var c = E.compare(100000, 0, 20, 4, [0.25, 0.5, 1]);
near(c.base.final, 219112.31, 0.01, 'base'); near(c.rows[2].lost, c.base.final - c.rows[2].final, 1e-9, 'lost'); near(c.rows[2].lostPct, 18.2, 0.1, 'lostPct 1%'); near(c.rows[0].lostPct, 4.9, 0.1, 'lostPct .25');
near(c.rows[2].netReturn, (1.04 * 0.99 - 1) * 100, 1e-9, 'net return'); near(c.rows[2].gainLostPct, (1 - (c.rows[2].final - 100000) / (c.base.final - 100000)) * 100, 1e-9, 'gain lost');
is(E.compare(100000, 0, 20, 4, [0]).rows[0].lost, 0, 'zero fee row'); near(E.compare(100000, 0, 20, 4, [0]).rows[0].gainLostPct, 0, 1e-9, 'zero gain lost');
// invalid
is(E.project(-1, 0, 10, 5, 1), null, 'neg start'); is(E.project(1000, 0, 0, 5, 1), null, 'zero years'); is(E.project(1000, 0, 100, 5, 1), null, 'too long'); is(E.project(1000, 0, 10, 5, 100), null, 'fee 100'); is(E.project(0, 0, 10, 5, 1), null, 'nothing'); is(E.project(1000, 0, 10, -100, 1), null, 'ret -100'); is(E.compare(0, 0, 10, 5, [1]), null, 'compare invalid');
console.log((n - bad) + '/' + n + ' passed'); process.exit(bad ? 1 : 0);
