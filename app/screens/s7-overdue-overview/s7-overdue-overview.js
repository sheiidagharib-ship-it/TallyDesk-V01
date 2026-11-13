/* S7 Overdue overview — Flow 2 · Step 1 (and Step 8). States: default, empty, loading, error. */
TD.screens.s7 = {
  name: 'Overdue invoices',
  meta: function () { return { flow: 2, nav: 'overdue' }; },
  open: function (S) { return S.overdue.filter(function (o) { return o.status !== 'paid'; }); },
  next: function (text) { return '<div class="s7-next"><b>What you can do next:</b><span>' + text + '</span></div>'; },
  render: function (S, o) {
    var u = TD.ui, e = u.esc, list = this.open(S), today = TD.app.today;
    var state = o.s7 || (list.length ? 'default' : 'empty');
    this.state = state;
    var age = function (x) { return u.daysBetween(x.due, today); };
    var oldest = list.reduce(function (a, x) { return Math.max(a, age(x)); }, 0);
    var body;
    if (state === 'default') {
      var rows = list.map(function (x) {
        var f = x.followups;
        return '<tr><td class="mono s7-no">' + e(x.no) + '</td><td class="wrap">' + e(x.client) + '</td>' +
          '<td class="r num">' + u.eur(u.totals(u.latest(x)).total) + '</td><td>' + u.fmtD(x.due) + '</td><td class="r">' + age(x) + ' days</td>' +
          '<td>' + (x.delivery.seen === 'yes' ? u.pill('green', 'Seen') : u.pill('amber', 'Not seen')) + '</td>' +
          '<td>' + (f.length ? f.length + ' · ' + u.fmtShort(f[f.length - 1]) : 'None yet') + '</td>' +
          '<td class="s7-act"><button type="button" class="btn btn-sm" data-open="' + e(x.no) + '">Follow up</button></td></tr>'; }).join('');
      body = '<div class="s7-counts">' +
          '<div class="s7-count"><span>Overdue</span><b>' + list.length + '</b></div>' +
          '<div class="s7-count"><span>Not seen by the client</span><b>' + list.filter(function (x) { return x.delivery.seen !== 'yes'; }).length + '</b></div>' +
          '<div class="s7-count"><span>Oldest overdue</span><b>' + oldest + ' days</b></div></div>' +
        '<section class="panel"><div class="table-scroll"><table class="table s7-table"><thead><tr><th>Number</th><th>Client</th><th class="r">Total</th><th>Due</th><th class="r">Overdue</th><th>Delivery</th><th>Follow-ups</th><th><span class="s7-sr">Action</span></th></tr></thead><tbody>' +
          rows + '</tbody></table></div>' + this.next('Pick an overdue invoice and follow up. Paid invoices leave this list.') + '</section>';
    } else if (state === 'empty') {
      body = '<section class="panel"><div class="s7-empty"><div class="s7-check" aria-hidden="true"><svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#0F5C5A" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg></div>' +
        '<h2>No overdue invoices</h2><p>Every invoice is paid or not yet due. This round of follow-up is done.</p></div>' +
        this.next('Nothing to follow up. Go back to Invoices.') + '</section>';
    } else if (state === 'loading') {
      var bar = '<div class="s7-skel-row">' + [70, 80, 60, 70, 50].map(function (w) { return '<div style="width:' + w + '%"></div>'; }).join('') + '</div>';
      body = '<section class="panel"><div class="s7-skel" aria-busy="true"><div class="s7-skel-counts"><div></div><div></div><div></div></div>' +
        bar + bar + bar + bar + '<span class="s7-loading">Loading overdue invoices…</span></div>' +
        this.next('Wait. Follow-up buttons appear when the list has loaded.') + '</section>';
    } else {
      body = '<section class="panel"><div class="s7-error" role="alert"><svg aria-hidden="true" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#8A5200" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 9v4"/><path d="M12 17h.01"/><path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z"/></svg>' +
        '<div class="s7-error-text"><b>The overdue list could not be loaded</b><span>Your invoices are not changed. Try again.</span>' +
        '<div><button type="button" class="btn" data-act="retry">Try again</button></div></div></div>' +
        this.next('Try again.') + '</section>';
    }
    return u.head({ title: 'Overdue invoices', sub: 'All overdue invoices in one place · today is ' + u.fmtD(today),
        actions: '<button type="button" class="btn btn-pri" data-act="oldest"' + (state === 'default' && list.length ? '' : ' disabled') + '>Start with the oldest</button>' }) + body;
  },
  bind: function (root, S) {
    var list = this.open(S), today = TD.app.today;
    function open(no) { S.current = no; TD.app.go('s8'); }
    root.querySelectorAll('[data-open]').forEach(function (b) { b.addEventListener('click', function () { open(b.getAttribute('data-open')); }); });
    root.querySelector('[data-act="oldest"]').addEventListener('click', function () {
      var o = list.slice().sort(function (a, b) { return TD.ui.daysBetween(a.due, today) < TD.ui.daysBetween(b.due, today) ? 1 : -1; })[0];
      if (o) open(o.no);
    });
    var retry = root.querySelector('[data-act="retry"]');
    if (retry) retry.addEventListener('click', function () { TD.app.go('s7'); });
  }
};
