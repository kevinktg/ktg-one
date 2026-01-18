
from playwright.sync_api import sync_playwright

def verify_blog_and_hub():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page(viewport={"width": 1280, "height": 800})

        try:
            print("Navigating to home page...")
            page.goto("http://localhost:3000", timeout=60000)
            page.wait_for_load_state("networkidle")

            # Capture a screenshot of the home page for manual visual inspection.
            print("Capturing home page screenshot for manual verification...")
            page.screenshot(path="verification/home_page.png", full_page=True)

            # 2. Verify Blog Section Exists
            print("Verifying Blog Section...")
            blog_section = page.locator("[data-blog-section]")
            if blog_section.count() > 0:
                print("Blog section found.")
                blog_section.scroll_into_view_if_needed()
                page.screenshot(path="verification/blog_section.png")
            else:
                print("Blog section NOT found!")

        except Exception as e:
            print(f"Error: {e}")
        finally:
            browser.close()

if __name__ == "__main__":
    verify_blog_and_hub()
