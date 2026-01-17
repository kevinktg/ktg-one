from playwright.sync_api import Page, expect, sync_playwright
import time

def test_blog_scroll(page: Page):
    # Navigate to home
    page.goto("http://localhost:3000")

    # Wait for page load
    page.wait_for_timeout(2000)

    # Scroll to blog section using the menu or just scrolling down
    # Since it's a long scroll page, we can try to find the "blog" heading

    # Alternatively, we can just execute javascript to scroll into view
    page.evaluate("document.querySelector('[data-blog-section]').scrollIntoView()")

    page.wait_for_timeout(2000)

    # Check if buttons are visible (desktop only)
    buttons_container = page.locator("button[aria-label='Scroll left']").first
    if buttons_container.is_visible():
        print("Scroll buttons found")
    else:
        print("Scroll buttons not found (might be mobile view or hidden)")

    # Take screenshot of the blog section
    page.screenshot(path="/home/jules/verification/blog_scroll.png")

if __name__ == "__main__":
    with sync_playwright() as p:
        # Launch with a window size big enough for desktop view to trigger the md:flex
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(viewport={"width": 1440, "height": 900})
        page = context.new_page()
        try:
            test_blog_scroll(page)
        finally:
            browser.close()
