# Guia gov.br Fácil

Guia digital **acessível** com passo a passo em linguagem simples para usar a **conta gov.br**, o **Meu INSS**, o **Cadastro Único** e a **Carteira de Trabalho Digital**, com alertas sobre golpes. Público-alvo: usuários dos Centros de Referência de Assistência Social (CRAS) de Passo Fundo/RS.

Projeto da **Atividade Extensionista II**, UNINTER (Escola Superior Politécnica).

**ODS:** 1 (Erradicação da Pobreza), 10 (Redução das Desigualdades) e 16 (Paz, Justiça e Instituições Eficazes).

## Funcionalidades

- 7 páginas: Início, Conta gov.br, Meu INSS, Cadastro Único, Carteira de Trabalho Digital, Cuidado com golpes e Onde pedir ajuda.
- Barra de acessibilidade em todas as páginas:
  - **A+ / A−**: 5 tamanhos de letra.
  - **Contraste**: modo alto contraste (preto e amarelo).
  - **Ouvir**: leitura da página em voz alta (Web Speech API, voz pt-BR do próprio aparelho).
  - **Imprimir**: gera uma cartilha em papel, com os links escritos por extenso.
- As preferências ficam salvas só no aparelho (localStorage).
- HTML semântico, link "Pular para o conteúdo", foco visível, alvos de toque de no mínimo 44px e região `aria-live` para avisos (WCAG 2.1 AA / eMAG).
- Layout para celular primeiro.

## Privacidade

O site **não tem formulários, login, cookies de rastreamento nem coleta de dados pessoais**. Ele só explica os passos e aponta para os canais oficiais (`*.gov.br`).

## Tecnologias

HTML5, CSS3 e JavaScript puro, sem dependências. Hospedagem estática no GitHub Pages.

**Acesse:** https://matheushstf.github.io/guia-gov-br/

## Como rodar

Basta abrir o `index.html` no navegador. Para testar como no servidor:

```bash
python -m http.server 8000
# abra http://localhost:8000
```

## Publicar no GitHub Pages

1. Crie um repositório público (por exemplo `guia-govbr-facil`) e envie estes arquivos.
2. Vá em **Settings → Pages → Build and deployment**, escolha **Deploy from a branch**, branch `main`, pasta `/ (root)`, e clique em **Save**.
3. Em 1 ou 2 minutos o site fica em `https://SEU-USUARIO.github.io/guia-govbr-facil/`.

## Aviso

Este é um material educativo de extensão universitária. **Não é um site oficial do governo.**
