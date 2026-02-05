from playwright.sync_api import sync_playwright

def verify_blog_preview():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # Go to localhost:3001
        print("Navigating to page...")
        page.goto("http://localhost:3001")

        # Scroll to the blog section
        print("Finding blog section...")
        blog_section = page.locator("[data-blog-section]")
        blog_section.scroll_into_view_if_needed()

        # Wait for animation? It has GSAP animation.
        print("Waiting for animation...")
        page.wait_for_timeout(3000) # Give it time to animate in

        # Take screenshot
        print("Taking screenshot...")
        page.screenshot(path="verification/blog_preview.png")

        browser.close()
        print("Done.")

if __name__ == "__main__":
    verify_blog_preview()
