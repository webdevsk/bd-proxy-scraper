import { apiSchema } from "./apiSchema"
import { proxyList } from './../index'

type BodyParams = {
    protocols: ("socks4" | "socks5" | "http" | "https")[],
    "anonlvls": (1 | 2 | 3 | 4)[],
    "country": string,
    "offset": number
}
export async function proxyDb(){
    const defaultPageSize = 30
    let currentPageSize = defaultPageSize
    let offset = 0


    const bodyParams:BodyParams = {
        protocols: ["socks4", "socks5", "https"],
        anonlvls: [],
        offset: offset,
        country: "BD"
    }

    do{
        bodyParams.offset = offset
        // Skip sleeping the first time
        const sleepTime = offset === 0 ? 0 : Math.floor(Math.random() * (3000 - 1000 + 1)) + 1000
        console.log("Sleeping for " + sleepTime + "ms")
        await Bun.sleep(sleepTime)
        
        try {
            const res = await fetch("https://proxydb.net/list", {
                headers: {
                    accept: "application/json",
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
                referrer: "https://proxydb.net/?protocol=socks4&protocol=socks5&country=BD",
                referrerPolicy: "strict-origin-when-cross-origin",
                body: JSON.stringify(bodyParams),
                method: "POST",
                mode: "cors",
                credentials: "omit"
            })
            if (!res.ok || res.status !== 200) throw new Error(`HTTP error! status: ${res.status}; ${res.statusText}`)

            const response = apiSchema.parse(await res.json())
            if ("error" in response) throw new Error(response.error)

            const {proxies, total_count} = response
            console.log(`Fetched ${proxyList.length + proxies.length} proxies out of ${total_count} proxies`)

            proxyList.push(...proxies)
            
            currentPageSize = proxies.length
            offset += defaultPageSize
        
        } catch (error) {
                console.error(error)
                break
        }
    } while(currentPageSize == defaultPageSize)

    return proxyList
    
}