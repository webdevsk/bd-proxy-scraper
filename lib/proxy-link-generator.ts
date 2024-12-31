import type { Proxy } from ".."

export function proxyLinkGenerator({
    ip, port, label, username, password, type
}: Proxy){
    return `${type}://${!!username && !!password ? `${username}:${password}@` : ""}${ip}:${port}#${label ?? `${ip}:${port}`}`
}