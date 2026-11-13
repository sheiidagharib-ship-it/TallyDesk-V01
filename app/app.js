/* Tally Desk — moves between screens with the address (#s1 … #s10). No routing library. */
window.TD = window.TD || {};
TD.screens = TD.screens || {};
TD.app = (function () {
  var root = document.getElementById('app');
  var S = TD.store.load();
  var opts = {};            // one-time options for the next screen (focus, S7 state)
  var ORDER = ['s1','s2','s3','s4','s5','s6','s7','s8','s9','s10'];

  function current() { var id = location.hash.replace('#', ''); return ORDER.indexOf(id) >= 0 ? id : 's1'; }

  function go(id, o) {
    S = TD.store.state;
    o = o || {};
    if (id !== 's2' && id !== 's6') S.corr = null;                        // leaving a correction drops it
    if (id === 's1' && S.inv.status !== 'draft') {                        // sent invoices can't be edited (K16): start the next one
      var n = parseInt(S.inv.no.replace(/\D/g, ''), 10) + 1;
      S.inv = TD.store.newInvoice('INV-' + String(n).padStart(4, '0'));
    }
    TD.store.save();
    opts = o;
    if (location.hash !== '#' + id) location.hash = id; else render();
  }

  function shell(meta, body) {
    var u = TD.DATA.users[meta.flow === 2 ? 'flow2' : 'flow1'], e = TD.ui.esc;
    return '<div class="td-app"><nav class="td-nav" aria-label="Main">' +
      '<div class="td-brand"><span class="td-logo" aria-hidden="true">T</span>Tally Desk</div>' +
      '<a href="#s1" data-go="s1" class="td-link' + (meta.nav === 'invoices' ? ' on" aria-current="page' : '') + '">Invoices</a>' +
      '<a href="#s7" data-go="s7" class="td-link' + (meta.nav === 'overdue' ? ' on" aria-current="page' : '') + '">Overdue</a>' +
      '<div class="td-user"><span class="td-avatar" aria-hidden="true">' + e(u.initial) + '</span><div><b>' + e(u.name) + '</b><div class="td-role">' + e(u.role) + '</div></div></div>' +
      '</nav><main class="td-main">' + body + '</main></div>';
  }

  function render() {
    S = TD.store.state;
    var id = current(), screen = TD.screens[id], o = opts;
    opts = {};
    var meta = screen.meta(S);
    root.innerHTML = shell(meta, '<div class="td-screen ' + id + '">' + screen.render(S, o) + '</div>');
    root.querySelectorAll('[data-go]').forEach(function (a) {
      a.addEventListener('click', function (ev) { ev.preventDefault(); go(a.getAttribute('data-go')); });
    });
    screen.bind(root, S, o);
    window.scrollTo(0, 0);
    var f = o.focus && document.getElementById(o.focus);
    (f || root.querySelector('.td-title')).focus();
    document.title = 'Tally Desk — ' + screen.name;
  }

  function toast(text) {
    var t = document.createElement('div');
    t.className = 'td-toast'; t.setAttribute('role', 'status'); t.textContent = text;
    document.body.appendChild(t);
    setTimeout(function () { t.remove(); }, 2600);
  }

  // Stops a second click on Send from sending twice
  function once(btn, fn) { btn.addEventListener('click', function () { if (btn.disabled) return; btn.disabled = true; fn(); }); }

  window.addEventListener('hashchange', render);
  return { go: go, render: render, toast: toast, once: once, save: function () { TD.store.save(); },
    ORDER: ORDER, today: TD.DATA.today, start: function () { if (!location.hash) location.hash = 's1'; render(); } };
})();
TD.app.start();
