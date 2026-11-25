/* Monta el catálogo de existencias de levzen.com en esta misma dirección
   (informacion.levzen.com/auto/, /moto/ y /camion/): el HTML ya trae completas las
   direcciones de sus fotos y fuentes, así que se escribe tal cual en la página. */
(function(){
  var yo = document.currentScript, linea = yo.getAttribute('data-linea');
  var nav = performance.getEntriesByType ? performance.getEntriesByType('navigation')[0] : null;
  var recarga = !!nav && nav.type === 'reload';
  var corte = window.AbortController ? new AbortController() : null;
  var reloj = setTimeout(function(){ if(corte) corte.abort(); }, 20000);
  var html = fetch('https://levzen.com/existencias/' + linea, {
    credentials: 'omit',
    cache: recarga ? 'no-cache' : 'default',
    signal: corte ? corte.signal : undefined
  }).then(function(r){ if(!r.ok) throw r.status; return r.text(); });
  var pagina = new Promise(function(ok){
    if(document.readyState !== 'loading') ok();
    else document.addEventListener('DOMContentLoaded', ok);
  });
  Promise.all([html, pagina]).then(function(x){
    clearTimeout(reloj);
    if(x[0].indexOf('class="web-barra"') < 0) throw 'no es el catálogo';
    document.open(); document.write(x[0]); document.close();
  }).catch(function(){
    clearTimeout(reloj);
    pagina.then(function(){
      document.body.className = 'fallo';
      document.querySelector('.barra span').textContent = '';
      document.getElementById('fallo').hidden = false;
    });
  });
})();
