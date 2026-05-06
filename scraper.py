from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.edge.options import Options
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time

# ---------------- SETUP ----------------
options = Options()
options.add_argument(r"user-data-dir=C:\selenium-edge-profile")
options.add_argument("--remote-debugging-port=9222")
options.add_argument("--start-maximized")


driver = webdriver.Edge(options=options)

# ---------------- OPEN PAGE ----------------
driver.get('https://westernu.brightspace.com/d2l/le/worktodo/view')

print("Waiting 30 seconds for manual login/page load...")


# ---------------- HANDLE IFRAME (IF EXISTS) ----------------
iframes = driver.find_elements(By.TAG_NAME, "iframe")
if len(iframes) > 0:
    driver.switch_to.frame(iframes[0])
    print("Switched to iframe context.")

# ---------------- WAIT FOR MAIN CONTAINER ----------------
print("Waiting for Work To Do container...")
wait = WebDriverWait(driver, 20)
wait.until(EC.presence_of_element_located((By.TAG_NAME, "d2l-w2d-work-to-do")))

# ---------------- METHOD 1: FULL SHADOW DOM SCRAPE ----------------

print("Attempting full Shadow DOM extraction...")
#Collecting of each of the links
script = """
const foundItems = [];

let root1 = document.querySelector("d2l-w2d-work-to-do")?.shadowRoot;
let root2 = root1?.querySelector("d2l-w2d-collections")?.shadowRoot;                //goes to the collection of all lists of assignments

for (let i = 1; i <= 100; i++) {
    let root3 = root2?.querySelector(`d2l-w2d-list:nth-child(${i})`)?.shadowRoot;   //goes inside of each individual lists
    if (!root3) continue;

    for (let j = 1; j <= 100; j++) {

        const item = root3.querySelector(
            `d2l-w2d-list-item-assignment:nth-child(${j})`                          //goes inside of each individual assignment(First type, ASSIGNMENT)
        );

        const link1 = item?.shadowRoot?.querySelector("a");
        if (link1) {
            foundItems.push(link1.href);
        }

        const content = root3.querySelector(
            `d2l-w2d-list-item-content:nth-child(${j})`                             //goes inside of each individual assignment(Second type, CONTENT)
        );

        const link2 = content?.shadowRoot?.querySelector("a");
        if (link2) {
            foundItems.push(link2.href);
        }
    }
}

return foundItems;
"""
results = driver.execute_script(script)
print(results)
while(len(results)!=0):
    print(results[0])
    
    driver.get(results[0])
    description = driver.execute_script("""return document.querySelector("d2l-html-block").getAttribute("html");""")
    print(description)

    due_date = driver.execute_script("""return document.querySelector("#z_i > td > div > div").innerText""")
    print(due_date)
    results.pop(0)
# ---------------- CLEANUP ----------------

time.sleep(10)
driver.quit()

# the link 1
"""
document.querySelector("d2l-w2d-work-to-do")
.shadowRoot.querySelector("d2l-w2d-collections")
.shadowRoot.querySelector("d2l-w2d-list:nth-child(3)")
.shadowRoot.querySelector("d2l-w2d-list-item-assignment:nth-child(1)")
.shadowRoot.querySelector("#d2l-uid-96")
"""

#the link 2
"""document.querySelector("d2l-w2d-work-to-do")
.shadowRoot.querySelector("d2l-w2d-collections")
.shadowRoot.querySelector("d2l-w2d-list:nth-child(3)")
.shadowRoot.querySelector("d2l-w2d-list-item-assignment:nth-child(2)")
.shadowRoot.querySelector("#d2l-uid-101")"""
#the first bit
"""
document.querySelector("d2l-w2d-work-to-do")
.shadowRoot.querySelector("d2l-w2d-collections")
.shadowRoot.querySelector("d2l-w2d-list:nth-child(3)")
.shadowRoot.querySelector("d2l-w2d-list-item-assignment:nth-child(1)")
"""
#the link
"""
document.querySelector("body > d2l-w2d-work-to-do")
.shadowRoot.querySelector("d2l-w2d-collections")
.shadowRoot.querySelector("d2l-w2d-list:nth-child(3)")
.shadowRoot.querySelector("d2l-w2d-list-item-assignment:nth-child(1)")
.shadowRoot.querySelector("#d2l-uid-96")
"""