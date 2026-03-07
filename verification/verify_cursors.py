import time
from playwright.sync_api import sync_playwright

def verify_cursors():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        # Create a new page with a decent viewport size
        page = browser.new_page(viewport={"width": 1280, "height": 800})

        # Navigate to the local server
        page.goto("http://localhost:3002")

        # Wait for the page to load and components to mount
        page.wait_for_timeout(2000)

        # Move the mouse to trigger the event-driven RAF in GlobalCursor
        # and the GSAP animation in CursorDot
        page.mouse.move(100, 100)
        page.wait_for_timeout(100)
        page.mouse.move(200, 200)
        page.wait_for_timeout(100)
        page.mouse.move(300, 300)
        page.wait_for_timeout(100)
        page.mouse.move(400, 400)
        page.wait_for_timeout(100)

        # Take a screenshot to capture the cursors in motion
        page.screenshot(path="verification/cursors.png")

        browser.close()

if __name__ == "__main__":
    verify_cursors()
    print("Verification script completed.")
