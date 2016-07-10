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

    <!-- Hotjar Tracking Code -->
    <script>
       (function(h,o,t,j,a,r){
           h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
           h._hjSettings={hjid:95792,hjsv:5};
           a=o.getElementsByTagName('head')[0];
           r=o.createElement('script');r.async=1;
           r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
           a.appendChild(r);
       })(window,document,'//static.hotjar.com/c/hotjar-','.js?sv=');
    </script>
    <!-- End Hotjar Tracking Code -->

    <div id="app">${data.body}</div>


    <script src="/app.js"></script>

    <!-- For Google search display -->
    <script type="application/ld+json">
    {
      "@context": "http://schema.org",
      "@type": "Organization",
      "name" : "Book of the Month",
      "url": "http://www.bookofthemonth.com",
      "logo": "https://s3.amazonaws.com/botm-media/landing/coin_navy.jpg"
    }
    </script>


    <!-- Google Tag Manager -->
    <noscript><iframe src="//www.googletagmanager.com/ns.html?id=GTM-MMCLSL"
    height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
    <script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
    new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
    j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
    '//www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
    })(window,document,'script','dataLayer','GTM-MMCLSL');</script>
    <!-- End Google Tag Manager -->

    <!-- Chartbeat Tracking Script -->
    <script type="text/javascript">
      var _sf_async_config = { uid: 54121, domain: 'bookofthemonth.com', useCanonical: true };
      (function() {
        function loadChartbeat() {
          window._sf_endpt = (new Date()).getTime();
          var e = document.createElement('script');
          e.setAttribute('language', 'javascript');
          e.setAttribute('type', 'text/javascript');
          e.setAttribute('src','//static.chartbeat.com/js/chartbeat.js');
          document.body.appendChild(e);
        };
        var oldonload = window.onload;
        window.onload = (typeof window.onload != 'function') ?
                loadChartbeat : function() { oldonload(); loadChartbeat(); };
      })();
    </script>
    <!-- End Chartbeat Tracking Script -->
    <!-- begin olark code -->
    <script data-cfasync="false" type='text/javascript'>/*<![CDATA[*/window.olark||(function(c){var f=window,d=document,l=f.location.protocol=="https:"?"https:":"http:",z=c.name,r="load";var nt=function(){
    f[z]=function(){
    (a.s=a.s||[]).push(arguments)};var a=f[z]._={
    },q=c.methods.length;while(q--){(function(n){f[z][n]=function(){
    f[z]("call",n,arguments)}})(c.methods[q])}a.l=c.loader;a.i=nt;a.p={
    0:+new Date};a.P=function(u){
    a.p[u]=new Date-a.p[0]};function s(){
    a.P(r);f[z](r)}f.addEventListener?f.addEventListener(r,s,false):f.attachEvent("on"+r,s);var ld=function(){function p(hd){
    hd="head";return["<",hd,"></",hd,"><",i,' onl' + 'oad="var d=',g,";d.getElementsByTagName('head')[0].",j,"(d.",h,"('script')).",k,"='",l,"//",a.l,"'",'"',"></",i,">"].join("")}var i="body",m=d[i];if(!m){
    return setTimeout(ld,100)}a.P(1);var j="appendChild",h="createElement",k="src",n=d[h]("div"),v=n[j](d[h](z)),b=d[h]("iframe"),g="document",e="domain",o;n.style.display="none";m.insertBefore(n,m.firstChild).id=z;b.frameBorder="0";b.id=z+"-loader";if(/MSIE[ ]+6/.test(navigator.userAgent)){
    b.src="javascript:false"}b.allowTransparency="true";v[j](b);try{
    b.contentWindow[g].open()}catch(w){
    c[e]=d[e];o="javascript:var d="+g+".open();d.domain='"+d.domain+"';";b[k]=o+"void(0);"}try{
    var t=b.contentWindow[g];t.write(p());t.close()}catch(x){
    b[k]=o+'d.write("'+p().replace(/"/g,String.fromCharCode(92)+'"')+'");d.close();'}a.P(2)};ld()};nt()})({
    loader: "static.olark.com/jsclient/loader0.js",name:"olark",methods:["configure","extend","declare","identify"]});
    /* custom configuration goes here (www.olark.com/documentation) */
    olark.identify('8582-904-10-8141');/*]]>*/</script><noscript><a href="https://www.olark.com/site/8582-904-10-8141/contact" title="Contact us" target="_blank">Questions? Feedback?</a> powered by <a href="http://www.olark.com?welcome" title="Olark live chat software">Olark live chat software</a></noscript>
    <!-- end olark code -->
    <script> olark.configure('system.group', '3ad5b2ad3f1bc051e0a5a37e60edbcfb'); /*Routes to BOTM*/ </script>
    <!-- served by: ${data.hostname} in ${Math.round((Date.now() - data.startTime))}ms -->
  </body>
</html>`.toString();
};