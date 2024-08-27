const upstream = 'api.spotify.com'

addEventListener('fetch', event => {
    event.respondWith(fetchAndApply(event.request))
})

async function fetchAndApply(request) {
    const url = new URL(request.url)
    const urlHostname = url.hostname

    url.protocol = 'https:'
    url.host = upstream

    const newRequestHeaders = new Headers(request.headers)
    newRequestHeaders.set('Host', upstream)
    newRequestHeaders.set('Referer', `${url.protocol}//${urlHostname}`)

    const originalResponse = await fetch(url.href, {
        method: request.method,
        headers: newRequestHeaders
    })

    const originalResponseClone = originalResponse.clone()
    const newResponseHeaders = new Headers(originalResponse.headers)

    newResponseHeaders.set('access-control-allow-origin', '*')
    newResponseHeaders.set('access-control-allow-credentials', 'true')
    newResponseHeaders.delete('content-security-policy')
    newResponseHeaders.delete('content-security-policy-report-only')
    newResponseHeaders.delete('clear-site-data')

    return new Response(originalResponseClone.body, {
        status: originalResponse.status,
        headers: newResponseHeaders
    })
}
