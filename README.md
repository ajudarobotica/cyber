# CyberAjuda: página de portfólio cultural

Projeto estático em HTML, CSS e JavaScript, sem dependências externas e pronto para hospedagem.

## Executar localmente

1. Abra um terminal nesta pasta.
2. Execute `python -m http.server 8080`.
3. Acesse `http://localhost:8080`.

Também é possível abrir `index.html` diretamente, mas um servidor local é recomendado para testar todos os recursos.

## Publicação

Envie todo o conteúdo desta pasta para a raiz do domínio. Os arquivos `robots.txt`, `sitemap.xml`, `manifest.webmanifest` e as metatags sociais já estão configurados para `https://cyberajuda.com.br/`.

## Estrutura

- `index.html`: conteúdo e estrutura semântica
- `css/styles.css`: identidade visual responsiva
- `js/script.js`: menu, animações, contadores e lightbox
- `assets/`: logotipo, favicon e imagens otimizadas em WebP

## Ajustes rápidos

- Textos: edite diretamente em `index.html`.
- Cores: altere as variáveis no início de `css/styles.css`.
- Fotos: substitua os arquivos em `assets/img/`, preservando os nomes.
- Links de vídeo e redes sociais: estão no bloco “Projeto em movimento” do `index.html`.
