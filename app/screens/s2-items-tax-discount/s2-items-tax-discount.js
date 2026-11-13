/* S2 Items, tax and discount — Flow 1 · Step 2.
   Also used to change the lines of a correction (guess: S6 has no place to edit lines). */
TD.screens.s2 = {
  name: 'Items, tax and discount',
  meta: function (S) { return S.corr ? { flow: S.corr.flow, nav: S.corr.flow === 2 ? 'overdue' : 'invoices' } : { flow: 1, nav: 'invoices' }; },
  model: function (S) { return S.corr || S.inv; },
  totalsHtml: function (m) {
    var u = TD.ui, t = u.totals(m);
    return '<span>Subtotal</span><span class="num">' + u.eur(t.sub) + '</span>' +
      '<span>Discount</span><span class="num">− ' + u.eur(t.disc) + '</span>' +
      '<span>Tax ' + t.rate + '%</span><span class="num">' + u.eur(t.tax) + '</span>' +
      '<span class="big">Total</span><span class="num big">' + u.eur(t.total) + '</span>';
  },
  render: function (S) {
    var u = TD.ui, e = u.esc, m = this.model(S), corr = S.corr;
    var inv = corr ? TD.store.get(corr.target) : S.inv;
    var rows = m.items.map(function (it, i) {
      return '<tr><td><input class="input" aria-label="Description" data-i="' + i + '" data-f="d" value="' + e(it.d) + '"></td>' +
        '<td><input class="input s2-qty" aria-label="Quantity" inputmode="decimal" data-i="' + i + '" data-f="q" value="' + e(it.q) + '"></td>' +
        '<td><input class="input s2-price" aria-label="Price" inputmode="decimal" data-i="' + i + '" data-f="p" value="' + e(it.p) + '"></td>' +
        '<td class="r num" id="s2-amt-' + i + '">' + u.eur(u.num(it.q) * u.num(it.p)) + '</td></tr>'; }).join('');
    var head = corr
      ? u.head({ title: 'Correct ' + e(inv.no), sub: e(inv.client) + ' · the sent invoice stays in the history',
          actions: '<button type="button" class="btn" data-act="cancel">Cancel</button>' })
      : u.head({ title: 'New invoice', sub: e(inv.no) + ' · ' + e(inv.client || 'No client yet'),
          actions: '<button type="button" class="btn" data-act="draft">Save as draft</button>' }) + u.steps(2);
    return head +
      '<div class="s2-cols">' +
        '<section class="panel"><div><h2>Items and prices</h2></div>' +
          '<div class="table-scroll"><table class="table s2-items"><thead><tr><th>Description</th><th>Qty</th><th>Price (€)</th><th class="r">Amount</th></tr></thead><tbody>' + rows + '</tbody></table></div>' +
          '<div><button type="button" class="btn btn-sm" data-act="add">+ Add line</button></div></section>' +
        '<section class="panel"><div><h2>Tax and discount</h2><div class="panel-sub">Tax is a percentage, discount a fixed amount in €</div></div>' +
          '<div class="s2-fields">' +
            '<label class="field" for="s2-tax">Tax rate (%)<input id="s2-tax" class="input" inputmode="decimal" data-k="tax" value="' + e(m.tax) + '"></label>' +
            '<label class="field" for="s2-disc">Discount (€)<input id="s2-disc" class="input" inputmode="decimal" data-k="disc" value="' + e(m.disc) + '"></label></div>' +
          '<div class="totals" id="s2-totals">' + this.totalsHtml(m) + '</div></section></div>' +
      '<div class="foot"><button type="button" class="btn" data-act="back">Back</button>' +
        '<button type="button" class="btn btn-pri" data-act="next">' + (corr ? 'Next: what changed' : 'Next: check the invoice') + '</button></div>';
  },
  bind: function (root, S) {
    var self = this, m = this.model(S), u = TD.ui, corr = S.corr;
    function refresh() { document.getElementById('s2-totals').innerHTML = self.totalsHtml(m); TD.app.save(); }
    root.querySelectorAll('[data-f]').forEach(function (el) {
      el.addEventListener('input', function () {
        var i = +el.getAttribute('data-i'), it = m.items[i];
        it[el.getAttribute('data-f')] = el.value;
        document.getElementById('s2-amt-' + i).textContent = u.eur(u.num(it.q) * u.num(it.p));
        refresh();
      });
    });
    root.querySelectorAll('[data-k]').forEach(function (el) {
      el.addEventListener('input', function () { m[el.getAttribute('data-k')] = el.value; refresh(); });
    });
    root.querySelector('[data-act="add"]').addEventListener('click', function () {
      m.items.push({ d: '', q: '', p: '' }); TD.app.save(); TD.app.render();
      var all = document.querySelectorAll('.s2-items [data-f="d"]'); all[all.length - 1].focus();
    });
    var draft = root.querySelector('[data-act="draft"]');
    if (draft) draft.addEventListener('click', function () { TD.app.save(); TD.app.toast('Saved as draft'); });
    var cancel = root.querySelector('[data-act="cancel"]');
    if (cancel) cancel.addEventListener('click', function () { TD.app.go(corr.ret); });
    root.querySelector('[data-act="back"]').addEventListener('click', function () { TD.app.go(corr ? corr.ret : 's1'); });
    root.querySelector('[data-act="next"]').addEventListener('click', function () { TD.app.go(corr ? 's6' : 's3'); });
  }
};
