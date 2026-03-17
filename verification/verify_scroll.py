import os
from playwright.sync_api import sync_playwright

BASE_URL = os.getenv("VERIFICATION_BASE_URL", "http://localhost:3000")

def verify_scroll():
    with sync_playwright() as p:
        browser = p.chromium.launch()
        try:
            page = browser.new_page()
            page.goto(BASE_URL)

            # Scroll to blog section using the data-blog-section marker
            blog_section = page.query_selector('[data-blog-section]')
            assert blog_section is not None, "Blog section with [data-blog-section] not found"
            blog_section.scroll_into_view_if_needed()
            page.wait_for_timeout(2000)

            # Try to scroll inside the blog section
            page.mouse.wheel(delta_x=0, delta_y=500)
            page.wait_for_timeout(1000)

            # Take a screenshot to show the blog section
            page.screenshot(path='verification/blog_scroll.png', full_page=True)
        finally:
            browser.close()

if __name__ == "__main__":
    verify_scroll()
