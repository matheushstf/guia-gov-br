/* Guia gov.br Fácil — recursos de acessibilidade
   - Aumentar / diminuir letra
   - Alto contraste
   - Ouvir a página (leitura em voz alta pelo próprio navegador)
   - Imprimir
   As preferências ficam salvas só neste aparelho (localStorage). Nenhum dado é enviado a lugar nenhum. */
(function () {
  "use strict";

  var raiz = document.documentElement;
  var ESCALAS = [1, 1.15, 1.3, 1.5, 1.75];

  function ler(chave, padrao) {
    try { var v = localStorage.getItem(chave); return v === null ? padrao : v; }
    catch (e) { return padrao; }
  }
  function gravar(chave, valor) {
    try { localStorage.setItem(chave, valor); } catch (e) { /* modo privado: ignora */ }
  }

  // ---------- Tamanho da letra ----------
  var nivel = parseInt(ler("guia-escala", "0"), 10);
  if (isNaN(nivel) || nivel < 0 || nivel >= ESCALAS.length) nivel = 0;

  function aplicarEscala() {
    raiz.style.setProperty("--escala", ESCALAS[nivel]);
    gravar("guia-escala", String(nivel));
    avisar("Tamanho da letra: " + (nivel + 1) + " de " + ESCALAS.length);
  }

  // ---------- Contraste ----------
  function aplicarContraste(ligado, anunciar) {
    raiz.classList.toggle("alto-contraste", ligado);
    gravar("guia-contraste", ligado ? "1" : "0");
    var b = document.getElementById("btn-contraste");
    if (b) b.setAttribute("aria-pressed", ligado ? "true" : "false");
    if (anunciar) avisar(ligado ? "Alto contraste ligado" : "Alto contraste desligado");
  }

  // Aplica antes de desenhar a página para não "piscar"
  raiz.style.setProperty("--escala", ESCALAS[nivel]);
  if (ler("guia-contraste", "0") === "1") raiz.classList.add("alto-contraste");

  // ---------- Leitura em voz alta ----------
  var temVoz = "speechSynthesis" in window && "SpeechSynthesisUtterance" in window;
  var lendo = false;

  function vozPortugues() {
    var vozes = window.speechSynthesis.getVoices();
    for (var i = 0; i < vozes.length; i++) if (/^pt[-_]BR/i.test(vozes[i].lang)) return vozes[i];
    for (var j = 0; j < vozes.length; j++) if (/^pt/i.test(vozes[j].lang)) return vozes[j];
    return null;
  }

  function textoParaLer() {
    var principal = document.getElementById("conteudo");
    if (!principal) return "";
    // Trabalha numa cópia: assim o texto dos blocos fechados (<details>) também é lido
    var copia = principal.cloneNode(true);
    copia.querySelectorAll(".nao-ler").forEach(function (el) { el.remove(); });
    // Põe uma pausa no fim de títulos e itens de lista que não terminam com pontuação
    copia.querySelectorAll("h1,h2,h3,p,li,summary,a.botao").forEach(function (el) {
      var t = (el.textContent || "").trim();
      if (t && !/[.!?:]$/.test(t)) el.appendChild(document.createTextNode(". "));
      else el.appendChild(document.createTextNode(" "));
    });
    return copia.textContent || "";
  }

  // Divide em trechos curtos: alguns navegadores param de ler textos longos
  function dividir(texto) {
    var frases = texto.replace(/\s+/g, " ").match(/[^.!?:]+[.!?:]*/g) || [];
    var trechos = [], atual = "";
    frases.forEach(function (f) {
      if ((atual + f).length > 200) { if (atual) trechos.push(atual); atual = f; }
      else atual += f;
    });
    if (atual.trim()) trechos.push(atual);
    return trechos;
  }

  function pararLeitura() {
    window.speechSynthesis.cancel();
    lendo = false;
    atualizarBotaoVoz();
  }

  function iniciarLeitura() {
    var trechos = dividir(textoParaLer());
    if (!trechos.length) return;
    window.speechSynthesis.cancel();
    var voz = vozPortugues();
    lendo = true;
    atualizarBotaoVoz();
    trechos.forEach(function (t, i) {
      var u = new SpeechSynthesisUtterance(t);
      u.lang = "pt-BR";
      u.rate = 0.9;
      if (voz) u.voice = voz;
      if (i === trechos.length - 1) u.onend = function () { lendo = false; atualizarBotaoVoz(); };
      window.speechSynthesis.speak(u);
    });
  }

  function atualizarBotaoVoz() {
    var b = document.getElementById("btn-ouvir");
    if (!b) return;
    b.textContent = lendo ? "⏹ Parar" : "🔊 Ouvir";
    b.setAttribute("aria-pressed", lendo ? "true" : "false");
  }

  // ---------- Região de avisos para leitor de tela ----------
  function avisar(msg) {
    var r = document.getElementById("avisos");
    if (!r) return;
    r.textContent = "";
    setTimeout(function () { r.textContent = msg; }, 50);
  }

  // ---------- Monta a barra ----------
  document.addEventListener("DOMContentLoaded", function () {
    var barra = document.getElementById("barra-acess");
    if (!barra) return;

    barra.innerHTML =
      '<div class="container">' +
      '<span>Acessibilidade:</span>' +
      '<button type="button" id="btn-menos" aria-label="Diminuir o tamanho da letra">A−</button>' +
      '<button type="button" id="btn-mais" aria-label="Aumentar o tamanho da letra">A+</button>' +
      '<button type="button" id="btn-contraste" aria-pressed="false">◐ Contraste</button>' +
      (temVoz ? '<button type="button" id="btn-ouvir" aria-pressed="false">🔊 Ouvir</button>' : "") +
      '<button type="button" id="btn-imprimir">🖨 Imprimir</button>' +
      "</div>" +
      '<div id="avisos" class="pular" role="status" aria-live="polite"></div>';

    document.getElementById("btn-mais").addEventListener("click", function () {
      if (nivel < ESCALAS.length - 1) { nivel++; aplicarEscala(); }
    });
    document.getElementById("btn-menos").addEventListener("click", function () {
      if (nivel > 0) { nivel--; aplicarEscala(); }
    });
    document.getElementById("btn-contraste").addEventListener("click", function () {
      aplicarContraste(!raiz.classList.contains("alto-contraste"), true);
    });
    document.getElementById("btn-imprimir").addEventListener("click", function () {
      document.querySelectorAll("details").forEach(function (d) { d.open = true; });
      window.print();
    });
    if (temVoz) {
      document.getElementById("btn-ouvir").addEventListener("click", function () {
        if (lendo) pararLeitura(); else iniciarLeitura();
      });
      // algumas vozes só carregam depois
      window.speechSynthesis.onvoiceschanged = function () {};
      window.addEventListener("pagehide", pararLeitura);
    }

    aplicarContraste(raiz.classList.contains("alto-contraste"), false);
  });
})();
