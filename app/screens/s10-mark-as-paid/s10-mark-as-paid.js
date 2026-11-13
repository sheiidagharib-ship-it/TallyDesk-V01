/* S10 Mark as paid — Flow 2 · Step 7 (K19: marked by hand) */
TD.screens.s10 = {
  name: 'Record payment',
  meta: function () { return { flow: 2, nav: 'overdue' }; },
  render: function (S) {
    var u = TD.ui, e = u.esc, x = TD.store.get(S.current) || S.overdue[0];
    var left = S.overdue.filter(function (o) { return o.status !== 'paid' && o.no !== x.no; }).length;
    var remain = left === 0 ? 'No overdue invoices remain.' : left + (left === 1 ? ' overdue invoice remains.' : ' overdue invoices remain.');
    return u.head({ title: 'Record payment', sub: 'Payment is marked by hand' }) +
      '<div class="s10-center"><div class="s10-card">' +
        '<h2>Mark ' + e(x.no) + ' as paid?</h2>' +
        '<dl class="kv"><dt>Client</dt><dd>' + e(x.client) + '</dd><dt>Total</dt><dd><b>' + u.eur(u.totals(u.latest(x)).total) + '</b></dd><dt>Due</dt><dd>' + u.fmtD(x.due) + '</dd></dl>' +
        '<div class="s10-note">It leaves the overdue list. ' + remain + '</div>' +
        '<div class="s10-btns"><button type="button" class="btn" data-act="cancel">Cancel</button>' +
          '<button type="button" class="btn btn-pri" data-act="paid">Mark as paid</button></div>' +
      '</div></div>';
  },
  bind: function (root, S) {
    var x = TD.store.get(S.current) || S.overdue[0];
    root.querySelector('[data-act="cancel"]').addEventListener('click', function () { TD.app.go('s8'); });
    TD.app.once(root.querySelector('[data-act="paid"]'), function () {
      x.status = 'paid'; x.log.push({ t: 'Marked as paid', d: TD.app.today });
      TD.app.go('s7');
    });
  }
};
