from playwright.sync_api import sync_playwright

def test_scroll():
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()
        page.goto('http://localhost:3001')

        # Scroll to blog section
        page.evaluate("window.scrollTo(0, document.body.scrollHeight)")
        page.wait_for_timeout(2000)

        # Try to scroll inside the blog section
        page.mouse.wheel(delta_x=0, delta_y=500)
        page.wait_for_timeout(1000)

        # Take a screenshot to show the blog section
        page.screenshot(path='verification/blog_scroll.png', full_page=True)
        browser.close()

if __name__ == "__main__":
    test_scroll()
