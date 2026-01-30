from playwright.sync_api import sync_playwright

def verify_hero():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # Navigate to the home page
        print("Navigating to home page...")
        page.goto("http://localhost:3001")

        # Wait for the canvas to be present (it's inside HeroImages)
        # The canvas is rendered by R3F, so it should be a <canvas> tag.
        print("Waiting for canvas...")
        page.wait_for_selector("canvas", timeout=10000)

        # Give it a moment to render textures
        print("Waiting for render...")
        page.wait_for_timeout(3000)

        # Take a screenshot
        screenshot_path = "verification/hero_optimization.png"
        page.screenshot(path=screenshot_path)
        print(f"Screenshot saved to {screenshot_path}")

        browser.close()

if __name__ == "__main__":
    verify_hero()
