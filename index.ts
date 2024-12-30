import { proxyLinkGenerator } from "./lib/proxy-link-generator"
import { proxyDb } from "./proxydb/proxydb"
import { spys } from "./spys/spys"

export const proxyList: Array<{
    type: string,
    ip: string,
    port: number
}> = []
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

    if (devMode) return
    
    console.log("Total proxies length: " + proxyList.length)
    
    const uniqeProxies = new Set<ReturnType<typeof proxyLinkGenerator>>()

    for (const proxy of proxyList){
       const link =  proxyLinkGenerator(proxy)
       uniqeProxies.add(link)
    }
    console.log("Deduplicated proxies length: " + uniqeProxies.size)
    const template = [...uniqeProxies.values()].join("\n")

    try{
        logMsg("Writing to file")
        await Bun.write("./output/mixed.txt", template)
        console.log("Done writing to file.")
    } catch (error){
        console.error("Failed to write to file")
        console.error(error)
    }
    logMsg("Operation terminated.")
}

init()