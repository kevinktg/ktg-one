from playwright.sync_api import sync_playwright

def test_aria_labels():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        page.goto("http://localhost:3000/agent")
        page.wait_for_timeout(2000)

        page.screenshot(path="verification/aria_labels.png")

        print("Checking New conversation button...")
        new_chat_btn = page.locator('button[aria-label="New conversation"]')
        print(f"New conversation button found: {new_chat_btn.count() > 0}")

        print("Checking Send message button...")
        send_message_btn = page.locator('button[aria-label="Send message"]')
        print(f"Send message button found: {send_message_btn.count() > 0}")

        browser.close()

if __name__ == "__main__":
    test_aria_labels()
