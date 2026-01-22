from playwright.sync_api import sync_playwright

def verify_blog_section():
    with sync_playwright() as p:
        # Launch browser
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(viewport={'width': 1280, 'height': 800})
        page = context.new_page()

        # Navigate to the page containing the BlogPreview component
        # Assuming it's on the home page or a specific route. Based on file structure, likely home page.
        # We need to run the app first.
        try:
            page.goto("http://localhost:3000")

            # Wait for content to load
            page.wait_for_selector('section[data-blog-section]')

            # Take a screenshot of the initial state
            page.screenshot(path="verification/blog_section_initial.png")
            print("Initial screenshot taken.")

            # Simulate scroll to trigger animations/logic
            # Since the optimization is about scroll handling, we want to ensure basic rendering is intact
            # and that no errors are thrown in the console.

            # Check for console errors
            page.on("console", lambda msg: print(f"Console log: {msg.text}") if msg.type == "error" else None)

            # Scroll down to the blog section
            blog_section = page.locator('section[data-blog-section]')
            blog_section.scroll_into_view_if_needed()
            page.wait_for_timeout(1000) # Wait for any animations

            page.screenshot(path="verification/blog_section_scrolled.png")
            print("Scrolled screenshot taken.")

        except Exception as e:
            print(f"Error: {e}")
        finally:
            browser.close()

if __name__ == "__main__":
    verify_blog_section()
