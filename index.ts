import { proxyLinkGenerator } from "./lib/proxy-link-generator"
import { apiSchema, type Proxies } from "./lib/schema"

async function proxyDb(){
    const proxyList: Proxies = []

    const defaultPageSize = 15
    let currentPageSize = 15
    let offset = 0

    const bodyParams = new URLSearchParams()
    // bodyParams.append("protocol", "http")
    bodyParams.append("protocol", "https")
    bodyParams.append("protocol", "socks4")
    bodyParams.append("protocol", "socks5")
    bodyParams.append("country", "BD")
    
    do{
        bodyParams.set("offset", offset.toString())
        // Skip sleeping the first time
        const sleepTime = offset === 0 ? 0 : Math.floor(Math.random() * (3000 - 1000 + 1)) + 1000
        console.log("Sleeping for " + sleepTime + "ms")
        await Bun.sleep(sleepTime)
        
        try {
            const response = await fetch("https://proxydb.net/list", {
                "headers": {
                    "accept": "application/json",
                    "accept-language": "en-US,en;q=0.9,bn;q=0.8",
                    "content-type": "application/x-www-form-urlencoded;charset=UTF-8",
                    "sec-ch-ua": "\"Microsoft Edge\";v=\"131\", \"Chromium\";v=\"131\", \"Not_A Brand\";v=\"24\"",
                    "sec-ch-ua-mobile": "?0",
                    "sec-ch-ua-platform": "\"Windows\"",
                    "sec-fetch-dest": "empty",
                    "sec-fetch-mode": "cors",
                    "sec-fetch-site": "same-origin",
                    "x-requested-with": "XMLHttpRequest"
                },
                "referrer": "https://proxydb.net/?protocol=socks4&protocol=socks5&country=BD",
                "referrerPolicy": "strict-origin-when-cross-origin",
                "body": bodyParams.toString(),
                "method": "POST",
                "mode": "cors",
                "credentials": "omit"
            })
            const {proxies, total_count} = apiSchema.parse(await response.json())
            console.log(`Fetched ${proxyList.length + proxies.length} proxies out of ${total_count} proxies`)

            proxies.map(proxy => proxyList.push(proxy))
            currentPageSize = proxies.length
            offset += defaultPageSize
        
        } catch (error) {
                console.error(error)
                break
        }
    } while(currentPageSize == defaultPageSize)

    const template = proxyList.map(proxyLinkGenerator).join("\n")

    try{
        console.log("Writing to file")
        await Bun.write("./output/mixed.txt", template)
        console.log("Done writing to file.")
    } catch (error){
        console.error("Failed to write to file")
        console.error(error)
    }
    console.log("Operation terminated.")
}

proxyDb()