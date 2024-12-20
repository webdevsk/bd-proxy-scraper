export function proxyLinkGenerator({
    ip, port, label, username, password, type
}: {
    ip: string
    port: number
    label?: string
    username?: string
    password?: string
    type: string
}){
    return `${type}://${!!username && !!password ? [username, password].join(":").concat("@") : ""}${ip}:${port}#${label ?? `${ip}:${port}`}`
}