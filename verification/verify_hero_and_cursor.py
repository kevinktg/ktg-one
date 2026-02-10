from playwright.sync_api import sync_playwright
import time

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page(viewport={'width': 1280, 'height': 720})

        print("Navigating to home page...")
        page.goto("http://localhost:3001")

        # Wait for hydration
        time.sleep(5)

        print("Checking for Canvas...")
        canvas = page.locator("canvas")
        if canvas.count() > 0:
            print(f"Canvas found: {canvas.count()} instance(s)")
        else:
            print("ERROR: No canvas found!")

        print("Checking for CursorDot elements...")
        # CursorDot uses w-3 h-3 bg-white rounded-full mix-blend-difference
        # We can look for the container or the dots.
        # The container has z-[99999]

        # Let's move the mouse to trigger cursor
        page.mouse.move(500, 500)
        time.sleep(1)
        page.mouse.move(600, 600)
        time.sleep(1)

        dots = page.locator(".mix-blend-difference.rounded-full")
        count = dots.count()
        print(f"Cursor dots found: {count}")

        if count >= 12:
            print("SUCCESS: CursorDot seems to be rendering (12+ dots found)")
        else:
            print(f"WARNING: Expected 12 dots, found {count}")

        print("Taking screenshot...")
        page.screenshot(path="verification/hero_and_cursor.png")

        browser.close()

if __name__ == "__main__":
    run()
