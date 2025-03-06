import { proxyList, type Proxy } from "."
import { unknown1 } from "./local/unknown1"

const customList: Proxy[] = [
    // add your custom proxies here
    ...unknown1

]


export function fetchCustomList(){
    proxyList.push(...customList)
}