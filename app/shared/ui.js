/* Small helpers shared by the screens: text, money, dates, invoice maths, common parts. */
window.TD = window.TD || {};
TD.ui = (function () {
  var MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function num(v) { var n = parseFloat(String(v == null ? '' : v).replace(/\s/g, '').replace(',', '.')); return isFinite(n) ? n : 0; }
  function eur(n) { return (n < 0 ? '− ' : '') + '€' + Math.abs(n).toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 }); }
  function parse(iso) { if (!iso) return null; var p = iso.split('-'); return new Date(+p[0], +p[1] - 1, +p[2]); }
  function iso(d) { return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); }
  function fmtD(s) { var d = parse(s); return d ? d.getDate() + ' ' + MONTHS[d.getMonth()] + ' ' + d.getFullYear() : '—'; }
  function fmtShort(s) { var d = parse(s); return d ? d.getDate() + ' ' + MONTHS[d.getMonth()] : '—'; }
  function addDays(s, n) { var d = parse(s); if (!d) return ''; d.setDate(d.getDate() + n); return iso(d); }
  function daysBetween(a, b) { return Math.round((parse(b) - parse(a)) / 86400000); }

  // Lines the person really filled in (empty rows are left out of the invoice)
  function lines(m) { return (m.items || []).filter(function (i) { return String(i.d).trim() || num(i.q) * num(i.p); }); }
  function totals(m) {
    var sub = lines(m).reduce(function (a, i) { return a + num(i.q) * num(i.p); }, 0);
    var disc = Math.min(sub, Math.max(0, num(m.disc)));
    var tax = (sub - disc) * Math.max(0, num(m.tax)) / 100;
    return { sub: sub, disc: disc, tax: tax, rate: num(m.tax), total: sub - disc + tax };
  }
  function due(inv) { return inv.due || (inv.issued && inv.terms ? addDays(inv.issued, +inv.terms) : ''); }
  // The version the client should pay: last sent correction, else the original
  function latest(inv) { var c = inv.corrections || []; return c.length ? c[c.length - 1] : inv; }

  function pill(kind, text, bold) { return '<span class="pill pill-' + kind + (bold ? ' pill-b' : '') + '">' + esc(text) + '</span>'; }
  function head(o) {
    return '<div class="td-head"><div class="td-head-text">' +
      '<h1 class="td-title" tabindex="-1">' + o.title + '</h1>' +
      (o.sub ? '<div class="td-sub">' + o.sub + '</div>' : '') + '</div>' +
      '<div class="td-actions">' + (o.actions || '') + '</div></div>';
  }
  function steps(n) {
    return '<div class="steps">' + ['1. Client and details', '2. Items, tax and discount', '3. Check', '4. Send']
      .map(function (s, i) { return '<div' + (i + 1 === n ? ' class="on" aria-current="step"' : i + 1 < n ? ' class="done"' : '') + '>' + s + '</div>'; }).join('') + '</div>';
  }
  // Invoice as the client sees it. opts.short = only the Total line (as on S4)
  function paper(inv, opts) {
    opts = opts || {};
    var c = TD.store.client(inv.client) || {}, t = totals(inv), S = TD.DATA.sender;
    var rows = lines(inv).map(function (i) {
      return '<tr><td>' + esc(i.d || '—') + '</td><td class="r num">' + esc(i.q) + '</td><td class="r num">' + eur(num(i.p)) +
        '</td><td class="r num">' + eur(num(i.q) * num(i.p)) + '</td></tr>'; }).join('');
    var tot = opts.short ? '' :
      '<span>Subtotal</span><span class="num">' + eur(t.sub) + '</span>' +
      (t.disc ? '<span>Discount</span><span class="num">− ' + eur(t.disc) + '</span>' : '') +
      '<span>Tax ' + t.rate + '%</span><span class="num">' + eur(t.tax) + '</span>';
    return '<div class="paper">' +
      '<div class="paper-row"><div><div class="paper-title">Invoice</div><div class="mono">' + esc(inv.no) + '</div></div>' +
      '<div class="r-text"><b>' + esc(S.name) + '</b><br><span class="muted">' + esc(S.email) + '</span></div></div>' +
      '<div class="paper-row"><div class="wrap"><span class="muted">Bill to</span><br><b>' + esc(c.name || '—') + '</b><br>' + esc(c.contact || '') + '</div>' +
      '<div class="r-text"><span class="muted">Issued</span> ' + fmtD(inv.issued) + '<br><span class="muted">Due</span> ' + fmtD(due(inv)) + '</div></div>' +
      '<div class="table-scroll"><table class="table"><thead><tr><th>Item</th><th class="r">Qty</th><th class="r">Price</th><th class="r">Amount</th></tr></thead><tbody>' +
      rows + '</tbody></table></div>' +
      '<div class="totals">' + tot + '<span class="big">Total</span><span class="num big">' + eur(t.total) + '</span></div></div>';
  }
  function activity(log) {
    return '<ul class="activity">' + log.slice().reverse().map(function (l) {
      return '<li><i' + (l.warn ? ' class="warn"' : '') + ' aria-hidden="true"></i><div>' + esc(l.t) + '<small>' + fmtD(l.d) + '</small></div></li>'; }).join('') + '</ul>';
  }
  return { esc: esc, num: num, eur: eur, fmtD: fmtD, fmtShort: fmtShort, addDays: addDays, daysBetween: daysBetween,
    lines: lines, totals: totals, due: due, latest: latest, pill: pill, head: head, steps: steps, paper: paper, activity: activity };
})();
