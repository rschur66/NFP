export default function (data, initialState) {
  return `<!doctype html>
<html class="no-js" lang="">
  <head>
    <script type="text/javascript">var _sf_startpt=(new Date()).getTime()</script>
    <script>
      window.INITIAL_STATE = ${initialState};
    </script>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title id="meta-title">${data.title}</title>
    <meta name="keywords" id="meta-keywords" content="${data.keywords}">
    <rel id="rel-canonical" link="canonical" href="${data.url}" />
    <meta name="google­site­verification" content="google4be264f17ec407d0.html">
    <meta name="google-site-verification" content="qgwPDR-EMEifTS9xjoKXokxKwT43P3zrJfs3UsXCHR8" />
    <meta name="description" id="meta-description" content="${data.description}">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta charset="utf-8">
    <meta property="og:type" id="meta-og-type" content="${data.type}" >
    <meta property="fb:app_id" content="691208787687437">
    <meta property="og:title" id="meta-og-title" content="${data.title}">
    <meta property="og:url" id="meta-og-url" content="${data.url}">
    <meta property="og:image" id="meta-og-image" content="${data.image}">
    <meta property="og:description" id="meta-og-description" content="${data.description}">
    <meta name="p:domain_verify" content="8b3b42498f282f321d0bb9ff279ecb06"/>
    <link rel="stylesheet" href="/master.css" >
    <link rel="icon" type="image/ico"  href="/images/favicon.ico">
  </head>
  <body id="body">

    <div id="app">${data.body}</div>

    <script src="/app.js"></script>

    <!-- served by: ${data.hostname} in ${Math.round((Date.now() - data.startTime))}ms -->
  </body>
</html>`.toString();
};