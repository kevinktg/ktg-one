from playwright.sync_api import sync_playwright, expect

def verify_cursor(page):
    # Go to home page
    page.goto("http://localhost:3000")

    # Wait for page to load
    page.wait_for_load_state("networkidle")

    # Check for CursorDot elements
    # They have class 'mix-blend-difference' and 'bg-white' and 'rounded-full'
    # There should be 12 of them.
    dots = page.locator(".mix-blend-difference.bg-white.rounded-full")
    count = dots.count()
    print(f"Found {count} cursor dots")

    if count == 0:
        raise Exception("No cursor dots found!")

    # Take screenshot
    page.screenshot(path="verification/cursor_verification.png")

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        try:
            verify_cursor(page)
        finally:
            browser.close()
