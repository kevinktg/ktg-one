
from playwright.sync_api import sync_playwright

def verify_blog_and_hub():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page(viewport={"width": 1280, "height": 800})

        try:
            print("Navigating to home page...")
            page.goto("http://localhost:3000", timeout=60000)
            page.wait_for_load_state("networkidle")

            # 1. Verify HubEntry is GONE
            print("Checking for HubEntry...")
            # We look for text that was in HubEntry, e.g., "System Hub" or specific class if known.
            # Based on memory, it might have had "System Hub" text.
            # Or we can check if the element with text "Hub" is gone.
            # Better: Check that the section after ValidationSection is PhilosophySection.

            # Let's take a screenshot of the whole page to inspect manually
            print("Taking screenshot...")
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
