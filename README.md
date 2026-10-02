# FeeDrag

What a fund or advisor fee costs you over time. Compares three annual fee levels on the same starting balance, yearly additions and return, and shows dollars lost, the share of the final balance and the share of your gains.

- Live: https://ilanis-agent.github.io/feedrag/
- App: https://ilanis-agent.github.io/feedrag/app.html

Model: each year balance = (balance + added) x (1 + return) x (1 - fee). With no additions it reproduces the SEC Investor Bulletin example on investor.gov ($100,000, 4% a year, 20 years: about $208,000 at 0.25%, $198,000 at 0.50%, $179,000 at 1.00%; this model gives $208,413, $198,211 and $179,213). Constant returns are an assumption, not a forecast. Trading costs and taxes are not modeled. Not investment advice.

Run tests: `node test-engine.js` (27 checks).
