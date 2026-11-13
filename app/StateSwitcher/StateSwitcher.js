/* StateSwitcher — review bar for the designer. Not part of the design.
   Shows only when the address has ?review=1. Floats at the bottom centre, takes no space,
   changes no screen. To remove it: delete its <script> line in index.html. */
(function () {
  if (!/[?&]review=1(&|$)/.test(location.search)) return;
  var ITEMS = [
    ['s1', 'S1 New invoice'], ['s2', 'S2 Items, tax and discount'], ['s3', 'S3 Check before sending'],
    ['s4', 'S4 Send invoice'], ['s5', 'S5 Delivery status'], ['s6', 'S6 Correction with history'],
    ['s7:default', 'S7 Overdue · Default'], ['s7:empty', 'S7 Overdue · Empty'],
    ['s7:loading', 'S7 Overdue · Loading'], ['s7:error', 'S7 Overdue · Error'],
    ['s8', 'S8 Overdue invoice'], ['s9', 'S9 Send follow-up'], ['s10', 'S10 Mark as paid']
  ];
  var css =
    '#td-review{position:fixed;left:50%;bottom:12px;transform:translateX(-50%);z-index:2147483647;' +
    'max-width:calc(100vw - 24px);display:flex;flex-wrap:wrap;justify-content:center;gap:4px;padding:6px;' +
    'background:#222;color:#fff;border-radius:8px;box-shadow:0 4px 16px rgba(0,0,0,.35);font:12px/1.2 system-ui,sans-serif}' +
    '#td-review button{font:inherit;color:#fff;background:#3a3a3a;border:1px solid #555;border-radius:5px;padding:5px 8px;cursor:pointer}' +
    '#td-review button:hover{background:#4a4a4a}' +
    '#td-review button[aria-pressed="true"]{background:#fff;color:#222}' +
    '#td-review .td-r-tools{display:flex;gap:4px;margin-left:6px;padding-left:6px;border-left:1px solid #555}' +
    '#td-review.td-r-min>button{display:none}';
  var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);
  var bar = document.createElement('div');
  bar.id = 'td-review'; bar.setAttribute('role', 'toolbar'); bar.setAttribute('aria-label', 'Review: screens and states');
  bar.innerHTML = ITEMS.map(function (it) { return '<button type="button" data-r="' + it[0] + '">' + it[1] + '</button>'; }).join('') +
    '<span class="td-r-tools"><button type="button" data-tool="reset">Reset data</button><button type="button" data-tool="min">Hide</button></span>';
  document.body.appendChild(bar);

  function mark() {
    var id = location.hash.replace('#', '') || 's1';
    var s7 = TD.screens.s7.state || 'default';
    bar.querySelectorAll('[data-r]').forEach(function (b) {
      var r = b.getAttribute('data-r');
      b.setAttribute('aria-pressed', String(r === id || (id === 's7' && r === 's7:' + s7)));
    });
  }
  bar.addEventListener('click', function (ev) {
    var b = ev.target.closest('button'); if (!b) return;
    var tool = b.getAttribute('data-tool');
    if (tool === 'reset') { TD.store.reset(); TD.app.go('s1'); TD.app.toast('Data reset'); }
    else if (tool === 'min') { var min = bar.classList.toggle('td-r-min'); b.textContent = min ? 'Show review bar' : 'Hide'; }
    else {
      var p = b.getAttribute('data-r').split(':');
      TD.app.go(p[0], p[1] ? { s7: p[1] } : {});
    }
    setTimeout(mark, 0);
  });
  window.addEventListener('hashchange', function () { setTimeout(mark, 0); });
  mark();
})();
