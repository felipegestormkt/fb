# Guia de Mensuração - FB Negócios Imobiliários

Este guia documenta o rastreamento implementado nativamente no código (DataLayer) e o que precisa ser configurado ou verificado no Google Tag Manager (GTM).

## 1. Container GTM
O código do GTM (`GTM-TZPTNDJ6`) foi adicionado na estrutura do `index.html` estritamente conforme a documentação oficial do Google:
- `<script>` no `<head>`
- `<noscript>` logo após a abertura do `<body>`

O `window.dataLayer = window.dataLayer || [];` é inicializado antes do script do GTM.

## 2. Eventos do DataLayer (Implementados no Código)

O código JS atual dispara os seguintes eventos personalizados no DataLayer. **Nota de Privacidade:** Como solicitado, não enviamos variáveis que possam conter PII (nomes, telefones, emails) para o DataLayer com eventos comuns.

### Evento: `view_property`
Disparado quando o usuário clica em "Ver detalhes" e abre o modal do imóvel.
- **Event Name:** `view_property`
- **Variáveis (Parâmetros):**
  - `property_id`: Identificador interno (ex: `apto-centro`)
  - `property_name`: Nome completo (ex: `Apartamento no Centro`)

### Evento: `click_whatsapp`
Disparado quando qualquer botão de WhatsApp é clicado, enviando o usuário para o aplicativo.
- **Event Name:** `click_whatsapp`
- **Variáveis:**
  - `whatsapp_source`: Posição/Botão clicado (ex: `Hero WhatsApp`, `Card CTA`, `Modal CTA`)
  - `whatsapp_consultant`: Corretor selecionado pelo algoritmo (ex: `Fernanda Bohnenberger`)
  - `whatsapp_property`: Contexto do imóvel (ex: `Geral` ou nome do imóvel)

### Evento: `form_start`
Disparado quando o usuário digita no formulário pela primeira vez na sessão da página.
- **Event Name:** `form_start`
- **Variáveis:**
  - `form_id`: `lead-form`

### Evento: `generate_lead`
Disparado APENAS quando o formulário é validado com sucesso e submetido, pouco antes do cliente ser redirecionado ao WhatsApp.
- **Event Name:** `generate_lead`
- **Variáveis:**
  - `form_id`: `lead-form`
  - `lead_objective`: Opção do select escolhida pelo cliente (ex: `Investimento imobiliário`)
  - `whatsapp_consultant`: Nome do corretor acionado na roleta.

## 3. Configurações Pendentes (Necessárias no Painel do GTM)

O código já expõe a camada de dados perfeitamente. O próximo passo é acessar o painel do GTM (`https://tagmanager.google.com/`) e realizar as configurações:

### A. Criar Variáveis de Camada de Dados
Para capturar os parâmetros dos eventos, crie Variáveis do tipo "Variável da camada de dados" para os nomes abaixo (exatos):
- `property_name`
- `whatsapp_source`
- `whatsapp_consultant`
- `lead_objective`

### B. Criar Acionadores (Triggers)
Crie acionadores do tipo "Evento Personalizado" para os eventos abaixo (nome exato):
- `view_property`
- `click_whatsapp`
- `form_start`
- `generate_lead`

### C. Criar/Configurar as Tags
Associe as Tags (Google Analytics 4, Meta Pixel, Google Ads) aos respectivos acionadores criados.
Exemplo (GA4):
- Tag: "GA4 Event - Gerar Lead"
- Nome do Evento GA4: `generate_lead`
- Parâmetros: `consultor` -> `{{whatsapp_consultant}}`
- Acionador: `generate_lead` (Evento Personalizado)

## 4. Como Validar a Mensuração
1. Abra um Servidor Estático Local.
2. Acesse o **Google Tag Assistant** (`https://tagassistant.google.com/`) e coloque o link do servidor local.
3. Clique e navegue pela página. O Tag Assistant interceptará as ações.
4. Verifique a aba "Data Layer" no Tag Assistant e confirme que as variáveis e eventos estão sendo populados corretamente após você interagir com a página.

**Atenção:** Em formulários, não utilize gatilhos de clique em botões. O uso do evento `generate_lead` diretamente no DataLayer via JavaScript é a única forma de garantir que dados não-preenchidos ou erros de validação nativa não contem falsos positivos nas suas campanhas.
