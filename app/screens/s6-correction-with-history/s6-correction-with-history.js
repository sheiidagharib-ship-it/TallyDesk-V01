/* S6 Correction with history — Flow 1 · Step 7 and Flow 2 · Step 5 */
TD.screens.s6 = {
  name: 'Correction',
  meta: function (S) { var f = S.corr ? S.corr.flow : 1; return { flow: f, nav: f === 2 ? 'overdue' : 'invoices' }; },
  ensure: function (S) {     // opened directly (e.g. from the review bar): start a correction with no changes
    if (S.corr) return S.corr;
    var v = TD.ui.latest(S.inv);
    S.corr = { target: 'draft', flow: 1, ret: 's5', back: 's5', items: TD.store.copy(v.items), tax: v.tax, disc: v.disc, note: '' };
    return S.corr;
  },
  // What changed: lines matched by description; only what the person typed
  diff: function (before, after) {
    var u = TD.ui, key = function (i) { return String(i.d).trim().toLowerCase(); }, rows = [], seen = {};
    var amt = function (i) { return u.num(i.q) * u.num(i.p); };
    u.lines(before).forEach(function (o) {
      var k = key(o), n = u.lines(after).filter(function (x) { return key(x) === k && !seen[u.lines(after).indexOf(x)]; })[0];
      if (n) { seen[u.lines(after).indexOf(n)] = 1; rows.push({ d: o.d, a: amt(o), b: amt(n), kind: amt(o) === amt(n) ? '' : 'changed' }); }
      else rows.push({ d: o.d, a: amt(o), b: null, kind: 'removed' });
    });
    u.lines(after).forEach(function (n, i) { if (!seen[i]) rows.push({ d: n.d, a: null, b: amt(n), kind: 'added' }); });
    return rows;
  },
  render: function (S) {
    var u = TD.ui, e = u.esc, C = this.ensure(S), inv = TD.store.get(C.target);
    var before = u.latest(inv), tb = u.totals(before), ta = u.totals(C);
    var past = [{ label: '<b class="mono s6-no">' + e(inv.no) + '</b> · original', when: inv.sentOn, total: u.totals(inv).total }]
      .concat((inv.corrections || []).map(function (c) { return { label: '<b>Correction to ' + e(inv.no) + '</b>', when: c.sentOn, total: u.totals(c).total }; }));
    var history = past.map(function (p) {
      return '<li class="s6-step"><i class="s6-dot s6-dot-old" aria-hidden="true"></i><div class="wrap">' + p.label +
        '<div class="s6-meta">Sent ' + u.fmtD(p.when) + ' · ' + u.eur(p.total) + '</div></div>' + u.pill('grey', 'Replaced') + '</li>'; }).join('') +
      '<li class="s6-step s6-last"><i class="s6-dot" aria-hidden="true"></i><div class="wrap"><b>Correction to ' + e(inv.no) + '</b>' +
        '<div class="s6-meta">Draft · ' + u.eur(ta.total) + '</div></div>' + u.pill('teal', 'To send') + '</li>';
    var money = function (v) { return v == null ? '—' : u.eur(v); };
    var rows = this.diff(before, C).map(function (r) {
      return '<tr' + (r.kind ? ' class="s6-changed"' : '') + '><td>' + (r.kind ? '<b>' + e(r.d || '—') + '</b> · ' + r.kind : e(r.d || '—')) +
        '</td><td class="r num">' + money(r.a) + '</td><td class="r num">' + money(r.b) + '</td></tr>'; }).join('');
    if (tb.disc || ta.disc) rows += '<tr><td>Discount</td><td class="r num">− ' + u.eur(tb.disc) + '</td><td class="r num">− ' + u.eur(ta.disc) + '</td></tr>';
    rows += '<tr><td>Tax ' + (tb.rate === ta.rate ? ta.rate + '%' : tb.rate + '% → ' + ta.rate + '%') + '</td><td class="r num">' + u.eur(tb.tax) + '</td><td class="r num">' + u.eur(ta.tax) + '</td></tr>' +
      '<tr><td><b>Total</b></td><td class="r num"><b>' + u.eur(tb.total) + '</b></td><td class="r num"><b>' + u.eur(ta.total) + '</b></td></tr>';
    return u.head({ title: 'Correct ' + e(inv.no), sub: e(inv.client) + ' · the sent invoice stays in the history',
        actions: '<button type="button" class="btn" data-act="cancel">Cancel</button>' }) +
      '<div class="s6-cols"><div class="s6-col">' +
        '<section class="panel"><div><h2>One visible history</h2><div class="panel-sub">The original and its correction stay together</div></div><ol class="s6-history">' + history + '</ol></section>' +
        '<section class="panel"><div><h2>Numbering and record</h2></div></section>' +
      '</div><div class="s6-col">' +
        '<section class="panel"><div><h2>What changed</h2><div class="panel-sub">The client and their accountant see this</div></div>' +
          '<div class="table-scroll"><table class="table s6-table"><thead><tr><th>Line</th><th class="r">Original</th><th class="r">Correction</th></tr></thead><tbody>' + rows + '</tbody></table></div></section>' +
        '<section class="panel"><label class="field" for="s6-note">Note to the client<input id="s6-note" class="input" value="' + e(C.note) + '"></label></section>' +
      '</div></div>' +
      '<div class="foot"><button type="button" class="btn" data-act="back">Back to invoice</button>' +
        '<button type="button" class="btn btn-pri" data-act="send">Send correction</button></div>';
  },
  bind: function (root, S) {
    var C = S.corr, inv = TD.store.get(C.target), today = TD.app.today;
    root.querySelector('#s6-note').addEventListener('input', function (ev) { C.note = ev.target.value; TD.app.save(); });
    root.querySelector('[data-act="cancel"]').addEventListener('click', function () { TD.app.go(C.ret); });
    root.querySelector('[data-act="back"]').addEventListener('click', function () { TD.app.go(C.back); });
    TD.app.once(root.querySelector('[data-act="send"]'), function () {
      inv.corrections.push({ items: TD.store.copy(C.items), tax: C.tax, disc: C.disc, note: C.note, sentOn: today });
      inv.log.push({ t: 'Correction sent to ' + inv.to, d: today });
      TD.app.go(C.ret);   // Flow 1 → S5; Flow 2 → back to Step 4, S9 (Flows v1.0)
    });
  }
};
