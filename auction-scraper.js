import puppeteer from "puppeteer"

async function scrapeAuctionData() {
  console.log("Launching browser...")
  const browser = await puppeteer.launch({
    headless: "new",
  })

  try {
    console.log("Opening new page...")
    const page = await browser.newPage()

    // Navigate to the auction page
    const url = "https://www.freitasleiloeiro.com.br/Leiloes/LoteDetalhes?leilaoId=7024&loteNumero=165"
    console.log(`Navigating to ${url}...`)
    await page.goto(url, { waitUntil: "networkidle2" })

    // Extract the current bid information
    console.log("Extracting auction data...")
    const auctionData = await page.evaluate(() => {
      // Get the current bid
      const currentBidElement = document.querySelector(".valor-atual")
      const currentBid = currentBidElement ? currentBidElement.innerText.trim() : "Not found"

      // Get the item title
      const titleElement = document.querySelector(".titulo-lote")
      const title = titleElement ? titleElement.innerText.trim() : "Not found"

      // Get auction end time if available
      const endTimeElement = document.querySelector(".tempo-restante")
      const endTime = endTimeElement ? endTimeElement.innerText.trim() : "Not found"

      // Get all bids history if available
      const bidsHistory = []
      const bidsElements = document.querySelectorAll(".historico-lances li")
      bidsElements.forEach((bid) => {
        bidsHistory.push(bid.innerText.trim())
      })

      return {
        title,
        currentBid,
        endTime,
        bidsHistory: bidsHistory.length > 0 ? bidsHistory : ["No bid history found"],
      }
    })

    console.log("\n--- AUCTION DATA ---")
    console.log(`Title: ${auctionData.title}`)
    console.log(`Current Bid: ${auctionData.currentBid}`)
    console.log(`End Time: ${auctionData.endTime}`)

    console.log("\n--- BIDS HISTORY ---")
    auctionData.bidsHistory.forEach((bid, index) => {
      console.log(`${index + 1}. ${bid}`)
    })
  } catch (error) {
    console.error("An error occurred:", error)
  } finally {
    console.log("\nClosing browser...")
    await browser.close()
  }
}

scrapeAuctionData()

