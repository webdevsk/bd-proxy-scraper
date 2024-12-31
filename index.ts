import { fetchCustomList } from "./custom-list"
import { proxyLinkGenerator } from "./lib/proxy-link-generator"
import { proxyDb } from "./proxydb/proxydb"
import { spys } from "./spys/spys"

export type Proxy = {
    ip: string,
    port: number,
    type: string,
    username?: string,
    password?: string,
    label?: string
}

export const proxyList: Proxy[] = []
export const devMode = false

export function logMsg(msg: String){
    console.log("=====================================")
    console.log(msg)
    console.log("=====================================")
}

async function init(){
    logMsg("Fetching from proxydb")
    await proxyDb()
    logMsg("Fetching from spys.one")
    await spys()
    logMsg("Fetching from local file")
    fetchCustomList()

    if (devMode) return
    
    console.log("Total proxies length: " + proxyList.length)

    // Removing duplicates
    const uniqeProxies = [...new Map<string, Proxy>(proxyList.map(proxy => [[proxy.ip, proxy.port].join(":"), proxy])).values()]

    console.log("Deduplicated proxies length: " + uniqeProxies.length)

    // Grouping by type
    const proxiesByType = Object.groupBy(uniqeProxies, proxy => proxy.type)
    proxiesByType["mixed"] = uniqeProxies

    // Looping through each type and writing to file
    Object.entries(proxiesByType).forEach(async ([type, proxies]) => {
        if (!proxies || !proxies.length) return

        // Generating proxy links
        const template = proxies.map(proxyLinkGenerator).join("\n")

        logMsg(`Writing to files`)

        try{
            await Bun.write(`./output/${type}.txt`, template)
            console.log(`Done writing to file: 'output/${type}.txt'`)
        } catch (error){
            console.error("Failed to write to file", error)
        }
    })

    logMsg("Operation terminated.")
}

init()