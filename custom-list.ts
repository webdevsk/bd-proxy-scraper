import { proxyList, type Proxy } from "."

const customList: Proxy[] = [
    // add your custom proxies here
]

export function fetchCustomList(){
    proxyList.push(...customList)
}