from playwright.sync_api import sync_playwright
import os

def run_cuj(page):
    page.goto("http://localhost:3000", wait_until="networkidle")
    page.wait_for_timeout(2000)

    # Scroll down to blog section
    page.locator("#blog-section, [data-blog-section]").first.scroll_into_view_if_needed()
    page.wait_for_timeout(1000)

    # Hover over the first card
    card = page.locator(".blog-card").first
    card.hover()
    page.wait_for_timeout(1200)

    # Take screenshot at the key moment
    page.screenshot(path="/home/jules/verification/screenshots/verification.png")
    page.wait_for_timeout(1000)

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch(executable_path="/usr/bin/google-chrome", headless=True)
        context = browser.new_context(
            viewport={"width": 1440, "height": 900},
            record_video_dir="/home/jules/verification/videos"
        )
        page = context.new_page()
        try:
            run_cuj(page)
        finally:
            context.close()
            browser.close()
