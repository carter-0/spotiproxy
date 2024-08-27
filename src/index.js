const upstream = 'api.spotify.com'

addEventListener('fetch', event => {
    event.respondWith(fetchAndApply(event.request));
})

async function fetchAndApply(request) {
    let response = null;
    let url = new URL(request.url);
    let url_hostname = url.hostname;

    url.protocol = 'https:'
    url.host = upstream;

    let method = request.method;
    let request_headers = request.headers;
    let new_request_headers = new Headers(request_headers);

    new_request_headers.set('Host', upstream_domain);
    new_request_headers.set('Referer', url.protocol + '//' + url_hostname);

    let original_response = await fetch(url.href, {
        method: method,
        headers: new_request_headers
    })

    let original_response_clone = original_response.clone();
    let response_headers = original_response.headers;
    let new_response_headers = new Headers(response_headers);
    let status = original_response.status;
    
    if (disable_cache) {
        new_response_headers.set('Cache-Control', 'no-store');
    }

    new_response_headers.set('access-control-allow-origin', '*');
    new_response_headers.set('access-control-allow-credentials', true);
    new_response_headers.delete('content-security-policy');
    new_response_headers.delete('content-security-policy-report-only');
    new_response_headers.delete('clear-site-data');

    response = new Response(original_response_clone.body, {
        status,
        headers: new_response_headers
    })

    return response;
}
