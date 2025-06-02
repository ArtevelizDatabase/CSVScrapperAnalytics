// Tooltip functionality for tags
;(() => {
  let tooltip = null
  let activeTag = null
  let hideTimeout = null
  let showTimeout = null
  const SHOW_DELAY = 200 // ms sebelum tooltip muncul
  const HIDE_DELAY = 80  // ms sebelum tooltip hilang

  function initTooltip() {
    tooltip = document.getElementById("tooltip")
    if (!tooltip) {
      console.error("Tooltip element not found")
      return null
    }
    initItemPopup()
    setupTooltipListeners()
  }

  function initItemPopup() {
    const popup = document.getElementById("item-popup")
    const closeButton = document.getElementById("close-popup")
    if (closeButton) {
      closeButton.addEventListener("click", () => {
        if (popup) popup.style.display = "none"
      })
    }
    if (popup) {
      popup.addEventListener("click", (e) => {
        if (e.target === popup) {
          popup.style.display = "none"
        }
      })
    }
  }

  function showItemPopup(item) {
    const popup = document.getElementById("item-popup")
    const popupTitle = document.getElementById("popup-title")
    const popupAuthor = document.getElementById("popup-author")
    const popupCategory = document.getElementById("popup-category")
    const popupSubcategories = document.getElementById("popup-subcategories")
    const popupSubcategoriesContainer = document.getElementById("popup-subcategories-container")
    const popupLink = document.getElementById("popup-link")

    if (popupTitle) popupTitle.textContent = item.title || "Untitled Item"
    if (popupAuthor) popupAuthor.textContent = `Author: ${item.author || "Unknown author"}`
    if (popupCategory) popupCategory.textContent = `Category: ${item.category || "Uncategorized"}`

    if (popupSubcategoriesContainer && popupSubcategories) {
      if (item.subcategories && Array.isArray(item.subcategories) && item.subcategories.length > 0) {
        popupSubcategoriesContainer.style.display = "block"
        popupSubcategories.innerHTML = ""
        item.subcategories.forEach((subcategory) => {
          const pill = document.createElement("span")
          pill.className = "tag-pill"
          pill.textContent = subcategory
          popupSubcategories.appendChild(pill)
        })
      } else {
        popupSubcategoriesContainer.style.display = "none"
      }
    }

    if (popupLink) {
      if (item.link) {
        popupLink.href = item.link
        popupLink.style.display = "inline-flex"
      } else {
        popupLink.href = "#"
        popupLink.style.display = "none"
      }
    }

    if (popup) {
      popup.style.display = "flex"
    }
  }

  function showTooltip(tag, event) {
    clearTimeout(hideTimeout)
    clearTimeout(showTimeout)
    activeTag = tag

    showTimeout = setTimeout(() => {
      const type = tag.dataset.type
      const name = tag.dataset.name
      const count = tag.dataset.count || 0

      if (!type || !name) return

      const scrapedItems = window.ChartManager ? window.ChartManager.getRawData() : []
      const items = scrapedItems.filter((item) => {
        if (!item) return false
        if (type === "author") return item.AuthorName === name || item.UserId === name
        if (type === "category") return item.Category === name
        if (type === "theme") return item.Theme === name
        return false
      })

      const tooltipTitle = document.getElementById("tooltip-title")
      const tooltipCount = document.getElementById("tooltip-count")
      const tooltipItems = document.getElementById("tooltip-items")

      if (tooltipTitle) tooltipTitle.textContent = `${name} (${items.length} total)`
      if (tooltipCount) tooltipCount.textContent = `${items.length} items`
      if (tooltipItems) tooltipItems.innerHTML = ""

      items.forEach((item) => {
        const itemElement = document.createElement("div")
        itemElement.className = "tooltip-item"

        const infoContainer = document.createElement("div")
        infoContainer.style.flex = "1"
        infoContainer.style.overflow = "hidden"

        const titleElement = document.createElement("div")
        titleElement.className = "tooltip-item-title"
        titleElement.textContent = item.ProductName || "Untitled"

        const categoryElement = document.createElement("div")
        categoryElement.className = "tooltip-item-category"
        if (type === "author") {
          categoryElement.textContent = item.Category || "Template"
        } else {
          categoryElement.textContent = item.AuthorName || "Unknown author"
        }

        infoContainer.appendChild(titleElement)
        infoContainer.appendChild(categoryElement)
        itemElement.appendChild(infoContainer)

        if (item.ProductURL) {
          const linkElement = document.createElement("a")
          linkElement.className = "tooltip-item-link"
          linkElement.href = item.ProductURL
          linkElement.target = "_blank"
          linkElement.innerHTML = '<i class="fas fa-external-link-alt"></i>'
          linkElement.addEventListener("click", (e) => e.stopPropagation())
          itemElement.appendChild(linkElement)
        }

        itemElement.addEventListener("click", () => {
          const popupItem = {
            title: item.ProductName || "Untitled",
            author: item.AuthorName || "Unknown author",
            category: item.Category || "Uncategorized",
            link: item.ProductURL || null,
            subcategories: item.Theme ? [item.Theme] : [],
          }
          showItemPopup(popupItem)
          tooltip.style.display = "none"
        })

        if (tooltipItems) tooltipItems.appendChild(itemElement)
      })

      positionTooltip(tag)
      tooltip.style.display = "block"
      setTimeout(() => {
        tooltip.style.opacity = "1"
        tooltip.style.pointerEvents = "auto"
      }, 10)
    }, SHOW_DELAY)
  }

  function positionTooltip(element) {
    const rect = element.getBoundingClientRect()
    const tooltipWidth = 320

    let top = rect.bottom + window.scrollY + 5
    let left = rect.left + window.scrollX

    const viewportWidth = window.innerWidth
    const rightEdge = left + tooltipWidth

    if (rightEdge > viewportWidth) {
      left = Math.max(10, viewportWidth - tooltipWidth - 20)
    }

    const tooltipHeight = tooltip.offsetHeight || 300
    const viewportHeight = window.innerHeight
    const bottomEdge = top + tooltipHeight

    if (bottomEdge > viewportHeight + window.scrollY) {
      top = rect.top + window.scrollY - tooltipHeight - 5

      if (top < window.scrollY) {
        top = window.scrollY + 10
      }
    }

    tooltip.style.top = `${top}px`
    tooltip.style.left = `${left}px`
    tooltip.style.width = `${tooltipWidth}px`
  }

  function hideTooltip() {
    clearTimeout(showTimeout)
    hideTimeout = setTimeout(() => {
      if (tooltip) {
        tooltip.style.opacity = "0"
        tooltip.style.pointerEvents = "none"
        setTimeout(() => {
          tooltip.style.display = "none"
        }, 150) // biar animasi opacity selesai
      }
    }, HIDE_DELAY)
  }

  function setupTooltipListeners() {
    // Bersihkan listener lama
    document.querySelectorAll('.tag').forEach(tag => {
      tag.removeEventListener('mouseenter', tag._mouseenterHandler)
      tag.removeEventListener('mouseleave', tag._mouseleaveHandler)
    })

    // Tambahkan listener baru
    document.querySelectorAll('.tag').forEach(tag => {
      tag._mouseenterHandler = (e) => showTooltip(tag, e)
      tag._mouseleaveHandler = hideTooltip
      tag.addEventListener('mouseenter', tag._mouseenterHandler)
      tag.addEventListener('mouseleave', tag._mouseleaveHandler)
    })

    if (tooltip) {
      tooltip.addEventListener('mouseenter', () => clearTimeout(hideTimeout))
      tooltip.addEventListener('mouseleave', hideTooltip)
    }
  }

  // Initialize when DOM is ready
  document.addEventListener("DOMContentLoaded", () => {
    initTooltip()
    // Buat global supaya bisa dipanggil ulang setelah render
    window.TooltipManager = {
      addTooltipListeners: setupTooltipListeners,
      showItemPopup: showItemPopup,
    }
  })
})()
