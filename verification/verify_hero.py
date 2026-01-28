
from playwright.sync_api import sync_playwright
import time

def verify_hero(page):
    print("Navigating to home page...")
    page.goto("http://localhost:3001")

    print("Waiting for hero section...")
    # Wait for the canvas to be present
    page.wait_for_selector("canvas", timeout=10000)

    # Wait a bit for the fade-in animation (duration-1000)
    time.sleep(2)

    print("Taking screenshot...")
    page.screenshot(path="verification/hero_verification.png")
    print("Screenshot saved.")

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        try:
            verify_hero(page)
        except Exception as e:
            print(f"Error: {e}")
        finally:
            browser.close()
