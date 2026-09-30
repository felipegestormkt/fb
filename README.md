# FB Negócios Imobiliários - Nova Landing Page

Este projeto é a nova Landing Page para a FB Negócios Imobiliários, focada em conversão, alto padrão e construída inteiramente com **HTML5, CSS3 e JavaScript (Vanilla)**. Não há dependências de Node.js, npm ou processos de build.

## Como Executar Localmente

Por ser um projeto puramente estático, você tem duas opções principais:

### Opção 1: Uso Direto (Sem Servidor)
Como a página não faz requisições assíncronas para carregar o conteúdo (os dados estão no arquivo `js/data.js` via tag `<script>`), você pode simplesmente abrir o arquivo `index.html` diretamente em seu navegador (dando um duplo-clique).
*Nota:* As integrações e eventos de DataLayer funcionarão normalmente, mas alguns comportamentos rigorosos de CORS em navegadores modernos podem restringir certas extensões de Tag Assistant quando executados via `file://`.

### Opção 2: Servidor Estático Local (Recomendado)
Para testar os eventos do GTM e garantir o funcionamento exato da experiência web, recomenda-se o uso de um servidor estático.
1. **Com VS Code:** Instale a extensão "Live Server" e clique em "Go Live" na barra inferior ao abrir o arquivo `index.html`.
2. **Com Python:** Abra o terminal na pasta do projeto e rode: `python -m http.server 8000` (acesse `http://localhost:8000`).

## Estrutura de Pastas

- `index.html`: Arquivo principal contendo a estrutura da Landing Page e o Container do GTM.
- `css/style.css`: Estilização completa do projeto (Dark Theme, Glassmorphism).
- `js/data.js`: Banco de dados centralizado com as informações e fotos de todos os imóveis da FB Negócios. Centraliza os dados para fácil atualização.
- `js/main.js`: Lógica de renderização dos imóveis, modals de detalhes, galerias (lightbox), filtros, rotação de WhatsApp (Round Robin) e pushs de DataLayer.
- `assets/`: Contém as imagens otimizadas extraídas da versão original.

## Atualização de Imóveis

Para alterar preços, disponibilidade ou fotos, basta editar o arquivo `js/data.js`. Não é necessário mexer no `index.html` ou `main.js`. O código Javascript vai ler o objeto e injetar os imóveis na vitrine automaticamente.

## Hospedagem (Produção)

Este projeto está pronto para ser enviado para a hospedagem atual da cliente. Como são apenas arquivos estáticos (HTML/CSS/JS), basta enviar o conteúdo desta pasta via FTP, cPanel ou hospedar em serviços modernos como Vercel, Netlify ou GitHub Pages.

## Funcionalidades Implementadas

- **Novo Design Premium:** Uma estética Dark e Dourada alinhada com o público de Balneário Camboriú, inspirada na fluidez de referências do mercado, sem copiar elementos.
- **Round Robin WhatsApp:** Os contatos do WhatsApp rotacionam automaticamente (50/50) entre Fernanda e Ricardo para dividir os leads justos.
- **DataLayer Nativo:** Eventos prontos para o GTM com parâmetros específicos (ver `GUIA_DE_MENSURACAO.md`).
- **Navegação em Modal:** A experiência de visualização de imóvel e galeria não redireciona o cliente para outra página, mantendo o usuário engajado.
