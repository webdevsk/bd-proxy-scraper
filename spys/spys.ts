import puppeteer from "puppeteer"
import { proxyList, type Proxy } from './../index'

export async function spys(){
    console.log("Launching Browser")
    const browser = await puppeteer.launch({
        // Headless doesn't work for this site as they may have detectors or something
        headless: false
    })

    try {
        console.log("Creating new page")
        const page = await browser.newPage()
        
        console.log("Navigating to spys.one")
        await page.goto("https://spys.one/free-proxy-list/BD/")

        console.log("Navigating through form")
        const form = await page.$('form');
        if (!form) throw new Error("Form not found")

        await form?.evaluate(form => {
            const xpp = form.elements.namedItem("xpp")
            if (!xpp) throw new Error("xpp input element not found")
            ;(xpp as RadioNodeList).value = '5'
            form.submit()
        })
        await page.waitForNavigation()

        console.log("Parsing proxies")
        const proxies = await page.$$eval('tr.spy1xx, tr.spy1x', (elements) => 
            elements.reduce((accumulator: Proxy[], currentElement) => {
                const type= currentElement.querySelector<HTMLTableColElement>('td:nth-child(2)')?.innerText.split(" ")[0].toLocaleLowerCase()
                if (!type || type === 'http') return accumulator

                const ipPort = currentElement.querySelector<HTMLFontElement>('td:first-child font.spy14')?.innerText
                if (!ipPort) return accumulator

                const [ip, port] = ipPort.split(':')
                accumulator.push({type, ip, port})
                return accumulator
            }, [])
        )
        console.log(`Fetched ${proxies.length} proxies`)
        proxyList.push(...proxies)
        
    } catch (error) {
        console.error(error)
    } finally {
        await browser.close()
    }
}