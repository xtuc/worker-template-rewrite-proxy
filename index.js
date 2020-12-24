addEventListener("fetch", event => {
  const host = event.request.headers.get('x-host');
  if (host) {
    event.respondWith(proxy(event, host));
  } else {
    const response = new Response('x-Host headers missing', {status: 403});
    event.respondWith(response);
  }
});

async function proxy(event, host) {
  const url = new URL(event.request.url);
  const originUrl = url.protocol + '//' + host + url.pathname + url.search;
  let init = {
    method: event.request.method,
    redirect: "manual",
    headers: [...event.request.headers]
  };
  return rewrite(await fetch(originUrl, init));
}

function rewrite(response) {
  return new HTMLRewriter()
    .on("h1,h2,h3", {
      element(e) {
        e.setInnerContent("hallo")
      }
    })
    .transform(response);
}
